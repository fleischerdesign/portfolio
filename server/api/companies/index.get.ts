import { companyService } from '~~/server/services/company.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { limit } = await getStudioQuery(event);
  const companies = await companyService.getAll(limit);

  return { companies };
});