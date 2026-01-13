import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db } from '~~/server/utils/db'
import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema'
import { sql } from 'drizzle-orm'

// Stub global 'db'
vi.stubGlobal('db', db)

import { projectService } from '~~/server/services/project.service'

describe('ProjectService', () => {
  beforeEach(async () => {
    // Clean up database before each test in correct order (child -> parent)
    await db.delete(projectsToTags)
    await db.delete(projectsToTechnologies)
    await db.delete(projectTranslations)
    await db.delete(projects)
    await db.delete(categories)
    await db.delete(tags)
    await db.delete(technologies)
  })

  it('should create a project with translations, tags and techstack', async () => {
    const projectData = {
      translationKey: 'test-project',
      locale: 'en' as const,
      slug: 'test-project-slug',
      title: 'Test Project',
      subtitle: 'A test subtitle',
      body: 'Test body content',
      status: 'published' as const,
      categoryName: 'Testing',
      tags: ['tag1', 'tag2'],
      techstack: ['Vitest', 'Nuxt'],
      publishedAt: new Date(),
      coverImage: null,
      coverImageAlt: null,
      repoUrl: null,
      projectUrl: null,
      icon: null,
      features: [],
      learned: [],
      challenges: []
    }

    const result = await projectService.create(projectData as any)

    expect(result).toBeDefined()
    expect(result?.translationKey).toBe('test-project')

    // Verify relations
    const publicProjects = await projectService.getPublicAll('en')
    expect(publicProjects.length).toBe(1)
    expect(publicProjects[0]!.title).toBe('Test Project')
    expect(publicProjects[0]!.category?.name).toBe('Testing')
    expect(publicProjects[0]!.tags.map(t => t.name)).toContain('tag1')
    expect(publicProjects[0]!.techstack.map(t => t.name)).toContain('Vitest')
  })

  it('should update an existing project translation', async () => {
     // 1. Create initial
     const initial = await projectService.create({
        translationKey: 'update-test',
        locale: 'en',
        slug: 'initial-slug',
        title: 'Initial Title',
        body: 'Initial body',
        status: 'published',
        subtitle: null,
        tags: [],
        techstack: [],
        coverImage: null,
        coverImageAlt: null,
        repoUrl: null,
        projectUrl: null,
        icon: null,
        features: [],
        learned: [],
        challenges: []
     } as any)

     // 2. Update same translation
     await projectService.update(initial!.id, {
        locale: 'en',
        slug: 'updated-slug',
        title: 'Updated Title',
        body: 'Updated body'
     })

     const updated = await projectService.getPublicBySlug('updated-slug', 'en')
     expect(updated).toBeDefined()
     expect(updated?.title).toBe('Updated Title')
     expect(updated?.slug).toBe('updated-slug')
  })

  it('should return null for non-existent project', async () => {
    const result = await projectService.getPublicBySlug('fantasy-slug', 'en')
    expect(result).toBeNull()
  })

  it('should not return draft projects via public API', async () => {
    await projectService.create({
      translationKey: 'draft-project',
      locale: 'en',
      slug: 'draft-slug',
      title: 'Draft Title',
      body: 'Content',
      status: 'draft',
      subtitle: null,
      tags: [],
      techstack: [],
      coverImage: null,
      coverImageAlt: null,
      repoUrl: null,
      projectUrl: null,
      icon: null,
      features: [],
      learned: [],
      challenges: []
    } as any)

    const result = await projectService.getPublicBySlug('draft-slug', 'en')
    expect(result).toBeNull()

    const all = await projectService.getPublicAll('en')
    const found = all.find(p => p.slug === 'draft-slug')
    expect(found).toBeUndefined()
  })
})
