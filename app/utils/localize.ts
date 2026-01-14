/**
 * Helper to retrieve the correct string from a localized object { de, en }
 * based on the current locale.
 */
export const localize = (
  obj: { de?: string | null; en?: string | null } | null | undefined, 
  locale: string
): string => {
  if (!obj) return '';
  
  // Safe cast since we know our schema, but also handle runtime mismatch
  const key = (LOCALES as readonly string[]).includes(locale) ? locale as AppLocale : DEFAULT_LOCALE;
  
  return obj[key] || obj['en'] || obj['de'] || '';
};
