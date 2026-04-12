import { db } from "~~/server/utils/db";
import { technologies } from "~~/server/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const featured = query.featured === "true";

  const rows = featured
    ? await db
        .select()
        .from(technologies)
        .where(eq(technologies.featured, true))
        .orderBy(technologies.name)
    : await db.select().from(technologies).orderBy(technologies.name);

  return { technologies: rows };
});
