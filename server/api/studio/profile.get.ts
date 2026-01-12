import { userService } from '~~/server/services/user.service';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  
  const user = await userService.getById(session.user.id);

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  return { user };
});
