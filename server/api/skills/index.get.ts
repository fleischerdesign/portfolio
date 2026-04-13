import { db } from "~~/server/utils/db";
import { skills } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const featured = query.featured === "true";

  const rows = featured
    ? await db
        .select()
        .from(skills)
        .where(eq(skills.featured, true))
        .orderBy(skills.sortOrder)
    : await db.select().from(skills).orderBy(skills.sortOrder);

  return { skills: rows };
});
