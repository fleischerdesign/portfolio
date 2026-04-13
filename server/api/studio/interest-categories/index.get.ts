import { db } from "~~/server/utils/db";
import { interestCategories } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const rows = await db
    .select()
    .from(interestCategories)
    .orderBy(interestCategories.sortOrder);
  return { categories: rows };
});
