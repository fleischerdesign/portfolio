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
import { eq, desc, asc } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { documentService } from "./document.service";
import { createLogger } from "../utils/logger";
import { createEntityService, type EntityDescriptor } from "../utils/db.engine";
import type { DbTransaction } from "../utils/db";

const logger = createLogger("application");

// ---------------------------------------------------------------------------
// Extracted helper: upsert company + address in a single transaction step
// ---------------------------------------------------------------------------

interface CompanyUpsertData {
  companyId?: number | null;
  companyName?: string;
  companyAddress?: {
    street?: string | null;
    houseNumber?: string | null;
    zipcode?: string | null;
    city?: string | null;
    name?: string | null;
  };
}

async function upsertCompanyWithAddress(
  tx: DbTransaction,
  data: CompanyUpsertData,
): Promise<number | undefined> {
  let { companyId } = data;

  if (data.companyName) {
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
      .values({ name: data.companyName, addressId })
      .onConflictDoUpdate({
        target: companies.name,
        set: addressId ? { addressId } : {},
      })
      .returning({ id: companies.id });
    companyId = company?.id;
  }

  return companyId ?? undefined;
}

// ---------------------------------------------------------------------------
// Descriptor with typed hooks
// ---------------------------------------------------------------------------

const applicationDescriptor: EntityDescriptor<
  typeof applications,
  ApplicationCreatePayload
> = {
  mainTable: applications,
  hooks: {
    beforeCreate: async (tx, data) => {
      const companyId = await upsertCompanyWithAddress(tx, data);
      return { ...data, companyId: companyId ?? data.companyId };
    },
    afterCreate: async (tx, entity, data) => {
      await tx.insert(applicationHistories).values({
        applicationId: entity.id,
        status: "draft",
        notes: "Initial creation as draft",
      });

      if (data.contactIds && data.contactIds.length > 0) {
        await tx.insert(applications_to_contacts).values(
          data.contactIds.map((contactId) => ({
            applicationId: entity.id,
            contactId,
          })),
        );
      }
    },
    beforeUpdate: async (tx, _id, data) => {
      const companyId = await upsertCompanyWithAddress(
        tx,
        data as CompanyUpsertData,
      );
      return companyId ? { ...data, companyId } : data;
    },
    afterUpdate: async (tx, entity, data) => {
      const updateData = data as Partial<ApplicationCreatePayload>;
      if (updateData.contactIds) {
        await tx
          .delete(applications_to_contacts)
          .where(eq(applications_to_contacts.applicationId, entity.id));
        if (updateData.contactIds.length > 0) {
          await tx.insert(applications_to_contacts).values(
            updateData.contactIds.map((contactId) => ({
              applicationId: entity.id,
              contactId,
            })),
          );
        }
      }
    },
  },
};

const engine = createEntityService(applicationDescriptor);

export const applicationService = {
  ...engine,

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

    if (!application) return null;

    const withFallbackDocs = { ...application };
    if (!withFallbackDocs.documents?.length) {
      withFallbackDocs.documents =
        await documentService.getForApplicationWithFallback(application.id);
    }
    return applicationResponseSchema.parse(withFallbackDocs);
  },

  async addHistory(
    slug: string,
    data: { status: Status; notes?: string | null; scheduled_at?: Date | null },
  ) {
    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
    });
    if (!application)
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });

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
    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
    });
    if (!application)
      throw createError({
        statusCode: 404,
        statusMessage: "Application not found",
      });

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
    return await db.transaction(async (tx) => {
      const existing = await tx.query.applications.findFirst({
        where: eq(applications.slug, data.slug),
      });
      if (existing) {
        const updated = await engine.update(tx, existing.id, data);
        return { ...updated, action: "updated" as const };
      } else {
        const created = await engine.create(tx, data);
        return { ...created, action: "inserted" as const };
      }
    });
  },
};
