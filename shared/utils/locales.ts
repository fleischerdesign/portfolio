export const LOCALES = ['de', 'en'] as const;
export type AppLocale = typeof LOCALES[number];
export const DEFAULT_LOCALE: AppLocale = 'de';
