import { db } from "~~/server/utils/db";
import { timelineEntries } from "~~/server/db/schema";

export default defineEventHandler(async () => {
  const rows = await db
    .select()
    .from(timelineEntries)
    .orderBy(timelineEntries.sortOrder);
  return { timeline: rows };
});
