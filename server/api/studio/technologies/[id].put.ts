import { db } from "~~/server/utils/db";
import { technologies } from "~~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { slugify } from "~~/shared/utils/slugify";

const updateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  icon: z.string().trim().optional().nullable(),
  featured: z.boolean().optional(),
  slug: z.string().optional(),
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

  const updates = { ...data };
  if (data.name) {
    updates.slug = slugify(data.name);
  }

  const [result] = await db
    .update(technologies)
    .set(updates)
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
