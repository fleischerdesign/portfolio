import { z, type ZodTypeAny } from "zod";
import { dateSchema } from "./date.schema";
import { authorSchema } from "./author.schema";
import { categorySchema } from "./category.schema";
import { tagSchema } from "./tag.schema";

export const CONTENT_DATE_OVERRIDES = {
  publishedAt: dateSchema,
  createdAt: dateSchema.optional(),
  updatedAt: dateSchema.optional(),
};

export const TRANSLATION_DATE_OVERRIDES = {
  updatedAt: dateSchema,
};

export const COMMON_CREATE_EXTENSIONS = {
  translationKey: z.string().optional(),
  locale: z.string(),
  slug: z.string(),
  title: z.string(),
  body: z.string(),
  categoryName: z.string().trim().optional().nullable(),
  tags: z.array(z.string().trim()).optional().default([]),
};

export function buildCommonRelations<TTranslationSchema extends ZodTypeAny>(
  translationBaseSchema: TTranslationSchema,
) {
  return {
    category: categorySchema.nullable(),
    tags: z.array(z.object({ tag: tagSchema })),
    author: authorSchema.nullable(),
    translations: z.array(translationBaseSchema),
  };
}
