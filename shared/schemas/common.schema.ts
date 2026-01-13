import { z } from 'zod';

export const i18nSchema = z.object({
  de: z.string().trim(),
  en: z.string().trim(),
});

export type I18nString = z.infer<typeof i18nSchema>;

export const addressSchema = z.object({
  street: z.string().trim().optional().nullable(),
  houseNumber: z.string().trim().optional().nullable(),
  zipcode: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  country: i18nSchema.optional().nullable(),
});

export type Address = z.infer<typeof addressSchema>;

