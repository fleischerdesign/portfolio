import { blogService } from '~~/server/services/blog.service';

export default defineEventHandler(async (event) => {
  const locale = getValidatedLocale(event);
  const limit = getValidatedLimit(event);

  const posts = await blogService.getPublicAll(locale, limit);

  return {
    posts
  };
});