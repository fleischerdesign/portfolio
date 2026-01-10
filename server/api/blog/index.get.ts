
import { blogPosts } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';
import { BlogPostResponse } from '~~/shared/schemas/blog.schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const posts = await db.query.blogPosts.findMany({
    where: (posts, { eq }) => eq(posts.status, 'published'),
    limit,
    with: {
      translations: {
        where: (trans, { eq }) => eq(trans.locale, locale),
      },
      category: true,
      tags: {
        with: {
          tag: true
        }
      },
      author: true
    },
    orderBy: [desc(blogPosts.publishedAt)]
  });

  const mappedPosts: BlogPostResponse[] = posts.map(post => {
    const translation = post.translations[0];
    if (!translation) return null;

    return {
      id: post.id,
      slug: translation.slug,
      title: translation.title,
      excerpt: translation.excerpt,
      publishedAt: post.publishedAt,
      coverImage: post.coverImage,
      coverImageAlt: post.coverImageAlt,
      readingTime: translation.readingTime,
      category: post.category,
      tags: post.tags.map(t => t.tag),
      author: post.author
    };
  }).filter((p): p is BlogPostResponse => p !== null);

  return {
    posts: mappedPosts
  };
});
