import { H3Event, getQuery } from 'h3';

export const getValidatedLocale = (event: H3Event): 'de' | 'en' => {
  const query = getQuery(event);
  const locale = query.locale as string;
  return (locale === 'en' || locale === 'de') ? locale : 'de';
};

export const getValidatedLimit = (event: H3Event): number | undefined => {
  const query = getQuery(event);
  const limit = query.limit as string;
  if (!limit) return undefined;
  
  const parsed = parseInt(limit, 10);
  return isNaN(parsed) ? undefined : parsed;
};
