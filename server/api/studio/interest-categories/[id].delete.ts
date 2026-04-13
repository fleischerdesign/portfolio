import { db } from "~~/server/utils/db";
import { interestCategories, interests } from "~~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({ id: z.coerce.number().int().positive() }).parse,
  );

  const [countResult] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(interests)
    .where(eq(interests.categoryId, id));

  const count = countResult?.count ?? 0;

  if (count > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: `Category is used by ${count} interest(s) and cannot be deleted`,
    });
  }

  const [deleted] = await db
    .delete(interestCategories)
    .where(eq(interestCategories.id, id))
    .returning();

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Interest category not found",
    });
  }

  return { success: true };
});
