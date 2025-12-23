import { db } from '../../utils/db';
import { addresses, companies, applications, interviews as interviewsTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { applicationApiSchema } from '../../../shared/schemas/application.schema';
import type { ApplicationApiPayload } from '../../../shared/schemas/application.schema';


export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readBody(event);
  const validation = applicationApiSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: ApplicationApiPayload = validation.data;

  const result = await db.transaction(async (tx) => {
    let addressId: number | null = null;
    let companyId: number;

    if (data.company.address) {
      const [newAddress] = await tx.insert(addresses).values({
        ...data.company.address
      }).returning();
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
      companyId = newCompany.id;
    }

    const applicationInsertData = {
      title: data.title,
      subtitle: data.subtitle,
      slug: data.slug,
      url: data.url,
      status: data.status,
      body: data.body,
      notes: data.notes,
      applicationDate: data.applicationDate ? new Date(data.applicationDate) : null,
      responseDate: data.responseDate ? new Date(data.responseDate) : null,
      companyId,
    };

    const existingApplication = await tx.query.applications.findFirst({
      where: eq(applications.slug, data.slug),
    });

    let currentApplicationId;
    let finalStatus: 'updated' | 'inserted';

    if (existingApplication) {
      const [updated] = await tx.update(applications).set(applicationInsertData).where(eq(applications.id, existingApplication.id)).returning();
      currentApplicationId = updated.id;
      finalStatus = 'updated';
    } else {
      const [inserted] = await tx.insert(applications).values(applicationInsertData).returning();
      currentApplicationId = inserted.id;
      finalStatus = 'inserted';
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

    return { ...finalApplication, status: finalStatus };
  });

  return { result };
});
