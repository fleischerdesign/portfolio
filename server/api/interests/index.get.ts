import { db } from "~~/server/utils/db";
import { interests, interestCategories } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const categorySlug = query.category as string | undefined;

  let rows;

  if (categorySlug) {
    const [cat] = await db
      .select({ id: interestCategories.id })
      .from(interestCategories)
      .where(eq(interestCategories.slug, categorySlug))
      .limit(1);

    if (!cat) {
      return { interests: [] };
    }

    rows = await db
      .select()
      .from(interests)
      .where(eq(interests.categoryId, cat.id))
      .orderBy(interests.sortOrder);
  } else {
    rows = await db.select().from(interests).orderBy(interests.sortOrder);
  }

  return { interests: rows };
});
