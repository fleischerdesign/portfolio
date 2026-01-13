import { courseService } from '~~/server/services/course.service';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);
  const courses = await courseService.getAll(session.user.id);
  return { courses };
});
