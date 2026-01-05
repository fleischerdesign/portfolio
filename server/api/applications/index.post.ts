import { db } from '../../utils/db';
import { addresses, companies, applications, applicationHistories, applications_to_contacts } from '../../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { applicationCreateSchema } from '../../../shared/schemas/application.schema';
import type { ApplicationCreatePayload } from '../../../shared/schemas/application.schema';


export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readBody(event);
  const validation = applicationCreateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: ApplicationCreatePayload = validation.data;

  const result = await db.transaction(async (tx) => {
    let addressId: number | null | undefined = undefined;
    let companyId: number;

    if (data.companyAddress) {
      // Potentially find an existing address to avoid duplicates in the future
      const [newAddress] = await tx.insert(addresses).values({
        ...data.companyAddress
      }).returning();
      if (!newAddress) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert address' }); }
      addressId = newAddress.id;
    }

    const existingCompany = await tx.query.companies.findFirst({
      where: eq(companies.name, data.companyName),
    });

    if (existingCompany) {
      companyId = existingCompany.id;
      if (addressId && existingCompany.addressId !== addressId) {
        await tx.update(companies).set({ addressId }).where(eq(companies.id, companyId));
      }
    } else {
      const [newCompany] = await tx.insert(companies).values({
        name: data.companyName,
        addressId: addressId,
      }).returning();
      if (!newCompany) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert company' }); }
      companyId = newCompany.id;
    }
    
    const { companyName, companyAddress, ...applicationData } = data;
    const applicationInsertData = {
      ...applicationData,
      companyId,
    };

    const existingApplication = await tx.query.applications.findFirst({
      where: eq(applications.slug, data.slug),
    });

    let currentApplicationId;
    let finalAction: 'updated' | 'inserted';

    if (existingApplication) {
      const [updated] = await tx.update(applications).set(applicationInsertData).where(eq(applications.id, existingApplication.id)).returning();
      if (!updated) { throw createError({ statusCode: 500, statusMessage: 'Failed to update application' }); }
      currentApplicationId = updated.id;
      finalAction = 'updated';
    } else {
      const [inserted] = await tx.insert(applications).values(applicationInsertData).returning();
      if (!inserted) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert application' }); }
      currentApplicationId = inserted.id;
      finalAction = 'inserted';
    }

    // Insert initial history entry for new applications
    if (finalAction === 'inserted') {
      await tx.insert(applicationHistories).values({
        applicationId: currentApplicationId,
        status: 'draft',
        notes: 'Initial creation as draft',
      });
    }
    
    // Sync contacts
    if (data.contactIds) {
      // Efficiently sync contacts
      const currentContactLinks = await tx.query.applications_to_contacts.findMany({
        where: eq(applications_to_contacts.applicationId, currentApplicationId),
      });
      const currentContactIds = currentContactLinks.map(c => c.contactId);
      const newContactIds = data.contactIds;

      const idsToAdd = newContactIds.filter(id => !currentContactIds.includes(id));
      const idsToRemove = currentContactIds.filter(id => !newContactIds.includes(id));

      // Add new contacts
      if (idsToAdd.length > 0) {
        const newLinks = idsToAdd.map(contactId => ({
          applicationId: currentApplicationId,
          contactId,
        }));
        await tx.insert(applications_to_contacts).values(newLinks);
      }

      // Remove old contacts
      if (idsToRemove.length > 0) {
        await tx.delete(applications_to_contacts).where(
          and(
            eq(applications_to_contacts.applicationId, currentApplicationId),
            inArray(applications_to_contacts.contactId, idsToRemove)
          )
        );
      }
    }

    // Removed interview syncing logic

    const finalApplication = await tx.query.applications.findFirst({
      where: eq(applications.id, currentApplicationId),
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
        histories: true,
      }
    });

    return { ...finalApplication, action: finalAction };
  });

  return { result };
});
