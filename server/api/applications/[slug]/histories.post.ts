import { applicationService } from '~~/server/services/application.service';
import { applicationHistoryCreateSchema } from '~~/shared/schemas/application.schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { slug } = await getValidatedRouterParams(event, z.object({
    slug: z.string()
  }).parse);

  const data = await readValidatedBody(event, applicationHistoryCreateSchema.parse);

  try {
    return await applicationService.addHistory(slug, data);
  } catch (error) {
    console.error('Error adding application history:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not add application history' });
  }
});
