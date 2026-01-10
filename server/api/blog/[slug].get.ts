
import { blogPostTranslations } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { BlogPostDetailResponse } from '~~/shared/schemas/blog.schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const translation = await db.query.blogPostTranslations.findFirst({
    where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
    with: {
      post: {
        with: {
          category: true,
          tags: {
            with: { tag: true }
          },
          author: true
        }
      }
    }
  });

  if (!translation || !translation.post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  const { post } = translation;

  if (post.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  const response: BlogPostDetailResponse = {
    ...post,
    ...translation,
    id: post.id, // Ensure we use the entity ID
    tags: post.tags.map(t => t.tag),
    author: post.author || null,
    category: post.category || null,
  };

  return {
    post: response
  };
});
