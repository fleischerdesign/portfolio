import { applicationService } from '~~/server/services/application.service';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { historyId } = await getValidatedRouterParams(event, z.object({
    slug: z.string(),
    historyId: z.coerce.number().int().positive()
  }).parse);

  try {
    const [deletedHistory] = await applicationService.deleteHistory(historyId);

    if (!deletedHistory) {
      throw createError({ statusCode: 404, statusMessage: 'History entry not found' });
    }

    return { success: true, message: `History entry ${historyId} deleted.` };

  } catch (error) {
    console.error('Error deleting application history:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not delete history entry' });
  }
});
