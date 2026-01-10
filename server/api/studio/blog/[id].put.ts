import { blogPosts, blogPostTranslations, categories, tags, blogPostsToTags } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { blogPostUpdateSchema, type BlogPostUpdate } from '~~/shared/schemas/blog.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const body = await readBody(event);
  const validation = blogPostUpdateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: BlogPostUpdate = validation.data;

  const result = await db.transaction(async (tx) => {
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

  return { result };
});