import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { projects, projectTranslations } from "~~/server/db/schema";
import { technologySchema } from "./technology.schema";
import {
  CONTENT_DATE_OVERRIDES,
  TRANSLATION_DATE_OVERRIDES,
  COMMON_CREATE_EXTENSIONS,
  buildCommonRelations,
} from "./content.schema";

export const projectBaseSchema = createSelectSchema(
  projects,
  CONTENT_DATE_OVERRIDES,
);

export const projectTranslationBaseSchema = createSelectSchema(
  projectTranslations,
  TRANSLATION_DATE_OVERRIDES,
);

export const projectCreateSchema = createInsertSchema(
  projects,
  CONTENT_DATE_OVERRIDES,
)
  .extend(COMMON_CREATE_EXTENSIONS)
  .extend({
    subtitle: z.string().optional().nullable(),
    features: z.array(z.string()).optional().nullable(),
    learned: z.array(z.string()).optional().nullable(),
    challenges: z.array(z.string()).optional().nullable(),
    techstack: z.array(z.string().trim()).optional().default([]),
  });

export const projectUpdateSchema = projectCreateSchema.partial();

const { translations: _, ...projectPublicRelations } = buildCommonRelations(
  projectTranslationBaseSchema,
);

const projectPublicResponseRelations = {
  ...projectPublicRelations,
  techstack: z.array(z.object({ technology: technologySchema })),
};

const projectStudioRelations = {
  ...buildCommonRelations(projectTranslationBaseSchema),
  techstack: z.array(z.object({ technology: technologySchema })),
};

export const projectResponseSchema = projectBaseSchema
  .extend({
    title: z.string(),
    slug: z.string(),
    subtitle: z.string().nullable(),
    body: z.string(),
    features: z.array(z.string()).nullable(),
    learned: z.array(z.string()).nullable(),
    challenges: z.array(z.string()).nullable(),
  })
  .extend(projectPublicResponseRelations)
  .transform((val) => ({
    ...val,
    tags: val.tags?.map((t) => t.tag) ?? [],
    techstack: val.techstack?.map((t) => t.technology) ?? [],
  }));

export const projectStudioResponseSchema = projectBaseSchema.extend(
  projectStudioRelations,
);

export type Project = z.infer<typeof projectBaseSchema>;
export type ProjectCreate = z.infer<typeof projectCreateSchema>;
export type ProjectUpdate = z.infer<typeof projectUpdateSchema>;
export type ProjectResponse = z.infer<typeof projectResponseSchema>;
export type ProjectStudioResponse = z.infer<typeof projectStudioResponseSchema>;
