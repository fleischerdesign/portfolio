import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db } from '~~/server/utils/db'
import { blogPosts, blogPostTranslations, categories, tags, blogPostsToTags } from '~~/server/db/schema'

// Stub global 'db'
vi.stubGlobal('db', db)

import { blogService } from '~~/server/services/blog.service'

describe('BlogService', () => {
  beforeEach(async () => {
    // Clean up database (Child -> Parent)
    await db.delete(blogPostsToTags)
    await db.delete(blogPostTranslations)
    await db.delete(blogPosts)
    await db.delete(categories)
    await db.delete(tags)
  })

  it('should create a blog post with translations and tags', async () => {
    const postData = {
      translationKey: 'test-post',
      locale: 'en' as const,
      slug: 'test-post-slug',
      title: 'Test Blog Post',
      excerpt: 'A short summary',
      body: '# Markdown Content',
      readingTime: 5,
      status: 'published' as const,
      categoryName: 'Tech',
      tags: ['Nuxt', 'Testing'],
      publishedAt: new Date(),
      coverImage: null,
      coverImageAlt: null,
    }

    const result = await blogService.create(postData as any)

    expect(result).toBeDefined()
    expect(result?.translationKey).toBe('test-post')

    // Verify Public API
    const publicPosts = await blogService.getPublicAll('en')
    expect(publicPosts.length).toBe(1)
    
    const post = publicPosts[0]!
    expect(post.title).toBe('Test Blog Post')
    expect(post.category?.name).toBe('Tech')
    expect(post.tags.map(t => t.name)).toContain('Nuxt')
    expect(post.tags.map(t => t.name)).toContain('Testing')
  })

  it('should update a blog post translation and sync tags', async () => {
    // 1. Create
    const created = await blogService.create({
      translationKey: 'update-post',
      locale: 'en',
      slug: 'original-slug',
      title: 'Original Title',
      body: 'Original Body',
      tags: ['OldTag'],
      status: 'published',
      coverImage: null,
      coverImageAlt: null,
      excerpt: null,
      readingTime: null
    } as any)

    // 2. Update
    await blogService.update(created!.id, {
      locale: 'en',
      slug: 'updated-slug',
      title: 'Updated Title',
      body: 'Updated Body',
      tags: ['NewTag'] // Should replace OldTag
    })

    // 3. Verify
    const updated = await blogService.getPublicBySlug('updated-slug', 'en')
    expect(updated).toBeDefined()
    expect(updated?.title).toBe('Updated Title')
    
    // Check Tags Sync
    expect(updated?.tags.length).toBe(1)
    expect(updated?.tags[0]!.name).toBe('NewTag')
  })

  it('should return null for invalid slug', async () => {
    const result = await blogService.getPublicBySlug('does-not-exist', 'en')
    expect(result).toBeNull()
  })

  it('should filter out draft posts in public list', async () => {
    await blogService.create({
      translationKey: 'draft-post',
      locale: 'en',
      slug: 'draft-post',
      title: 'Draft',
      body: '...',
      status: 'draft',
      tags: [],
      coverImage: null,
      coverImageAlt: null,
      excerpt: null,
      readingTime: null
    } as any)

    const all = await blogService.getPublicAll('en')
    expect(all.find(p => p.slug === 'draft-post')).toBeUndefined()
  })
})
