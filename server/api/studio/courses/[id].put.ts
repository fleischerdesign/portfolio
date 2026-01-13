import { courseService } from '~~/server/services/course.service';
import { updateCourseSchema } from '~~/shared/schemas/course.schema';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const id = getRouterParam(event, 'id');
  const body = await readValidatedBody(event, updateCourseSchema.parse);

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const course = await courseService.update(session.user.id, parseInt(id), body);
  
  if (!course) {
     throw createError({ statusCode: 404, statusMessage: 'Course not found' });
  }

  return { course };
});
