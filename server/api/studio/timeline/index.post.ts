import { db } from "~~/server/utils/db";
import { timelineEntries } from "~~/server/db/schema";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const i18nArraySchema = z.array(i18nSchema).nullable().optional();

const createSchema = z.object({
  slug: z.string().trim().min(1),
  date: z.string().trim().min(1),
  title: i18nSchema,
  description: i18nSchema,
  icon: z.string().trim().nullable().optional(),
  type: z.enum(["education", "career"]),
  skills: i18nArraySchema,
  sortOrder: z.number().int().default(0),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, createSchema.parse);

  const [result] = await db.insert(timelineEntries).values(data).returning();

  return { entry: result };
});
