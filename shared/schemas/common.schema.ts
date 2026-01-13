import { z } from 'zod';

export const i18nSchema = z.object({
  de: z.string(),
  en: z.string(),
});

export type I18nString = z.infer<typeof i18nSchema>;
