import { eq, and, inArray } from 'drizzle-orm';
import { applications, companies, addresses, applications_to_contacts, applicationHistories } from '~~/server/db/schema';
import { applicationUpdateSchema } from '#shared/schemas/application.schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { slug } = await getValidatedRouterParams(event, z.object({
    slug: z.string()
  }).parse);

  const updateData = await readValidatedBody(event, applicationUpdateSchema.parse);

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields provided for update' });
  }

  const result = await db.transaction(async (tx) => {
    const existingApplication = await tx.query.applications.findFirst({
      where: eq(applications.slug, slug),
    });

    if (!existingApplication) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' });
    }

    let finalCompanyId = updateData.companyId;

    // Handle company and address update if a new company name is provided
    if (updateData.companyName) {
      const existingCompany = await tx.query.companies.findFirst({
        where: eq(companies.name, updateData.companyName),
      });

      if (existingCompany) {
        finalCompanyId = existingCompany.id;
      } else {
        let addressId: number | null | undefined = undefined;
        if (updateData.companyAddress) {
          const [newAddress] = await tx.insert(addresses).values(updateData.companyAddress).returning();
          addressId = newAddress?.id;
        }
        const [newCompany] = await tx.insert(companies).values({ name: updateData.companyName, addressId }).returning();
        finalCompanyId = newCompany!.id;
      }
    }

    // Sync contacts
    if (updateData.contactIds) {
      // Efficiently sync contacts
      const currentContactLinks = await tx.query.applications_to_contacts.findMany({
        where: eq(applications_to_contacts.applicationId, existingApplication.id),
      });
      const currentContactIds = currentContactLinks.map(c => c.contactId);
      const newContactIds = updateData.contactIds;

      const idsToAdd = newContactIds.filter(id => !currentContactIds.includes(id));
      const idsToRemove = currentContactIds.filter(id => !newContactIds.includes(id));

      // Add new contacts
      if (idsToAdd.length > 0) {
        const newLinks = idsToAdd.map(contactId => ({
          applicationId: existingApplication.id,
          contactId,
        }));
        await tx.insert(applications_to_contacts).values(newLinks);
      }

      // Remove old contacts
      if (idsToRemove.length > 0) {
        await tx.delete(applications_to_contacts).where(
          and(
            eq(applications_to_contacts.applicationId, existingApplication.id),
            inArray(applications_to_contacts.contactId, idsToRemove)
          )
        );
      }
    }

    // Sync histories if provided
    if (updateData.histories) {
      const incomingHistories = updateData.histories;
      const existingHistories = await tx.query.applicationHistories.findMany({
          where: eq(applicationHistories.applicationId, existingApplication.id),
      });

      const existingIds = existingHistories.map(h => h.id);
      const incomingIds = incomingHistories.map(h => h.id).filter((id): id is number => id !== undefined);

      // 1. Delete histories that are not in the incoming array
      const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
      if (idsToDelete.length > 0) {
          await tx.delete(applicationHistories).where(inArray(applicationHistories.id, idsToDelete));
      }

      // 2. Update existing histories
      const historiesToUpdate = incomingHistories.filter(h => h.id && existingIds.includes(h.id));
      for (const history of historiesToUpdate) {
          const { id, createdAt, ...updatePayload } = history;
          await tx.update(applicationHistories)
              .set({
                ...updatePayload,
                createdAt: createdAt ? new Date(createdAt) : undefined,
                scheduled_at: history.scheduled_at ? new Date(history.scheduled_at) : null,
              })
              .where(eq(applicationHistories.id, id!));
      }

      // 3. Insert new histories
      const historiesToInsert = incomingHistories.filter(h => h.id === undefined || h.id === null);
      if (historiesToInsert.length > 0) {
          const newHistories = historiesToInsert.map(({id, ...h}) => ({
              ...h,
              applicationId: existingApplication.id,
              createdAt: h.createdAt ? new Date(h.createdAt) : undefined,
              scheduled_at: h.scheduled_at ? new Date(h.scheduled_at) : null,
          }));
          await tx.insert(applicationHistories).values(newHistories);
      }
    }

    const { companyName, companyAddress, contactIds, histories, ...applicationData } = updateData;
    
    const applicationUpdatePayload = {
        ...applicationData,
        companyId: finalCompanyId ?? undefined,
        createdAt: applicationData.createdAt ? new Date(applicationData.createdAt) : undefined,
        updatedAt: applicationData.updatedAt ? new Date(applicationData.updatedAt) : undefined,
        pdfGeneratedAt: applicationData.pdfGeneratedAt ? new Date(applicationData.pdfGeneratedAt) : undefined,
    };

    const [updatedApplication] = await tx.update(applications)
      .set(applicationUpdatePayload)
      .where(eq(applications.id, existingApplication.id))
      .returning();

    return tx.query.applications.findFirst({
      where: eq(applications.id, updatedApplication!.id),
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
      }
    });
  });

  return result;
});
