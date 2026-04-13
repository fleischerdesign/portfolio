import { db } from "~~/server/utils/db";
import { skills } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const rows = await db.select().from(skills).orderBy(skills.sortOrder);
  return { skills: rows };
});
