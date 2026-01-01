import { db } from '../../utils/db';
import { addresses, companies, applications, interviews as interviewsTable, applicationHistories } from '../../db/schema';
import { eq } from 'drizzle-orm';
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
    let addressId: number | null = null;
    let companyId: number;

    if (data.company.address) {
      const [newAddress] = await tx.insert(addresses).values({
        ...data.company.address
      }).returning();
      if (!newAddress) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert address' }); }
      addressId = newAddress.id;
    }

    const existingCompany = await tx.query.companies.findFirst({
      where: eq(companies.name, data.company.name),
    });

    if (existingCompany) {
      companyId = existingCompany.id;
      if (addressId && existingCompany.addressId !== addressId) {
        await tx.update(companies).set({ addressId }).where(eq(companies.id, companyId));
      }
    } else {
      const [newCompany] = await tx.insert(companies).values({
        name: data.company.name,
        addressId,
      }).returning();
      if (!newCompany) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert company' }); }
      companyId = newCompany.id;
    }

    const applicationInsertData = {
      title: data.title,
      subtitle: data.subtitle,
      slug: data.slug,
      url: data.url,
      body: data.body,
      notes: data.notes,
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

    await tx.delete(interviewsTable).where(eq(interviewsTable.applicationId, currentApplicationId));

    if (data.interviews && data.interviews.length > 0) {
      const interviewInserts = data.interviews.map(interview => ({
        applicationId: currentApplicationId,
        date: new Date(interview.date), // The Zod schema validated this is a datetime string
        notes: interview.notes,
      }));
      await tx.insert(interviewsTable).values(interviewInserts);
    }

    const finalApplication = await tx.query.applications.findFirst({
      where: eq(applications.id, currentApplicationId),
      with: {
        company: { with: { address: true } },
        interviews: true,
      }
    });

    return { ...finalApplication, action: finalAction };
  });

  return { result };
});
