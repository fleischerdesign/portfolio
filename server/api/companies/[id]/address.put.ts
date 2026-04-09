import { companyService } from "~~/server/services/company.service";
import { addressBaseSchema } from "#shared/schemas/company.schema";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.coerce.number().int().positive(),
    }).parse,
  );

  const addressData = await readValidatedBody(event, addressBaseSchema.parse);

  return await companyService.updateAddress(id, addressData);
});
