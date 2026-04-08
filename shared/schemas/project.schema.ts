import { z } from "zod";
import { LOCALES } from "../utils/locales";
import { CONTENT_STATUS } from "../types/content/status";
import {
  authorSchema,
  blogCategorySchema as categorySchema,
  blogTagSchema as tagSchema,
} from "./blog.schema";

export const technologySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

// Raw database relation shapes (before transformation)
const projectRawRelations = z.object({
  category: categorySchema.nullable(),
  tags: z.array(z.object({ tag: tagSchema })),
  techstack: z.array(z.object({ technology: technologySchema })),
  author: authorSchema.nullable(),
});

export const projectBaseSchema = z.object({
  id: z.number().optional(),
  translationKey: z.string().trim().min(1, "Translation key is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  locale: z.enum(LOCALES),
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().nullable(),
  body: z.string(),
  status: z.enum(CONTENT_STATUS).default("published"),
  publishedAt: z.coerce.date().nullable(),
  icon: z.string().trim().nullable().optional(),
  coverImage: z.string().trim().nullable(),
  coverImageAlt: z.string().trim().nullable(),
  repoUrl: z.string().trim().nullable(),
  projectUrl: z.string().trim().nullable(),
  features: z.array(z.string().trim()).nullable(),
  learned: z.array(z.string().trim()).nullable(),
  challenges: z.array(z.string().trim()).nullable(),
  categoryId: z.number().optional().nullable(),
  authorId: z.number().optional().nullable(),
});

export const projectCreateSchema = projectBaseSchema
  .omit({
    id: true,
  })
  .extend({
    categoryName: z.string().trim().optional().nullable(),
    tags: z.array(z.string().trim()).optional().default([]),
    techstack: z.array(z.string().trim()).optional().default([]),
    publishedAt: z.coerce.date().optional().nullable(),
  });

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectResponseSchema = projectBaseSchema
  .extend(projectRawRelations.shape)
  .transform((val) => ({
    id: val.id,
    translationKey: val.translationKey,
    slug: val.slug,
    locale: val.locale,
    title: val.title,
    subtitle: val.subtitle,
    body: val.body,
    status: val.status,
    publishedAt: val.publishedAt,
    icon: val.icon,
    coverImage: val.coverImage,
    coverImageAlt: val.coverImageAlt,
    repoUrl: val.repoUrl,
    projectUrl: val.projectUrl,
    features: val.features,
    learned: val.learned,
    challenges: val.challenges,
    categoryId: val.categoryId,
    authorId: val.authorId,
    category: val.category,
    tags: val.tags?.map((t) => t.tag) ?? [],
    techstack: val.techstack?.map((t) => t.technology) ?? [],
    author: val.author,
  }));

export const projectTranslationSchema = z.object({
  locale: z.enum(LOCALES),
  slug: z.string().trim(),
  title: z.string().trim(),
  subtitle: z.string().trim().nullable(),
});

export const projectStudioResponseSchema = projectBaseSchema
  .omit({
    locale: true,
    slug: true,
    title: true,
    subtitle: true,
    body: true,
    features: true,
    learned: true,
    challenges: true,
  })
  .extend({
    status: z.enum(CONTENT_STATUS),
    translationKey: z.string(),
    coverImage: z.string().nullable(),
    coverImageAlt: z.string().nullable(),
    icon: z.string().nullable(),
    repoUrl: z.string().nullable(),
    projectUrl: z.string().nullable(),
    publishedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date().nullable(),
    translations: z.array(
      projectTranslationSchema.extend({
        body: z.string(),
        features: z.array(z.string()).nullable(),
        learned: z.array(z.string()).nullable(),
        challenges: z.array(z.string()).nullable(),
      }),
    ),
    tags: z.array(z.object({ tag: tagSchema })),
    techstack: z.array(z.object({ technology: technologySchema })),
    category: categorySchema.nullable(),
    author: authorSchema.nullable(),
  })
  .transform((val) => ({
    id: val.id,
    status: val.status,
    translationKey: val.translationKey,
    coverImage: val.coverImage,
    coverImageAlt: val.coverImageAlt,
    icon: val.icon,
    repoUrl: val.repoUrl,
    projectUrl: val.projectUrl,
    publishedAt: val.publishedAt,
    createdAt: val.createdAt,
    translations: val.translations,
    tags: val.tags?.map((t) => t.tag) ?? [],
    techstack: val.techstack?.map((t) => t.technology) ?? [],
    category: val.category,
    author: val.author,
  }));

export type Technology = z.infer<typeof technologySchema>;
export type Project = z.infer<typeof projectBaseSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectStudioResponse = z.infer<typeof projectStudioResponseSchema>;
