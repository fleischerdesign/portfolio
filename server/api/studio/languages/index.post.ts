import { db } from "~~/server/utils/db";
import { languages } from "~~/server/db/schema";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().trim().min(1),
  name: i18nSchema,
  level: i18nSchema.nullable().optional(),
  score: z.number().int().min(0).max(100).default(0),
  sortOrder: z.number().int().default(0),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, createSchema.parse);

  const [result] = await db.insert(languages).values(data).returning();

  return { language: result };
});
