import { db } from "~~/server/utils/db";
import { skills } from "~~/server/db/schema";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().trim().min(1),
  name: i18nSchema,
  score: z.number().int().min(0).max(100).default(0),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, createSchema.parse);

  const [result] = await db.insert(skills).values(data).returning();

  return { skill: result };
});
