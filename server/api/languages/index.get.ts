import { db } from "~~/server/utils/db";
import { languages } from "~~/server/db/schema";

export default defineEventHandler(async () => {
  const rows = await db.select().from(languages).orderBy(languages.sortOrder);
  return { languages: rows };
});
