import { courseService } from '~~/server/services/course.service';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, 'id');

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const deleted = await courseService.delete(session.user.id, parseInt(id));

  if (!deleted) {
      throw createError({ statusCode: 404, statusMessage: 'Course not found' });
  }

  return { success: true };
});
