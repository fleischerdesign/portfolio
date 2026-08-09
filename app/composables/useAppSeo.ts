import { computed, unref, type MaybeRefOrGetter } from 'vue'

export interface AppSeoOptions {
  title?: string
  ogTitle?: string
  description?: string
  ogDescription?: string
  image?: string
  type?: 'website' | 'article' | 'profile'
  robots?: string
  publishedTime?: string | Date
  modifiedTime?: string | Date
  author?: string
  schemaOrg?: Record<string, unknown> | Array<Record<string, unknown>>
}

/**
 * Standardized, DRY, and SOLID SEO composable for Nuxt.
 * Handles OpenGraph, Twitter Cards, canonical resolution, and Schema.org JSON-LD structured data.
 */
export function useAppSeo(options: MaybeRefOrGetter<AppSeoOptions>) {
  const route = useRoute()
  const { locale } = useI18n()
  const siteUrl = 'https://fleischer.design'

  const resolved = computed(() => {
    const raw = typeof options === 'function' ? options() : unref(options)
    return raw || {}
  })

  const title = computed(() => resolved.value.title || 'Philipp Fleischer')
  const ogTitle = computed(() => resolved.value.ogTitle || title.value)
  const description = computed(() => resolved.value.description || '')
  const ogDescription = computed(() => resolved.value.ogDescription || description.value)
  const type = computed(() => resolved.value.type || 'website')
  const robots = computed(() => resolved.value.robots || 'index, follow')
  const absoluteUrl = computed(() => `${siteUrl}${route.fullPath}`)

  const absoluteImage = computed(() => {
    if (!resolved.value.image) {
      return `${siteUrl}/favicon.png`
    }
    return resolved.value.image.startsWith('http')
      ? resolved.value.image
      : `${siteUrl}${resolved.value.image.startsWith('/') ? '' : '/'}${resolved.value.image}`
  })

  useSeoMeta({
    title,
    ogTitle,
    description,
    ogDescription,
    ogUrl: absoluteUrl,
    ogType: type,
    ogLocale: locale.value,
    ogImage: absoluteImage,
    twitterTitle: ogTitle,
    twitterDescription: ogDescription,
    twitterImage: absoluteImage,
    twitterCard: 'summary_large_image',
    robots,
    articlePublishedTime: computed(() => {
      const time = resolved.value.publishedTime
      if (!time) return undefined
      return typeof time === 'string' ? time : time.toISOString()
    }),
    articleModifiedTime: computed(() => {
      const time = resolved.value.modifiedTime
      if (!time) return undefined
      return typeof time === 'string' ? time : time.toISOString()
    }),
    articleAuthor: computed(() => {
      const auth = resolved.value.author
      return auth ? [auth] : undefined
    })
  })

  useHead({
    script: () => {
      const schema = resolved.value.schemaOrg
      if (!schema) return []
      return [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema)
        }
      ]
    }
  })
}
