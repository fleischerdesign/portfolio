import type { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { courses } from "~~/server/db/schema";
import { dateSchema } from "./date.schema";

/**
 * @schema courseBaseSchema
 */
export const courseBaseSchema = createSelectSchema(courses, {
  startedAt: dateSchema,
  endedAt: dateSchema,
  createdAt: dateSchema,
});

/**
 * @schema courseCreateSchema
 */
export const courseCreateSchema = createInsertSchema(courses, {
  startedAt: dateSchema,
  endedAt: dateSchema,
  createdAt: dateSchema,
}).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const courseUpdateSchema = courseCreateSchema.partial();

export type DbCourse = z.infer<typeof courseBaseSchema>;
export type CourseCreate = z.infer<typeof courseCreateSchema>;
export type CourseUpdate = z.infer<typeof courseUpdateSchema>;
