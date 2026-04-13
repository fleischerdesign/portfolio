import type { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
  skills,
  languages,
  interestCategories,
  interests,
  timelineEntries,
} from "~~/server/db/schema";

export const skillSchema = createSelectSchema(skills);
export const skillCreateSchema = createInsertSchema(skills).omit({
  id: true,
});
export const skillUpdateSchema = skillCreateSchema.partial();

export type DbSkill = z.infer<typeof skillSchema>;
export type SkillCreate = z.infer<typeof skillCreateSchema>;
export type SkillUpdate = z.infer<typeof skillUpdateSchema>;

export const languageSchema = createSelectSchema(languages);
export const languageCreateSchema = createInsertSchema(languages).omit({
  id: true,
});
export const languageUpdateSchema = languageCreateSchema.partial();

export type DbLanguage = z.infer<typeof languageSchema>;
export type LanguageCreate = z.infer<typeof languageCreateSchema>;
export type LanguageUpdate = z.infer<typeof languageUpdateSchema>;

export const interestCategorySchema = createSelectSchema(interestCategories);
export const interestCategoryCreateSchema = createInsertSchema(
  interestCategories,
).omit({ id: true });
export const interestCategoryUpdateSchema =
  interestCategoryCreateSchema.partial();

export type DbInterestCategory = z.infer<typeof interestCategorySchema>;
export type InterestCategoryCreate = z.infer<
  typeof interestCategoryCreateSchema
>;
export type InterestCategoryUpdate = z.infer<
  typeof interestCategoryUpdateSchema
>;

export const interestSchema = createSelectSchema(interests);
export const interestCreateSchema = createInsertSchema(interests).omit({
  id: true,
});
export const interestUpdateSchema = interestCreateSchema.partial();

export type DbInterest = z.infer<typeof interestSchema>;
export type InterestCreate = z.infer<typeof interestCreateSchema>;
export type InterestUpdate = z.infer<typeof interestUpdateSchema>;

export const timelineEntrySchema = createSelectSchema(timelineEntries);
export const timelineEntryCreateSchema = createInsertSchema(
  timelineEntries,
).omit({ id: true });
export const timelineEntryUpdateSchema = timelineEntryCreateSchema.partial();

export type DbTimelineEntry = z.infer<typeof timelineEntrySchema>;
export type TimelineEntryCreate = z.infer<typeof timelineEntryCreateSchema>;
export type TimelineEntryUpdate = z.infer<typeof timelineEntryUpdateSchema>;
