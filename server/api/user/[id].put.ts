import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';

// Schema for validating the update payload
const UpdateUserSchema = z.object({
  role: z.enum(['admin', 'user']),
});

export default defineEventHandler(async (event) => {
  // 1. Protect the endpoint: Only admins can update user roles
  await authorize(event, isAdmin);

  // 2. Get the user ID from the URL
  const userId = getRouterParam(event, 'id');
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  // 3. Validate the request body
  const body = await readValidatedBody(event, (body) => UpdateUserSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  // 4. Update the user in the database
  try {
    const [updatedUser] = await db.update(users)
      .set({ role: body.data.role })
      .where(eq(users.id, Number(userId)))
      .returning();

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    // 5. Return the updated user
    return updatedUser;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not update user role' });
  }
});
