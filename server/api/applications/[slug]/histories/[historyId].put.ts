import { eq } from 'drizzle-orm';
import { db } from '~~/server/utils/db';
import { applicationHistories } from '~~/server/db/schema';
import { applicationHistoryUpdateSchema } from '~~/shared/schemas/application.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');
  const historyId = Number(getRouterParam(event, 'historyId'));

  if (!slug || !historyId) {
    throw createError({ statusCode: 400, statusMessage: 'Slug and History ID are required' });
  }

  const body = await readValidatedBody(event, (body) => applicationHistoryUpdateSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const updateData = body.data;

  // Convert string date to Date object if provided
  if (updateData.createdAt) {
    // This is a bit tricky with typing, so we cast to any
    (updateData as any).createdAt = new Date(updateData.createdAt);
  }

  try {
    // We could also check if the historyId belongs to the application with the given slug, but for now we'll trust the input
    const [updatedHistory] = await db.update(applicationHistories)
      .set(updateData)
      .where(eq(applicationHistories.id, historyId))
      .returning();

    if (!updatedHistory) {
      throw createError({ statusCode: 404, statusMessage: 'History entry not found' });
    }

    return updatedHistory;

  } catch (error) {
    console.error('Error updating application history:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not update history entry' });
  }
});
