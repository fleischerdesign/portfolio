export default cachedEventHandler(async (event) => {
  const query = getQuery(event)
  const langParam = Array.isArray(query.lang) 
    ? query.lang[0] 
    : query.lang
  
  const lang = (
    (typeof langParam === 'string' ? langParam : '') 
    || getHeader(event, 'Accept-Language')?.split(',')[0]?.slice(0, 2) 
    || 'de'
  ) as string

  const data = await useStorage('data').getItem<Record<string, string>>('now.json')

  if (!data) {
    return { status: 'No status set!', updatedAt: null , icon: 'mage:zap'}
  }

  try {
    return {
      status: data[lang] || data.de,
      icon: data.icon || 'info',
      updatedAt: data.updatedAt
    }
  } catch (error) {
    console.error('Failed to read or parse now.json:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not read or parse now.json',
    })
  }
}, {
  maxAge: 1 * 60
})
