import { userService } from '~~/server/services/user.service';
import { updateUserSchema } from '#shared/schemas/user.schema';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  
  const body = await readValidatedBody(event, updateUserSchema.parse);

  // Users can only update their own profile via this endpoint
  const updatedUser = await userService.update(session.user.id, body);

  return { user: updatedUser };
});
