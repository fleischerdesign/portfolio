import { db } from "~~/server/utils/db";
import { interests } from "~~/server/db/schema";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().trim().min(1),
  name: i18nSchema,
  categoryId: z.number().int().positive(),
  sortOrder: z.number().int().default(0),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, createSchema.parse);

  const [result] = await db.insert(interests).values(data).returning();

  return { interest: result };
});
