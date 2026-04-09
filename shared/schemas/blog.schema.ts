import { z } from "zod";
import { LOCALES } from "../utils/locales";
import { CONTENT_STATUS } from "../types/content/status";
import { dateSchema } from "./date.schema";
import { authorSchema } from "./author.schema";
import { categorySchema } from "./category.schema";
import { tagSchema } from "./tag.schema";

// Raw database relation shapes (before transformation)
const blogPostRawRelations = z.object({
  category: categorySchema.nullable(),
  tags: z.array(z.object({ tag: tagSchema })),
  author: authorSchema.nullable(),
});

// --- Blog Post Schemas ---

export const blogPostBaseSchema = z.object({
  id: z.number().optional(),
  translationKey: z.string().trim().min(1, "Translation key is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  locale: z.enum(LOCALES),
  title: z.string().trim().min(1, "Title is required"),
  excerpt: z.string().trim().nullable(),
  body: z.string(),
  status: z.enum(CONTENT_STATUS).default("published"),
  publishedAt: dateSchema,
  coverImage: z.string().trim().nullable(),
  coverImageAlt: z.string().trim().nullable(),
  readingTime: z.number().nullable(),
  categoryId: z.number().optional().nullable(),
  authorId: z.number().optional().nullable(),
});

export const blogPostCreateSchema = blogPostBaseSchema
  .omit({
    id: true,
  })
  .extend({
    translationKey: z.string().trim().optional(),
    categoryName: z.string().trim().optional().nullable(),
    tags: z.array(z.string().trim()).optional().default([]),
    publishedAt: dateSchema,
  });

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const blogPostResponseSchema = blogPostBaseSchema
  .extend(blogPostRawRelations.shape)
  .transform((val) => ({
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
  }));

export const blogPostTranslationSchema = z.object({
  locale: z.enum(LOCALES),
  slug: z.string().trim(),
  title: z.string().trim(),
  excerpt: z.string().trim().nullable(),
});

export const blogPostStudioResponseSchema = blogPostBaseSchema
  .omit({
    locale: true,
    title: true,
    slug: true,
    excerpt: true,
    body: true,
    readingTime: true,
  })
  .extend({
    status: z.enum(CONTENT_STATUS),
    translationKey: z.string(),
    coverImage: z.string().nullable(),
    coverImageAlt: z.string().nullable(),
    publishedAt: dateSchema,
    createdAt: dateSchema,
    translations: z.array(
      blogPostTranslationSchema.extend({
        body: z.string(),
      }),
    ),
    tags: z.array(z.object({ tag: tagSchema })),
    category: categorySchema.nullable(),
    author: authorSchema.nullable(),
  })
  .transform((val) => ({
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
  }));

export type BlogPost = z.infer<typeof blogPostBaseSchema>;
export type BlogPostCreate = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdate = z.infer<typeof blogPostUpdateSchema>;
export type BlogPostResponse = z.infer<typeof blogPostResponseSchema>;
export type BlogPostStudioResponse = z.infer<typeof blogPostStudioResponseSchema>;
