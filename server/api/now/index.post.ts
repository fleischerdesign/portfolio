import { nowEntries } from '../../db/schema'

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')
  const { now: { apiToken } } = useRuntimeConfig()

  if (!apiToken || !token || token !== apiToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  if (typeof body.de !== 'string' || typeof body.en !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing de/en translations' })
  }

  try {
    const result = await db.insert(nowEntries).values({
      contentDe: body.de,
      contentEn: body.en,
      icon: body.icon
    }).returning()

    return { success: true, updatedAt: result[0].createdAt }
  } catch (error) {
    console.error('Failed to create now entry:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create entry'
    })
  }
})

