import { z } from 'zod';
import { authorSchema, blogCategorySchema as categorySchema, blogTagSchema as tagSchema } from './blog.schema';

export const technologySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export const projectBaseSchema = z.object({
  id: z.number().optional(),
  translationKey: z.string(),
  slug: z.string(),
  locale: z.enum(['de', 'en']),
  title: z.string(),
  subtitle: z.string().nullable(),
  body: z.string(),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
  publishedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  icon: z.string().nullable().optional(),
  coverImage: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  repoUrl: z.string().nullable(),
  projectUrl: z.string().nullable(),
  features: z.array(z.string()).nullable(),
  learned: z.array(z.string()).nullable(),
  challenges: z.array(z.string()).nullable(),
  categoryId: z.number().optional().nullable(),
  authorId: z.number().optional().nullable(),
});

export const projectCreateSchema = projectBaseSchema.omit({ 
  id: true 
}).extend({
  categoryName: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  techstack: z.array(z.string()).optional().default([]),
  publishedAt: z.string().datetime().optional().nullable(),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectResponseSchema = projectBaseSchema.extend({
  category: categorySchema.nullable(),
  tags: z.array(tagSchema),
  techstack: z.array(technologySchema),
  author: authorSchema.nullable(),
});

export const projectTranslationSchema = z.object({
  locale: z.enum(['de', 'en']),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
});

export const projectStudioResponseSchema = z.object({
  id: z.number(),
  status: z.enum(['draft', 'published', 'archived']),
  translationKey: z.string(),
  coverImage: z.string().nullable(),
  coverImageAlt: z.string().nullable(),
  icon: z.string().nullable(),
  repoUrl: z.string().nullable(),
  projectUrl: z.string().nullable(),
  publishedAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  createdAt: z.union([z.string(), z.date()]).transform(val => new Date(val)).nullable(),
  translations: z.array(projectTranslationSchema.extend({
      body: z.string(),
      features: z.array(z.string()).nullable(),
      learned: z.array(z.string()).nullable(),
      challenges: z.array(z.string()).nullable(),
  })),
  tags: z.array(tagSchema),
  techstack: z.array(technologySchema),
  category: categorySchema.nullable(),
  author: authorSchema.nullable(),
});

export type Technology = z.infer<typeof technologySchema>;
export type Project = z.infer<typeof projectBaseSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectStudioResponse = z.infer<typeof projectStudioResponseSchema>;