import { courseService } from '~~/server/services/course.service';
import { createCourseSchema } from '~~/shared/schemas/course.schema';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const body = await readValidatedBody(event, createCourseSchema.parse);

  const course = await courseService.create(session.user.id, body);
  return { course };
});
