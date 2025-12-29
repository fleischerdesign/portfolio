import { eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { applicationHistories } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const historyId = Number(getRouterParam(event, 'historyId'));

  if (!historyId) {
    throw createError({ statusCode: 400, statusMessage: 'History ID is required' });
  }

  try {
    const [deletedHistory] = await db.delete(applicationHistories)
      .where(eq(applicationHistories.id, historyId))
      .returning();

    if (!deletedHistory) {
      throw createError({ statusCode: 404, statusMessage: 'History entry not found' });
    }

    return { success: true, message: `History entry ${historyId} deleted.` };

  } catch (error) {
    console.error('Error deleting application history:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not delete history entry' });
  }
});
