import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema'; // Corrected import
import { updateUserSchema } from '#shared/schemas/user.schema'; // Import the new schema

export default defineEventHandler(async (event) => {
  // 1. Protect the endpoint: Only admins can update user roles
  await authorize(event, isAdmin);

  // 2. Get the user ID from the URL
  const userId = getRouterParam(event, 'id');
  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'User ID is required' });
  }

  // 3. Validate the request body
  const body = await readValidatedBody(event, (body) => updateUserSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  // Construct update data dynamically
  const updateData: Partial<typeof users.$inferInsert> = body.data;

  // Ensure there's at least one field to update
  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields provided for update' });
  }

  // 4. Update the user in the database
  try {
    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, Number(userId)))
      .returning();

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    // 5. Return the updated user
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error); // Changed log message
    throw createError({ statusCode: 500, statusMessage: 'Could not update user' }); // Changed status message
  }
});