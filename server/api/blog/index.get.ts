import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  const { locale, limit } = await getPublicQuery(event);

  const posts = await blogService.getPublicAll(locale, limit);

  return {
    posts
  };
});