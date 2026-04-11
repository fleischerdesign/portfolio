import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { blogPosts, blogPostTranslations } from "~~/server/db/schema";
import {
  CONTENT_DATE_OVERRIDES,
  TRANSLATION_DATE_OVERRIDES,
  COMMON_CREATE_EXTENSIONS,
  buildCommonRelations,
} from "./content.schema";

export const blogPostBaseSchema = createSelectSchema(
  blogPosts,
  CONTENT_DATE_OVERRIDES,
);

export const blogPostTranslationBaseSchema = createSelectSchema(
  blogPostTranslations,
  TRANSLATION_DATE_OVERRIDES,
);

export const blogPostCreateSchema = createInsertSchema(
  blogPosts,
  CONTENT_DATE_OVERRIDES,
)
  .extend(COMMON_CREATE_EXTENSIONS)
  .extend({
    excerpt: z.string().optional().nullable(),
  });

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

const { translations, ...blogPostPublicRelations } = buildCommonRelations(
  blogPostTranslationBaseSchema,
);

const blogPostStudioRelations = buildCommonRelations(
  blogPostTranslationBaseSchema,
);

export const blogPostResponseSchema = blogPostBaseSchema
  .extend({
    title: z.string(),
    slug: z.string(),
    body: z.string(),
    excerpt: z.string().nullable(),
    readingTime: z.number().nullable(),
  })
  .extend(blogPostPublicRelations)
  .transform((val) => ({
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
  }));

export const blogPostStudioResponseSchema = blogPostBaseSchema.extend(
  blogPostStudioRelations,
);

export type BlogPost = z.infer<typeof blogPostBaseSchema>;
export type BlogPostCreate = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdate = z.infer<typeof blogPostUpdateSchema>;
export type BlogPostResponse = z.infer<typeof blogPostResponseSchema>;
export type BlogPostStudioResponse = z.infer<
  typeof blogPostStudioResponseSchema
>;
