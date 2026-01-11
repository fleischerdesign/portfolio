import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { limit } = await getStudioQuery(event);

  const posts = await blogService.getStudioAll(limit);

  return { posts };
});