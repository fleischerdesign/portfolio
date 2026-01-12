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
  const key = (locale === 'de' || locale === 'en') ? locale : 'en';
  
  return obj[key] || obj['en'] || obj['de'] || '';
};
