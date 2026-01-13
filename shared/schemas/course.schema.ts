import { z } from 'zod';
import { i18nSchema } from './common.schema';

export const dbCourseSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: i18nSchema.extend({
    de: z.string().min(1, 'Pflichtfeld (DE)'),
    en: z.string().min(1, 'Pflichtfeld (EN)'),
  }),
  organization: z.string().nullable().optional(),
  teachers: z.array(z.string()).nullable().optional(),
  startedAt: z.coerce.date().nullable().optional(),
  endedAt: z.coerce.date().nullable().optional(),
  certificateUrl: z.string().url().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const createCourseSchema = dbCourseSchema.omit({
  id: true,
  userId: true, // usually taken from session
  createdAt: true,
});

export const updateCourseSchema = createCourseSchema.partial();

export type DbCourse = z.infer<typeof dbCourseSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
