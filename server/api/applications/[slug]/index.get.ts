import { applicationService } from '~~/server/services/application.service';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { slug } = await getValidatedRouterParams(event, z.object({
    slug: z.string()
  }).parse);

  const application = await applicationService.getBySlug(slug);

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found',
    });
  }

  return application;
});
