
import { blogPosts, blogPostTranslations, categories, tags, blogPostsToTags } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { blogPostCreateSchema, type BlogPostCreate } from '~~/shared/schemas/blog.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readBody(event);
  const validation = blogPostCreateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: BlogPostCreate = validation.data;

  const result = await db.transaction(async (tx) => {
    // 1. Get or create Category
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

    // Split data into Entity vs Translation vs Relations
    const { 
      categoryName, tags: tagNames, // Relations
      locale, slug, title, excerpt, body: contentBody, readingTime, // Translation
      translationKey, // ID
      ...entityData // status, publishedAt, coverImage...
    } = data;

    // 2. Get or Create Entity
    let post = await tx.query.blogPosts.findFirst({ 
      where: eq(blogPosts.translationKey, translationKey) 
    });

    if (!post) {
      [post] = await tx.insert(blogPosts).values({
        translationKey,
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : null,
        categoryId,
        authorId: event.context.user?.id
      }).returning();
    } else {
      await tx.update(blogPosts).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : post.publishedAt,
        categoryId: categoryId || post.categoryId,
      }).where(eq(blogPosts.id, post.id));
    }

    // 3. Create or Update Translation
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

    // 4. Sync Tags
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

  return { result };
});
