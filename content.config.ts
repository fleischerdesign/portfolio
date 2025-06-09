import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '**/blog/*.md',
        schema: z.object({
          title: z.string(),
          slug: z.string(),
          date: z.date(),
          description: z.string().optional(),
          tags: z.array(z.string()).optional(),
          category: z.string().optional(),
          published: z.boolean().default(true),
          image: z.object({
            src: z.string(),
            alt: z.string().optional(),
          }).optional(),
          readingTime: z.number().optional(),
          author: z.object({
            name: z.string(),
            avatar: z.string().optional(),
          }),
          draft: z.boolean().default(false),
          locale: z.enum(['de', 'en']),
        }),
      })
    )
  }
})
