import { db } from "~~/server/utils/db";
import { timelineEntries } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const i18nArraySchema = z.array(i18nSchema).nullable().optional();

const updateSchema = z.object({
  slug: z.string().trim().min(1).optional(),
  date: z.string().trim().min(1).optional(),
  title: i18nSchema.optional(),
  description: i18nSchema.optional(),
  icon: z.string().trim().nullable().optional(),
  type: z.enum(["education", "career"]).optional(),
  skills: i18nArraySchema,
  sortOrder: z.number().int().optional(),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({ id: z.coerce.number().int().positive() }).parse,
  );

  const data = await readValidatedBody(event, updateSchema.parse);

  const [result] = await db
    .update(timelineEntries)
    .set(data)
    .where(eq(timelineEntries.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Timeline entry not found",
    });
  }

  return { entry: result };
});
