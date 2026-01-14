export const LOCALES = ['de', 'en'] as const;
export type AppLocale = typeof LOCALES[number];
export const DEFAULT_LOCALE: AppLocale = 'de';

export function isAppLocale(val: string): val is AppLocale {
  return (LOCALES as readonly string[]).includes(val);
}
