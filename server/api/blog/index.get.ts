import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const posts = await blogService.getPublicAll(locale, limit);

  return {
    posts
  };
});