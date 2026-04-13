import { db } from "~~/server/utils/db";
import { timelineEntries } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({ id: z.coerce.number().int().positive() }).parse,
  );

  const [result] = await db
    .delete(timelineEntries)
    .where(eq(timelineEntries.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Timeline entry not found",
    });
  }

  return { success: true };
});
