import { eq } from 'drizzle-orm';
import { applications, companies, addresses, applications_to_contacts } from '~~/server/db/schema';
import { applicationUpdateSchema, type ApplicationUpdatePayload } from '#shared/schemas/application.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const body = await readValidatedBody(event, (body) => applicationUpdateSchema.safeParse(body));
  if (!body.success) {
    console.error('Validation failed:', body.error.flatten());
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const updateData: ApplicationUpdatePayload = body.data;

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
      await tx.delete(applications_to_contacts).where(eq(applications_to_contacts.applicationId, existingApplication.id));
      if (updateData.contactIds.length > 0) {
        const contactLinks = updateData.contactIds.map(contactId => ({
          applicationId: existingApplication.id,
          contactId,
        }));
        await tx.insert(applications_to_contacts).values(contactLinks);
      }
    }

    const { companyName, companyAddress, contactIds, ...applicationData } = updateData;

    const [updatedApplication] = await tx.update(applications)
      .set({ ...applicationData, companyId: finalCompanyId })
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
