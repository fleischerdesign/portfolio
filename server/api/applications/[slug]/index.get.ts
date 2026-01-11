import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const application = await applicationService.getBySlug(slug);

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found',
    });
  }

  return application;
});
