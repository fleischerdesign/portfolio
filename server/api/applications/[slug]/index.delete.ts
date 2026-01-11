import { applicationService } from '~~/server/services/application.service';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const { slug } = await getValidatedRouterParams(event, z.object({
    slug: z.string()
  }).parse);

  try {
    await applicationService.deleteBySlug(slug);
    return new Response(null, { status: 204, statusText: 'No Content' });
  } catch (error) {
    console.error('Error deleting application:', error);
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting application',
    });
  }
});
