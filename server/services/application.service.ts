import {
  applications,
  companies,
  addresses,
  applicationHistories,
  applications_to_contacts,
  applications_to_documents,
} from "~~/server/db/schema";
import {
  applicationResponseSchema,
  type ApplicationResponsePayload,
  type ApplicationCreatePayload,
  type Status,
} from "~~/shared/schemas/application.schema";
import { eq, desc, and, inArray, asc } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { documentService } from "./document.service";
import { createLogger } from "../utils/logger";

const logger = createLogger("application");

export const applicationService = {
  async getAll(limit?: number): Promise<ApplicationResponsePayload[]> {
    logger.info("getAll", "Fetching all applications", { limit });

    const allApplications = await db.query.applications.findMany({
      limit,
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
        histories: true,
        documents: { with: { document: true } },
      },
      orderBy: [desc(applications.createdAt)],
    });

    logger.info("getAll", `Found ${allApplications.length} applications`);

    return Promise.all(
      allApplications.map(async (app) => {
        const withFallbackDocs = { ...app };
        if (!withFallbackDocs.documents?.length) {
          withFallbackDocs.documents =
            await documentService.getForApplicationWithFallback(app.id);
        }
        return applicationResponseSchema.parse(withFallbackDocs);
      }),
    );
  },

  async getBySlug(slug: string): Promise<ApplicationResponsePayload | null> {
    logger.info("getBySlug", `Fetching application with slug: ${slug}`);

    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
        histories: {
          orderBy: [
            desc(applicationHistories.createdAt),
            desc(applicationHistories.id),
          ],
        },
        documents: {
          with: { document: true },
          orderBy: [asc(applications_to_documents.sortOrder)],
        },
      },
    });

    if (!application) {
      logger.warn("getBySlug", `Application not found: ${slug}`);
      return null;
    }

    logger.info("getBySlug", `Found application: ${slug}`);

    const withFallbackDocs = { ...application };
    if (!withFallbackDocs.documents?.length) {
      withFallbackDocs.documents =
        await documentService.getForApplicationWithFallback(application.id);
    }
    return applicationResponseSchema.parse(withFallbackDocs);
  },

  async addHistory(
    slug: string,
    data: {
      status: Status;
      notes?: string | null;
      scheduled_at?: Date | null;
      createdAt?: Date;
    },
  ) {
    logger.info("addHistory", `Adding history to application: ${slug}`, {
      status: data.status,
    });

    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
    });
    if (!application) {
      logger.warn("addHistory", `Application not found: ${slug}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    logger.info("addHistory", `Added history to application: ${slug}`);

    return await db
      .insert(applicationHistories)
      .values({
        applicationId: application.id,
        status: data.status,
        notes: data.notes,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
      })
      .returning();
  },

  async updateHistory(
    historyId: number,
    data: {
      status?: Status;
      notes?: string | null;
      scheduled_at?: Date | null;
      createdAt?: Date;
    },
  ) {
    return await db
      .update(applicationHistories)
      .set(data)
      .where(eq(applicationHistories.id, historyId))
      .returning();
  },

  async deleteHistory(historyId: number) {
    return await db
      .delete(applicationHistories)
      .where(eq(applicationHistories.id, historyId))
      .returning();
  },

  async deleteBySlug(slug: string) {
    logger.info("deleteBySlug", `Deleting application: ${slug}`);

    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
    });

    if (!application) {
      logger.warn("deleteBySlug", `Application not found: ${slug}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .delete(applications_to_contacts)
        .where(eq(applications_to_contacts.applicationId, application.id));
      await tx
        .delete(applicationHistories)
        .where(eq(applicationHistories.applicationId, application.id));

      const [deleted] = await tx
        .delete(applications)
        .where(eq(applications.id, application.id))
        .returning();
      return deleted;
    });

    logger.info("deleteBySlug", `Deleted application: ${slug}`);

    const pdfPath = path.join(
      process.cwd(),
      "data",
      "applications",
      `${slug}.pdf`,
    );
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        logger.error("deleteBySlug", `Failed to delete PDF for ${slug}`, err);
      }
    }

    return result;
  },

  async createOrUpdate(data: ApplicationCreatePayload) {
    logger.info(
      "createOrUpdate",
      `Creating/updating application: ${data.slug}`,
    );

    return await db.transaction(async (tx) => {
      let addressId: number | undefined;
      if (data.companyAddress) {
        const [address] = await tx
          .insert(addresses)
          .values(data.companyAddress)
          .returning({ id: addresses.id });
        addressId = address?.id;
      }

      const [company] = await tx
        .insert(companies)
        .values({ name: data.companyName || "", addressId })
        .onConflictDoUpdate({
          target: companies.name,
          set: addressId ? { addressId } : {},
        })
        .returning({ id: companies.id });

      const companyId = company?.id as number | undefined;

      const {
        companyName: _,
        companyAddress: __,
        contactIds,
        ...appFields
      } = data;

      const applicationValues = {
        ...appFields,
        companyId: companyId!,
        createdAt: appFields.createdAt
          ? new Date(appFields.createdAt)
          : undefined,
        updatedAt: appFields.updatedAt
          ? new Date(appFields.updatedAt)
          : undefined,
        pdfGeneratedAt: appFields.pdfGeneratedAt
          ? new Date(appFields.pdfGeneratedAt)
          : undefined,
      };

      const existingApplication = await tx.query.applications.findFirst({
        where: eq(applications.slug, data.slug),
      });

      let currentApplicationId: number;
      let finalAction: "updated" | "inserted";

      if (existingApplication) {
        const [updated] = await tx
          .update(applications)
          .set(applicationValues)
          .where(eq(applications.id, existingApplication.id))
          .returning();

        if (!updated)
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to update application",
          });
        currentApplicationId = updated.id;
        finalAction = "updated";
      } else {
        const [inserted] = await tx
          .insert(applications)
          .values(applicationValues)
          .returning();

        if (!inserted)
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to insert application",
          });
        currentApplicationId = inserted.id;
        finalAction = "inserted";
      }

      if (finalAction === "inserted") {
        await tx.insert(applicationHistories).values({
          applicationId: currentApplicationId,
          status: "draft",
          notes: "Initial creation as draft",
        });
      }

      if (contactIds && contactIds.length > 0) {
        const currentLinks = await tx
          .select({ contactId: applications_to_contacts.contactId })
          .from(applications_to_contacts)
          .where(
            eq(applications_to_contacts.applicationId, currentApplicationId),
          );

        const currentContactIds = currentLinks.map((c) => c.contactId);
        const idsToAdd = contactIds.filter(
          (id) => !currentContactIds.includes(id),
        );
        const idsToRemove = currentContactIds.filter(
          (id) => !contactIds.includes(id),
        );

        if (idsToAdd.length > 0) {
          await tx
            .insert(applications_to_contacts)
            .values(
              idsToAdd.map((contactId) => ({
                applicationId: currentApplicationId,
                contactId,
              })),
            )
            .onConflictDoNothing({
              target: [
                applications_to_contacts.applicationId,
                applications_to_contacts.contactId,
              ],
            });
        }

        if (idsToRemove.length > 0) {
          await tx
            .delete(applications_to_contacts)
            .where(
              and(
                eq(
                  applications_to_contacts.applicationId,
                  currentApplicationId,
                ),
                inArray(applications_to_contacts.contactId, idsToRemove),
              ),
            );
        }
      }

      const finalApplication = await tx.query.applications.findFirst({
        where: eq(applications.id, currentApplicationId),
        with: {
          company: { with: { address: true } },
          contacts: { with: { contact: true } },
          histories: true,
        },
      });

      logger.info("createOrUpdate", `Application ${data.slug} ${finalAction}`);

      return { ...finalApplication, action: finalAction };
    });
  },
};
