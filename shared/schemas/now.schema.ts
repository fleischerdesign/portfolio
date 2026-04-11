import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { nowEntries, nowEntryTranslations } from "~~/server/db/schema";
import { dateSchema } from "./date.schema";

export const nowEntryBaseSchema = createSelectSchema(nowEntries, {
  createdAt: dateSchema,
});

export const nowEntryTranslationBaseSchema = createSelectSchema(
  nowEntryTranslations,
  {
    updatedAt: dateSchema,
  },
);

export const nowEntryResponseSchema = z.object({
  status: z.string(),
  icon: z.string(),
  updatedAt: dateSchema,
});

export type NowEntryResponse = z.infer<typeof nowEntryResponseSchema>;
