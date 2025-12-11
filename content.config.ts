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
    ),
    projects: defineCollection(
      asSitemapCollection({
        type: 'page',
        source: '**/projects/*.md',
        schema: z.object({
          title: z.string(),
          slug: z.string(),
          date: z.date(),
          subtitle: z.string(),
          tags: z.array(z.string()).optional(),
          techstack: z.array(z.string()).optional(),
          features: z.array(z.string()).optional(),
          learned: z.array(z.string()).optional(),
          challenges: z.array(z.string()).optional(),
          url: z.object({
            project: z.string().optional(),
            repository: z.string().optional(),
          }),
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
    ),
    applications: defineCollection({
      type: 'page',
      source: 'application/*.md',
      schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        slug: z.string(),
        url: z.string(),
        dates: z.object({
          application: z.date().optional(),
          response: z.date().optional(),
          interviews: z.array(z.date()).optional()
        }).optional(),
        status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
        company: z.object({
          name: z.string(),
          address: z.object({
            name: z.string(),
            contact: z.object({
              name: z.string(),
              position: z.string().optional(),
              email: z.string().optional(),
              phone: z.string().optional()
            }).optional(),
            street: z.string(),
            houseNumber: z.string(),
            zipcode: z.number(),
            city: z.string()
          }),
        }),
        notes: z.array(z.string()).optional()
      })
    })
  }
})
