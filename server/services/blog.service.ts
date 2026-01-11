import { blogPosts, blogPostTranslations } from '~~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { BlogPostResponse, BlogPostDetailResponse } from '~~/shared/schemas/blog.schema';

export const blogService = {
  // Public Methods
  async getPublicAll(locale: 'de' | 'en', limit?: number): Promise<BlogPostResponse[]> {
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

    return posts.map(post => {
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
  },

  async getPublicBySlug(slug: string, locale: 'de' | 'en'): Promise<BlogPostDetailResponse | null> {
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
  
    if (!translation || !translation.post) return null;
  
    const { post } = translation;
  
    if (post.status !== 'published') return null;
  
    return {
      ...post,
      ...translation,
      id: post.id,
      tags: post.tags.map(t => t.tag),
      author: post.author || null,
      category: post.category || null,
    };
  },

  // Studio Methods
  async getStudioAll(limit?: number) {
    const posts = await db.query.blogPosts.findMany({
      limit,
      with: {
        translations: true,
        category: true,
        author: true
      },
      orderBy: [desc(blogPosts.createdAt)]
    });
  
    return posts;
  },

  async getStudioById(id: number) {
    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      with: {
        translations: true,
        category: true,
        tags: { with: { tag: true } },
        author: true
      }
    });
  
    if (!post) return null;
  
    return {
      ...post,
      tags: post.tags.map(t => t.tag)
    };
  }
};
