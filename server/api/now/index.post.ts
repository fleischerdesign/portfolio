import { nowService } from '~~/server/services/now.service';

export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')
  const { now: { apiToken } } = useRuntimeConfig()

  if (!apiToken || !token || token !== apiToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object' || typeof body.de !== 'string' || typeof body.en !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  try {
    return await nowService.create(body);
  } catch (error) {
    console.error('Failed to create now entry:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not create entry'
    })
  }
})

