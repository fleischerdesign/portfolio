import { companyService } from '~~/server/services/company.service';
import { companyCreateSchema } from "#shared/schemas/company.schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, companyCreateSchema.parse);
  
  return await companyService.create(data);
});
