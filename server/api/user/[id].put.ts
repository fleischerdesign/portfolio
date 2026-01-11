import { userService } from '~~/server/services/user.service';
import { updateUserSchema } from '#shared/schemas/user.schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number().int().positive()
  }).parse);

  const data = await readValidatedBody(event, updateUserSchema.parse);

  if (Object.keys(data).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields provided for update' });
  }

  try {
    return await userService.update(id, data);
  } catch (error) {
    console.error('Error updating user:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not update user' });
  }
});