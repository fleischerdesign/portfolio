
import { blogService } from '~~/server/services/blog.service';
import { blogPostCreateSchema } from '~~/shared/schemas/blog.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, blogPostCreateSchema.parse);

  const result = await blogService.create(data, event.context.user?.id);

  return { result };
});
