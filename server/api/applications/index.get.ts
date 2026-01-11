import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { limit } = await getStudioQuery(event);

  const applications = await applicationService.getAll(limit);

  return {
    applications,
  };
});