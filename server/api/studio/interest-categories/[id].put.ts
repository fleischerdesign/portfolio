import { db } from "~~/server/utils/db";
import { interestCategories } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const updateSchema = z.object({
  slug: z.string().trim().min(1).optional(),
  name: i18nSchema.optional(),
  icon: z.string().trim().nullable().optional(),
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
    .update(interestCategories)
    .set(data)
    .where(eq(interestCategories.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Interest category not found",
    });
  }

  return { category: result };
});
