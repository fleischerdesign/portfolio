import { z } from "zod";
import { LOCALES } from "../utils/locales";
import { CONTENT_STATUS } from "../types/content/status";
import { dateSchema } from "./date.schema";
import { authorSchema } from "./author.schema";
import { categorySchema } from "./category.schema";
import { tagSchema } from "./tag.schema";
import { technologySchema } from "./technology.schema";

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
  publishedAt: dateSchema,
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
    publishedAt: dateSchema,
  });

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectResponseSchema = projectBaseSchema
  .extend(projectRawRelations.shape)
  .transform((val) => ({
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
    techstack: val.techstack?.map((t) => t.technology) ?? [],
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
    publishedAt: dateSchema,
    createdAt: dateSchema,
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
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
    techstack: val.techstack?.map((t) => t.technology) ?? [],
  }));

export type Project = z.infer<typeof projectBaseSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectStudioResponse = z.infer<typeof projectStudioResponseSchema>;
