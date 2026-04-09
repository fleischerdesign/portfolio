import {
  blogPosts,
  blogPostTranslations,
  categories,
  tags,
  blogPostsToTags,
} from "~~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  blogPostResponseSchema,
  blogPostStudioResponseSchema,
  type BlogPostResponse,
  type BlogPostUpdate,
  type BlogPostCreate,
} from "~~/shared/schemas/blog.schema";
import { createLogger } from "../utils/logger";
import { createTranslatableService, type TranslatableEntityDescriptor } from "../utils/db.engine";

const logger = createLogger("blog");

/**
 * @descriptor blogDescriptor
 * @description Configuration for the blog entity.
 */
const blogDescriptor: TranslatableEntityDescriptor = {
  mainTable: blogPosts,
  translationTable: blogPostTranslations,
  parentColumnName: "blogPostId",
  categoriesTable: categories,
  relations: {
    tags: {
      junctionTable: blogPostsToTags,
      lookupTable: tags,
      parentColumn: blogPostsToTags.blogPostId,
      lookupColumn: blogPostsToTags.tagId,
    },
  },
};

const engine = createTranslatableService<BlogPostCreate, BlogPostUpdate>(blogDescriptor);

/**
 * @service blogService
 * @description Service for managing blog posts.
 */
export const blogService = {
  ...engine,

  async getPublicAll(locale: AppLocale, limit?: number): Promise<BlogPostResponse[]> {
    logger.info("getPublicAll", `Fetching posts for locale: ${locale}`, { limit });

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

    return posts
      .filter((p) => p.translations[0])
      .map((post) => {
        const translation = post.translations[0]!;
        return blogPostResponseSchema.parse({
          ...post,
          ...translation,
        });
      });
  },

  async getPublicBySlug(slug: string, locale: AppLocale): Promise<BlogPostResponse | null> {
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

    if (!translation?.post || translation.post.status !== "published") return null;

    return blogPostResponseSchema.parse({
      ...translation.post,
      ...translation,
    });
  },

  async getStudioAll(limit?: number) {
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

    return posts.map((post) => blogPostStudioResponseSchema.parse(post));
  },

  async getStudioById(id: number) {
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
      throw createError({ statusCode: 404, statusMessage: "Blog post not found" });
    }

    return blogPostStudioResponseSchema.parse(post);
  },

  async create(data: BlogPostCreate, authorId?: number) {
    logger.info("create", "Creating new blog post", { authorId });
    return await db.transaction(async (tx) => {
      return await engine.create(tx, data, authorId);
    });
  },

  async update(id: number, data: BlogPostUpdate) {
    logger.info("update", `Updating post with id: ${id}`);
    return await db.transaction(async (tx) => {
      return await engine.update(tx, id, data);
    });
  },
};
