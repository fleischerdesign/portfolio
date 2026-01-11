import { blogService } from '~~/server/services/blog.service';
import { blogPostUpdateSchema } from '~~/shared/schemas/blog.schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number().int().positive()
  }).parse);

  const data = await readValidatedBody(event, blogPostUpdateSchema.parse);

  const result = await blogService.update(id, data);

  return { result };
});