import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = resolve(__dirname, '../data/now.json')

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
    writeFileSync(DATA_PATH, JSON.stringify(newData, null, 2), 'utf-8')
    return { success: true, updatedAt: newData.updatedAt }
  } catch (error) {
    console.error('Failed to write now.json:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not write now.json'
    })
  }
})
