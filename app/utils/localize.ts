import { DEFAULT_LOCALE, isAppLocale } from '~~/shared/utils/locales';

/**
 * Helper to retrieve the correct string from a localized object { de, en }
 * based on the current locale.
 */
export const localize = (
  obj: { de?: string | null; en?: string | null } | null | undefined, 
  locale: string
): string => {
  if (!obj) return '';
  
  const key = isAppLocale(locale) ? locale : DEFAULT_LOCALE;
  
  return obj[key] || obj['en'] || obj['de'] || '';
};
