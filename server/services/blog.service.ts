import { blogPosts, blogPostTranslations, categories, tags, blogPostsToTags } from '~~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { BlogPostResponse, BlogPostDetailResponse, BlogPostUpdate, BlogPostCreate } from '~~/shared/schemas/blog.schema';

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
  },

  async create(data: BlogPostCreate, authorId?: number) {
    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (!categoryId && data.categoryName) {
        const slug = data.categoryName.toLowerCase().replace(/\s+/g, '-');
        const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
        if (existing) {
          categoryId = existing.id;
        } else {
          const [inserted] = await tx.insert(categories).values({ name: data.categoryName, slug }).returning();
          categoryId = inserted.id;
        }
      }
  
      const { 
        categoryName, tags: tagNames,
        locale, slug, title, excerpt, body: contentBody, readingTime,
        translationKey,
        ...entityData
      } = data;
  
      let post = await tx.query.blogPosts.findFirst({ 
        where: eq(blogPosts.translationKey, translationKey) 
      });
  
      if (!post) {
        [post] = await tx.insert(blogPosts).values({
          translationKey,
          ...entityData,
          publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : null,
          categoryId,
          authorId
        }).returning();
      } else {
        await tx.update(blogPosts).set({
          ...entityData,
          publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : post.publishedAt,
          categoryId: categoryId || post.categoryId,
        }).where(eq(blogPosts.id, post.id));
      }
  
      await tx.insert(blogPostTranslations).values({
        blogPostId: post.id,
        locale,
        slug,
        title,
        excerpt,
        body: contentBody,
        readingTime
      }).onConflictDoUpdate({
        target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
        set: {
          slug,
          title,
          excerpt,
          body: contentBody,
          readingTime,
          updatedAt: new Date()
        }
      });
  
      if (tagNames) {
        await tx.delete(blogPostsToTags).where(eq(blogPostsToTags.blogPostId, post.id));
        for (const tagName of tagNames) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
          if (!tag) {
            [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
          }
          await tx.insert(blogPostsToTags).values({ blogPostId: post.id, tagId: tag.id }).onConflictDoNothing();
        }
      }
  
      return post;
    });
  },

  async update(id: number, data: BlogPostUpdate) {
    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (!categoryId && data.categoryName) {
        const slug = data.categoryName.toLowerCase().replace(/\s+/g, '-');
        const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
        if (existing) {
          categoryId = existing.id;
        } else {
          const [inserted] = await tx.insert(categories).values({ name: data.categoryName, slug }).returning();
          categoryId = inserted.id;
        }
      }
  
      const { 
        categoryName, tags: tagNames,
        locale, slug, title, excerpt, body: contentBody, readingTime,
        translationKey,
        ...entityData
      } = data;
  
      await tx.update(blogPosts).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : undefined,
        categoryId: categoryId,
      }).where(eq(blogPosts.id, id));
  
      if (locale && slug && title && contentBody) {
          await tx.insert(blogPostTranslations).values({
          blogPostId: id,
          locale: locale!,
          slug: slug!,
          title: title!,
          excerpt,
          body: contentBody!,
          readingTime
          }).onConflictDoUpdate({
          target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
          set: {
              slug,
              title,
              excerpt,
              body: contentBody,
              readingTime,
              updatedAt: new Date()
          }
          });
      }
  
      if (tagNames) {
        await tx.delete(blogPostsToTags).where(eq(blogPostsToTags.blogPostId, id));
        
        for (const tagName of tagNames) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
          if (!tag) {
            [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
          }
          await tx.insert(blogPostsToTags).values({ blogPostId: id, tagId: tag.id }).onConflictDoNothing();
        }
      }
  
      return await tx.query.blogPosts.findFirst({ where: eq(blogPosts.id, id) });
    });
  }
};