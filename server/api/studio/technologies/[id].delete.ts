import { db } from "~~/server/utils/db";
import { technologies, projectsToTechnologies } from "~~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.coerce.number().int().positive(),
    }).parse,
  );

  const [{ count }] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(projectsToTechnologies)
    .where(eq(projectsToTechnologies.technologyId, id));

  if (count > 0) {
    throw createError({
      statusCode: 409,
      statusMessage: `Technology is used by ${count} project(s) and cannot be deleted`,
    });
  }

  const [result] = await db
    .delete(technologies)
    .where(eq(technologies.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Technology not found",
    });
  }

  return { success: true };
});
