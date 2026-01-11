import { nowService } from '~~/server/services/now.service';

export default cachedEventHandler(async (event) => {
  const { locale } = await getPublicQuery(event);

  try {
    return await nowService.getLatest(locale);
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

