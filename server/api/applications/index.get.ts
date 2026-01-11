import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  await applicationService.ensureDummyData();
  const applications = await applicationService.getAll(limit);

  return {
    applications,
  };
});