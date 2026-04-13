import { db } from "~~/server/utils/db";
import { interestCategories } from "~~/server/db/schema";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().trim().min(1),
  name: i18nSchema,
  icon: z.string().trim().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, createSchema.parse);

  const [result] = await db.insert(interestCategories).values(data).returning();

  return { category: result };
});
