import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';
import { updateUserSchema } from '#shared/schemas/user.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const userId = getRouterParam(event, 'id');
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  const body = await readValidatedBody(event, (body) => updateUserSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const updateData: Partial<typeof users.$inferInsert> = body.data;

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields provided for update' });
  }

  try {
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, Number(userId)))
      .returning();

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not update user' });
  }
});