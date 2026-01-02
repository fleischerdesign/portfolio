import { companyCreateSchema } from "#shared/schemas/company.schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readValidatedBody(event, (body) => companyCreateSchema.safeParse(body));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }
  
  const { address, ...companyData } = body.data;
  
  const result = await db.transaction(async (tx) => {
    let addressId: number | undefined;

    if (address) {
      const [newAddress] = await tx.insert(addresses).values(address).returning();
      addressId = newAddress?.id;
    }

    const [newCompany] = await tx.insert(companies).values({ ...companyData, addressId }).returning();
    return newCompany;
  });

  return result;
});
