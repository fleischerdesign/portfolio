import { readFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_PATH = resolve(__dirname, '../now.json')

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

  if (!existsSync(DATA_PATH)) {
    return { status: 'No status set!', updatedAt: null , icon: 'info'}
  }

  try {
    const rawData = readFileSync(DATA_PATH, 'utf-8')
    const data = JSON.parse(rawData) as Record<string, string>
    
    return {
      status: data[lang] || data.de,
      icon: data.icon || 'info',
      updatedAt: data.updatedAt
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Could not read or parse now.json',
    })
  }
}, {
  maxAge: 10 * 60
})
