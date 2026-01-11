import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const post = await blogService.getStudioById(id);

  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

  return { post };
});