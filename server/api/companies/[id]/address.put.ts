import { eq } from 'drizzle-orm';
import { companies, addresses } from '~~/server/db/schema';
import { addressBaseSchema, type Address } from '#shared/schemas/company.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const companyId = getRouterParam(event, 'id');
  if (!companyId) {
    throw createError({ statusCode: 400, statusMessage: 'Company ID is required' });
  }

  const idAsNumber = parseInt(companyId, 10);
  if (isNaN(idAsNumber)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Company ID' });
  }

  const body = await readValidatedBody(event, (body) => addressBaseSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const addressData: Partial<Address> = body.data;

  const updatedCompany = await db.transaction(async (tx) => {
    const company = await tx.query.companies.findFirst({
      where: eq(companies.id, idAsNumber),
    });

    if (!company) {
      throw createError({ statusCode: 404, statusMessage: 'Company not found' });
    }

    if (company.addressId) {
      // Update existing address
      await tx.update(addresses)
        .set(addressData)
        .where(eq(addresses.id, company.addressId));
    } else {
      // Create new address and link it
      const [newAddress] = await tx.insert(addresses).values(addressData).returning();
      if (newAddress) {
        await tx.update(companies)
          .set({ addressId: newAddress.id })
          .where(eq(companies.id, idAsNumber));
      }
    }

    // Return the updated company with its address
    return tx.query.companies.findFirst({
      where: eq(companies.id, idAsNumber),
      with: {
        address: true
      }
    });
  });

  return updatedCompany;
});
