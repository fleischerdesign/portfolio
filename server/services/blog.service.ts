import {
  blogPosts,
  blogPostTranslations,
  categories,
  tags,
  blogPostsToTags,
} from "~~/server/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import {
  blogPostResponseSchema,
  blogPostStudioResponseSchema,
  type BlogPostResponse,
  type BlogPostUpdate,
  type BlogPostCreate,
} from "~~/shared/schemas/blog.schema";
import { slugify } from "~~/shared/utils/slugify";
import { createLogger } from "../utils/logger";

const logger = createLogger("blog");

export const blogService = {
  async getPublicAll(
    locale: AppLocale,
    limit?: number,
  ): Promise<BlogPostResponse[]> {
    logger.info(
      "getPublicAll",
      `Fetching published posts for locale: ${locale}`,
      { limit },
    );

    const posts = await db.query.blogPosts.findMany({
      where: (posts, { eq }) => eq(posts.status, "published"),
      limit,
      with: {
        translations: { where: (trans, { eq }) => eq(trans.locale, locale) },
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
      orderBy: [desc(blogPosts.publishedAt)],
    });

    logger.info("getPublicAll", `Found ${posts.length} published posts`);

    return posts
      .filter((p) => p.translations[0])
      .map((post) => {
        const translation = post.translations[0]!;
        return blogPostResponseSchema.parse({
          ...post,
          locale: translation.locale,
          slug: translation.slug,
          title: translation.title,
          excerpt: translation.excerpt,
          body: translation.body,
          readingTime: translation.readingTime,
        });
      });
  },

  async getPublicBySlug(
    slug: string,
    locale: AppLocale,
  ): Promise<BlogPostResponse | null> {
    logger.info("getPublicBySlug", `Fetching post with slug: ${slug}`, {
      locale,
    });

    const translation = await db.query.blogPostTranslations.findFirst({
      where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
      with: {
        post: {
          with: {
            category: true,
            tags: { with: { tag: true } },
            author: true,
          },
        },
      },
    });

    if (!translation?.post || translation.post.status !== "published") {
      logger.warn(
        "getPublicBySlug",
        `Post not found or not published: ${slug}`,
      );
      return null;
    }

    logger.info("getPublicBySlug", `Found post: ${slug}`);

    return blogPostResponseSchema.parse({
      ...translation.post,
      locale: translation.locale,
      slug: translation.slug,
      title: translation.title,
      excerpt: translation.excerpt,
      body: translation.body,
      readingTime: translation.readingTime,
    });
  },

  async getStudioAll(limit?: number) {
    logger.info("getStudioAll", "Fetching all posts for studio", { limit });

    const posts = await db.query.blogPosts.findMany({
      limit,
      with: {
        translations: true,
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
      orderBy: [desc(blogPosts.createdAt)],
    });

    logger.info("getStudioAll", `Found ${posts.length} posts`);

    return posts.map((post) => blogPostStudioResponseSchema.parse(post));
  },

  async getStudioById(id: number) {
    logger.info("getStudioById", `Fetching post with id: ${id}`);

    const post = await db.query.blogPosts.findFirst({
      where: eq(blogPosts.id, id),
      with: {
        translations: true,
        category: true,
        tags: { with: { tag: true } },
        author: true,
      },
    });

    if (!post) {
      logger.warn("getStudioById", `Post not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Blog post not found",
      });
    }

    logger.info("getStudioById", `Found post: ${id}`);
    return blogPostStudioResponseSchema.parse(post);
  },

  async create(data: BlogPostCreate, authorId?: number) {
    logger.info("create", "Creating new blog post", { authorId });

    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (data.categoryName) {
        const slug = slugify(data.categoryName);
        const [category] = await tx
          .insert(categories)
          .values({ slug, name: data.categoryName })
          .onConflictDoUpdate({
            target: categories.slug,
            set: { name: data.categoryName },
          })
          .returning({ id: categories.id });
        categoryId = category?.id;
      }

      const {
        categoryName,
        tags: tagNames,
        locale,
        slug,
        title,
        excerpt,
        body,
        readingTime,
        translationKey,
        ...entityData
      } = data;

      const finalTranslationKey = translationKey || crypto.randomUUID();

      let post = await tx.query.blogPosts.findFirst({
        where: eq(blogPosts.translationKey, finalTranslationKey),
      });

      if (!post) {
        [post] = await tx
          .insert(blogPosts)
          .values({
            translationKey: finalTranslationKey,
            ...entityData,
            publishedAt: entityData.publishedAt
              ? new Date(entityData.publishedAt)
              : null,
            categoryId,
            authorId,
          })
          .returning();
      } else {
        await tx
          .update(blogPosts)
          .set({
            ...entityData,
            publishedAt: entityData.publishedAt
              ? new Date(entityData.publishedAt)
              : post.publishedAt,
            categoryId: categoryId || post.categoryId,
          })
          .where(eq(blogPosts.id, post.id));
      }

      await tx
        .insert(blogPostTranslations)
        .values({
          blogPostId: post!.id,
          locale,
          slug,
          title,
          excerpt,
          body,
          readingTime,
        })
        .onConflictDoUpdate({
          target: [
            blogPostTranslations.blogPostId,
            blogPostTranslations.locale,
          ],
          set: {
            slug,
            title,
            excerpt,
            body,
            readingTime,
            updatedAt: new Date(),
          },
        });

      if (tagNames && tagNames.length > 0) {
        const tagData = tagNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTags = await tx
          .insert(tags)
          .values(tagData)
          .onConflictDoUpdate({
            target: tags.slug,
            set: { name: tags.name },
          })
          .returning({ id: tags.id, slug: tags.slug });

        const existingTags = await tx
          .select({ id: tags.id, slug: tags.slug })
          .from(tags)
          .where(
            inArray(
              tags.slug,
              tagData.map((t) => t.slug),
            ),
          );

        const allTags = newTags.concat(
          existingTags.filter((e) => !newTags.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(blogPostsToTags)
          .values(allTags.map((t) => ({ blogPostId: post!.id, tagId: t.id })))
          .onConflictDoNothing({
            target: [blogPostsToTags.blogPostId, blogPostsToTags.tagId],
          });
      }

      logger.info("create", `Created post with id: ${post!.id}`);
      return post;
    });
  },

  async update(id: number, data: BlogPostUpdate) {
    logger.info("update", `Updating post with id: ${id}`);

    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (data.categoryName) {
        const slug = slugify(data.categoryName);
        const [category] = await tx
          .insert(categories)
          .values({ slug, name: data.categoryName })
          .onConflictDoUpdate({
            target: categories.slug,
            set: { name: data.categoryName },
          })
          .returning({ id: categories.id });
        categoryId = category?.id;
      }

      const {
        categoryName,
        tags: tagNames,
        locale,
        slug,
        title,
        excerpt,
        body,
        readingTime,
        translationKey,
        ...entityData
      } = data;

      await tx
        .update(blogPosts)
        .set({
          ...entityData,
          publishedAt: entityData.publishedAt
            ? new Date(entityData.publishedAt)
            : undefined,
          categoryId,
        })
        .where(eq(blogPosts.id, id));

      if (
        locale &&
        slug !== undefined &&
        title !== undefined &&
        body !== undefined
      ) {
        await tx
          .insert(blogPostTranslations)
          .values({
            blogPostId: id,
            locale: locale!,
            slug: slug!,
            title: title!,
            excerpt,
            body: body!,
            readingTime,
          })
          .onConflictDoUpdate({
            target: [
              blogPostTranslations.blogPostId,
              blogPostTranslations.locale,
            ],
            set: {
              slug,
              title,
              excerpt,
              body,
              readingTime,
              updatedAt: new Date(),
            },
          });
      }

      if (tagNames && tagNames.length > 0) {
        const tagData = tagNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTags = await tx
          .insert(tags)
          .values(tagData)
          .onConflictDoUpdate({
            target: tags.slug,
            set: { name: tags.name },
          })
          .returning({ id: tags.id, slug: tags.slug });

        const existingTags = await tx
          .select({ id: tags.id, slug: tags.slug })
          .from(tags)
          .where(
            inArray(
              tags.slug,
              tagData.map((t) => t.slug),
            ),
          );

        const allTags = newTags.concat(
          existingTags.filter((e) => !newTags.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(blogPostsToTags)
          .values(allTags.map((t) => ({ blogPostId: id, tagId: t.id })))
          .onConflictDoNothing({
            target: [blogPostsToTags.blogPostId, blogPostsToTags.tagId],
          });
      }

      logger.info("update", `Updated post with id: ${id}`);

      return await tx.query.blogPosts.findFirst({
        where: eq(blogPosts.id, id),
      });
    });
  },
};
