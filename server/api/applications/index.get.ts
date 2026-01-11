import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const limit = getValidatedLimit(event);

  await applicationService.ensureDummyData();
  const applications = await applicationService.getAll(limit);

  return {
    applications,
  };
});