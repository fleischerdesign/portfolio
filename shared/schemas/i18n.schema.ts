import { z } from 'zod';

/**
 * @schema i18nSchema
 * @description Standard i18n structure for translatable strings.
 */
export const i18nSchema = z.object({
  de: z.string().trim(),
  en: z.string().trim(),
});

export type I18nString = z.infer<typeof i18nSchema>;
