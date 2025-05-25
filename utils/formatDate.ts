export function formatDate(input?: string | Date, locale = 'de-DE') {
  if (!input) return ''
  const date = typeof input === 'string' ? new Date(input) : input
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat(locale, options).format(date)
}