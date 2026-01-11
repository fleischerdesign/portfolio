import { companyService } from '~~/server/services/company.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  return await companyService.getAll(limit);
});