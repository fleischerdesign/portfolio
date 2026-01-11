import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const post = await blogService.getPublicBySlug(slug, locale);

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  return {
    post
  };
});