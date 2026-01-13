import { z } from 'zod';
import { i18nSchema } from './common.schema';

export const courseBaseSchema = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  title: i18nSchema.extend({
    de: z.string().trim().min(1, 'Required (DE)'),
    en: z.string().trim().min(1, 'Required (EN)'),
  }),
  organization: z.string().trim().nullable().optional(),
  teachers: z.array(z.string().trim()).nullable().optional(),
  startedAt: z.coerce.date().nullable().optional(),
  endedAt: z.coerce.date().nullable().optional(),
  certificateUrl: z.string().trim().url().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const courseCreateSchema = courseBaseSchema.omit({
  id: true,
  userId: true, // usually taken from session
  createdAt: true,
});

export const courseUpdateSchema = courseCreateSchema.partial();

export type DbCourse = z.infer<typeof courseBaseSchema>;
export type CourseCreate = z.infer<typeof courseCreateSchema>;
export type CourseUpdate = z.infer<typeof courseUpdateSchema>;
