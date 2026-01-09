import { desc } from 'drizzle-orm'
import { nowEntries } from '../../db/schema'

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

  try {
    const [latestEntry] = await db.select().from(nowEntries).orderBy(desc(nowEntries.createdAt)).limit(1)

    if (!latestEntry) {
      return { status: 'No status set!', updatedAt: null , icon: 'mage:zap'}
    }

    return {
      status: lang === 'de' ? latestEntry.contentDe : latestEntry.contentEn,
      icon: latestEntry.icon || 'info',
      updatedAt: latestEntry.createdAt
    }
  } catch (error) {
    console.error('Failed to fetch now status:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not fetch status',
    })
  }
}, {
  maxAge: 1 * 60,
  name: 'now-status'
})

