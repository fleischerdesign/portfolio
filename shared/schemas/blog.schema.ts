
import { z } from 'zod';

// --- Sub-Schemas ---

export const authorSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
});

export const blogCategorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export const blogTagSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

// --- Blog Post Schemas ---

export const blogPostBaseSchema = z.object({
  id: z.number().optional(),
  translationKey: z.string(),
  slug: z.string(),
  locale: z.enum(['de', 'en']),
  title: z.string(),
  excerpt: z.string().nullable(),
  body: z.string(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  publishedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  coverImage: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  readingTime: z.number().nullable(),
  categoryId: z.number().optional().nullable(),
  authorId: z.number().optional().nullable(),
});

export const blogPostCreateSchema = blogPostBaseSchema.omit({ 
  id: true 
}).extend({
  translationKey: z.string().optional(),
  categoryName: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const blogPostResponseSchema = blogPostBaseSchema.extend({
  category: blogCategorySchema.nullable(),
  tags: z.array(blogTagSchema),
  author: authorSchema.nullable(),
});

export const blogPostTranslationSchema = z.object({
  locale: z.enum(['de', 'en']),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string().nullable(),
});

export const blogPostStudioResponseSchema = z.object({
  id: z.number(),
  status: z.enum(['draft', 'published', 'archived']),
  translationKey: z.string(),
  coverImage: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  publishedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  createdAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  translations: z.array(blogPostTranslationSchema.extend({
      body: z.string(),
  })),
  tags: z.array(blogTagSchema),
  category: blogCategorySchema.nullable(),
  author: authorSchema.nullable(),
});

export type Author = z.infer<typeof authorSchema>;
export type BlogCategory = z.infer<typeof blogCategorySchema>;
export type BlogTag = z.infer<typeof blogTagSchema>;
export type BlogPost = z.infer<typeof blogPostBaseSchema>;
export type BlogPostCreate = z.infer<typeof blogPostCreateSchema>;
export type BlogPostUpdate = z.infer<typeof blogPostUpdateSchema>;
export type BlogPostResponse = z.infer<typeof blogPostResponseSchema>;
export type BlogPostStudioResponse = z.infer<typeof blogPostStudioResponseSchema>;
