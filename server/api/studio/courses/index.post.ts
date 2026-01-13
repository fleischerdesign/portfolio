import { courseCreateSchema } from '~~/shared/schemas/course.schema';
import { courseService } from '~~/server/services/course.service';

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, courseCreateSchema.parse);
  const session = await requireUserSession(event);
  
  return await courseService.create(session.user.id, body);
});
