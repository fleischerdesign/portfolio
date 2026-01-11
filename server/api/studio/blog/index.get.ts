import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const posts = await blogService.getStudioAll(limit);

  return { posts };
});