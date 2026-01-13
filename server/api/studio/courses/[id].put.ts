import { courseUpdateSchema } from '~~/shared/schemas/course.schema';
import { courseService } from '~~/server/services/course.service';

export default defineEventHandler(async (event) => {
  const id = parseInt(getRouterParam(event, 'id') || '0');
  const body = await readValidatedBody(event, courseUpdateSchema.parse);
  const session = await requireUserSession(event);

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  return await courseService.update(session.user.id, id, body);
});
