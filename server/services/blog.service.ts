import { blogPosts, blogPostTranslations, categories, tags, blogPostsToTags } from '~~/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { BlogPostResponse, BlogPostUpdate, BlogPostCreate } from '~~/shared/schemas/blog.schema';
import { slugify } from '~~/shared/utils/slugify';
import { resolveEntityReference, syncManyToMany } from '../utils/relation';

// --- Internal Helpers ---

const mapBlogPost = (post: any, translation?: any): BlogPostResponse => ({
  id: post.id,
  status: post.status,
  translationKey: post.translationKey,
  publishedAt: post.publishedAt,
  coverImage: post.coverImage,
  coverImageAlt: post.coverImageAlt,
  category: post.category || null,
  tags: post.tags?.map((t: any) => t.tag) || [],
  author: post.author || null,
  
  // Translation fields
  locale: translation?.locale,
  slug: translation?.slug,
  title: translation?.title,
  excerpt: translation?.excerpt,
  body: translation?.body,
  readingTime: translation?.readingTime,
});

export const blogService = {
  // Public Methods
  async getPublicAll(locale: 'de' | 'en', limit?: number): Promise<BlogPostResponse[]> {
    const posts = await db.query.blogPosts.findMany({
      where: (posts, { eq }) => eq(posts.status, 'published'),
      limit,
      with: {
        translations: { where: (trans, { eq }) => eq(trans.locale, locale) },
        category: true,
        tags: { with: { tag: true } },
        author: true
      },
      orderBy: [desc(blogPosts.publishedAt)]
    });

    return posts
      .map(post => post.translations[0] ? mapBlogPost(post, post.translations[0]) : null)
      .filter((p): p is BlogPostResponse => p !== null);
  },

  async getPublicBySlug(slug: string, locale: 'de' | 'en'): Promise<BlogPostResponse | null> {
    const translation = await db.query.blogPostTranslations.findFirst({
      where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
      with: {
        post: {
          with: {
            category: true,
            tags: { with: { tag: true } },
            author: true
          }
        }
      }
    });
  
    if (!translation?.post || translation.post.status !== 'published') return null;
  
    return mapBlogPost(translation.post, translation);
  },

  // Studio Methods
  async getStudioAll(limit?: number) {
    return await db.query.blogPosts.findMany({
      limit,
      with: {
        translations: true,
        category: true,
        author: true
      },
      orderBy: [desc(blogPosts.createdAt)]
    });
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
      // Resolve Category
      let categoryId = data.categoryId;
      if (data.categoryName) {
         categoryId = await resolveEntityReference(tx, categories, categories.slug, slugify(data.categoryName), { name: data.categoryName }) || undefined;
      }
  
      const { 
        categoryName, tags: tagNames,
        locale, slug, title, excerpt, body, readingTime,
        translationKey,
        ...entityData
      } = data;

      const finalTranslationKey = translationKey || crypto.randomUUID();
  
      let post = await tx.query.blogPosts.findFirst({ 
        where: eq(blogPosts.translationKey, finalTranslationKey) 
      });
  
      if (!post) {
        [post] = await tx.insert(blogPosts).values({
          translationKey: finalTranslationKey,
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
        blogPostId: post!.id,
        locale, slug, title, excerpt, body, readingTime
      }).onConflictDoUpdate({
        target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
        set: { slug, title, excerpt, body, readingTime, updatedAt: new Date() }
      });
  
      // Sync Tags
      if (tagNames) {
        const tagIds: number[] = [];
        for (const name of tagNames) {
           const id = await resolveEntityReference(tx, tags, tags.slug, slugify(name), { name });
           if (id) tagIds.push(id);
        }
        await syncManyToMany(tx, blogPostsToTags, blogPostsToTags.blogPostId, post!.id, blogPostsToTags.tagId, tagIds);
      }
  
      return post;
    });
  },

  async update(id: number, data: BlogPostUpdate) {
    return await db.transaction(async (tx) => {
      // Resolve Category
      let categoryId = data.categoryId;
      if (data.categoryName) {
         categoryId = await resolveEntityReference(tx, categories, categories.slug, slugify(data.categoryName), { name: data.categoryName }) || undefined;
      }
  
      const { 
        categoryName, tags: tagNames,
        locale, slug, title, excerpt, body, readingTime,
        translationKey,
        ...entityData
      } = data;
  
      await tx.update(blogPosts).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : undefined,
        categoryId,
      }).where(eq(blogPosts.id, id));
  
      if (locale && slug !== undefined && title !== undefined && body !== undefined) {
          await tx.insert(blogPostTranslations).values({
            blogPostId: id,
            locale: locale!,
            slug: slug!,
            title: title!,
            excerpt,
            body: body!,
            readingTime
          }).onConflictDoUpdate({
            target: [blogPostTranslations.blogPostId, blogPostTranslations.locale],
            set: { slug, title, excerpt, body, readingTime, updatedAt: new Date() }
          });
      }
  
      // Sync Tags
      if (tagNames) {
        const tagIds: number[] = [];
        for (const name of tagNames) {
           const id = await resolveEntityReference(tx, tags, tags.slug, slugify(name), { name });
           if (id) tagIds.push(id);
        }
        await syncManyToMany(tx, blogPostsToTags, blogPostsToTags.blogPostId, id, blogPostsToTags.tagId, tagIds);
      }
  
      return await tx.query.blogPosts.findFirst({ where: eq(blogPosts.id, id) });
    });
  }
};