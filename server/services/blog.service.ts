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
  type BlogPostCreate,
} from "~~/shared/schemas/blog.schema";
import {
  createContentService,
  type EntityDescriptor,
} from "../utils/db.engine";

const blogDescriptor: EntityDescriptor<
  typeof blogPosts,
  typeof blogPostTranslations,
  BlogPostCreate
> = {
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

export const blogService = createContentService({
  name: "blog",
  entityName: "Blog post",
  descriptor: blogDescriptor,
  publicResponseSchema: blogPostResponseSchema,
  studioResponseSchema: blogPostStudioResponseSchema,
  queries: {
    async publishedList(locale, limit) {
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
          return blogPostResponseSchema.parse({ ...post, ...translation });
        });
    },

    async publishedBySlug(slug, locale) {
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

      if (!translation?.post || translation.post.status !== "published")
        return null;

      return blogPostResponseSchema.parse({
        ...translation.post,
        ...translation,
      });
    },

    async studioList(limit) {
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

    async studioById(id) {
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, id),
        with: {
          translations: true,
          category: true,
          tags: { with: { tag: true } },
          author: true,
        },
      });

      return post ? blogPostStudioResponseSchema.parse(post) : null;
    },
  },
});
