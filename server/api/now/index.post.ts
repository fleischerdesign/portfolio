export default defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')
  if (token !== process.env.NOW_API_TOKEN) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body' })
  }

  if (typeof body.de !== 'string' || typeof body.en !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Missing de/en translations' })
  }

  const newData: Record<string, string> = {
    de: body.de,
    en: body.en,
    icon: body.icon,
    updatedAt: new Date().toISOString()
  }

  for (const key of Object.keys(body)) {
    if (!['de', 'en'].includes(key) && typeof body[key] === 'string') {
      newData[key] = body[key]
    }
  }

  try {
    await useStorage('data').setItem('now.json', newData)
    return { success: true, updatedAt: newData.updatedAt }
  } catch (error) {
    console.error('Failed to write now.json:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not write now.json'
    })
  }
})
