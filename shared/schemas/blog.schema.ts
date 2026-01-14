
import { z } from 'zod';
import { LOCALES } from '../utils/locales';

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
  translationKey: z.string().trim().min(1, 'Translation key is required'),
  slug: z.string().trim().min(1, 'Slug is required'),
  locale: z.enum(LOCALES),
  title: z.string().trim().min(1, 'Title is required'),
  excerpt: z.string().trim().nullable(),
  body: z.string(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  publishedAt: z.coerce.date().nullable(),
  coverImage: z.string().trim().nullable(),
  coverImageAlt: z.string().trim().nullable(),
  readingTime: z.number().nullable(),
  categoryId: z.number().optional().nullable(),
  authorId: z.number().optional().nullable(),
});

export const blogPostCreateSchema = blogPostBaseSchema.omit({ 
  id: true 
}).extend({
  translationKey: z.string().trim().optional(),
  categoryName: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim()).optional().default([]),
  publishedAt: z.coerce.date().optional().nullable(),
});

export const blogPostUpdateSchema = blogPostCreateSchema.partial();

export const blogPostResponseSchema = blogPostBaseSchema.extend({
  category: blogCategorySchema.nullable(),
  tags: z.array(blogTagSchema),
  author: authorSchema.nullable(),
});

export const blogPostTranslationSchema = z.object({
  locale: z.enum(LOCALES),
  slug: z.string().trim(),
  title: z.string().trim(),
  excerpt: z.string().trim().nullable(),
});

export const blogPostStudioResponseSchema = z.object({
  id: z.number(),
  status: z.enum(['draft', 'published', 'archived']),
  translationKey: z.string(),
  coverImage: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  publishedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date().nullable(),
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
