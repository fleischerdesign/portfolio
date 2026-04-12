import { db } from "~~/server/utils/db";
import { technologies } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  icon: z.string().trim().optional().nullable(),
  featured: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { id } = await getValidatedRouterParams(
    event,
    z.object({
      id: z.coerce.number().int().positive(),
    }).parse,
  );

  const data = await readValidatedBody(event, updateSchema.parse);

  const [result] = await db
    .update(technologies)
    .set(data)
    .where(eq(technologies.id, id))
    .returning();

  if (!result) {
    throw createError({
      statusCode: 404,
      statusMessage: "Technology not found",
    });
  }

  return { technology: result };
});
