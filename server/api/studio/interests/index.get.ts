import { db } from "~~/server/utils/db";
import { interests, interestCategories } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const rows = await db
    .select({
      id: interests.id,
      slug: interests.slug,
      name: interests.name,
      categoryId: interests.categoryId,
      sortOrder: interests.sortOrder,
      category: {
        id: interestCategories.id,
        slug: interestCategories.slug,
        name: interestCategories.name,
      },
    })
    .from(interests)
    .leftJoin(
      interestCategories,
      eq(interests.categoryId, interestCategories.id),
    )
    .orderBy(interests.sortOrder);

  return { interests: rows };
});
