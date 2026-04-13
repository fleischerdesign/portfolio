import { db } from "~~/server/utils/db";
import { interests } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { i18nSchema } from "#shared/schemas/i18n.schema";
import { z } from "zod";

const updateSchema = z.object({
  slug: z.string().trim().min(1).optional(),
  name: i18nSchema.optional(),
  categoryId: z.number().int().positive().optional(),
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
    .update(interests)
    .set(data)
    .where(eq(interests.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Interest not found",
    });
  }

  return { interest: result };
});
