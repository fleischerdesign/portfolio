import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { ProjectResponse, ProjectUpdate, ProjectCreate } from '~~/shared/schemas/project.schema';
import { slugify } from '~~/shared/utils/slugify';
import { resolveEntityReference, syncManyToMany } from '../utils/relation';

// --- Internal Helpers ---

const mapProject = (project: any, translation?: any): ProjectResponse => ({
  ...project,
  ...(translation || {}),
  id: project.id,
  tags: project.tags?.map((t: any) => t.tag) || [],
  techstack: project.techstack?.map((t: any) => t.technology) || [],
  author: project.author || null,
  category: project.category || null,
});

export const projectService = {
  // Public Methods
  async getPublicAll(locale: AppLocale, limit?: number): Promise<ProjectResponse[]> {
    const allProjects = await db.query.projects.findMany({
      where: (p, { eq }) => eq(p.status, 'published'),
      limit,
      with: {
        translations: { where: (trans, { eq }) => eq(trans.locale, locale) },
        category: true,
        tags: { with: { tag: true } },
        techstack: { with: { technology: true } },
        author: true
      },
      orderBy: [desc(projects.publishedAt)]
    });

    return allProjects
      .map(p => p.translations[0] ? mapProject(p, p.translations[0]) : null)
      .filter((p): p is ProjectResponse => p !== null);
  },

  async getPublicBySlug(slug: string, locale: AppLocale): Promise<ProjectResponse | null> {
    const translation = await db.query.projectTranslations.findFirst({
      where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
      with: {
        project: {
          with: {
            category: true,
            tags: { with: { tag: true } },
            techstack: { with: { technology: true } },
            author: true
          }
        }
      }
    });
  
    if (!translation?.project || translation.project.status !== 'published') return null;
  
    return mapProject(translation.project, translation);
  },

  // Studio Methods
  async getStudioAll(limit?: number) {
    const allProjects = await db.query.projects.findMany({
      limit,
      with: {
        translations: true,
        category: true,
        author: true,
        tags: { with: { tag: true } }
      },
      orderBy: [desc(projects.createdAt)]
    });
  
    return allProjects.map(p => ({
        ...p,
        tags: p.tags.map(t => t.tag)
    }));
  },

  async getStudioById(id: number) {
    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        translations: true,
        category: true,
        tags: { with: { tag: true } },
        techstack: { with: { technology: true } },
        author: true
      }
    });
  
    if (!project) return null;
  
    return {
      ...project,
      tags: project.tags.map(t => t.tag),
      techstack: project.techstack.map(t => t.technology)
    };
  },

  async create(data: ProjectCreate, authorId?: number) {
    return await db.transaction(async (tx) => {
      // Resolve Category
      let categoryId = data.categoryId;
      if (data.categoryName) {
         categoryId = await resolveEntityReference(tx, categories, categories.slug, slugify(data.categoryName), { name: data.categoryName }) || undefined;
      }
  
      const { 
        categoryName, tags: tagNames, techstack: techNames,
        locale, slug, title, subtitle, body, features, learned, challenges,
        translationKey,
        ...entityData
      } = data;
  
      let project = await tx.query.projects.findFirst({ 
        where: eq(projects.translationKey, translationKey) 
      });
  
      if (!project) {
        [project] = await tx.insert(projects).values({
          translationKey,
          ...entityData,
          publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : null,
          categoryId,
          authorId
        }).returning();
      } else {
        await tx.update(projects).set({
          ...entityData,
          publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : project.publishedAt,
          categoryId: categoryId || project.categoryId,
        }).where(eq(projects.id, project.id));
      }
  
      await tx.insert(projectTranslations).values({
        projectId: project!.id,
        locale, slug, title, subtitle, body, features, learned, challenges
      }).onConflictDoUpdate({
        target: [projectTranslations.projectId, projectTranslations.locale],
        set: { slug, title, subtitle, body, features, learned, challenges, updatedAt: new Date() }
      });
  
      // Sync Tags
      if (tagNames) {
        const tagIds: number[] = [];
        for (const name of tagNames) {
           const id = await resolveEntityReference(tx, tags, tags.slug, slugify(name), { name });
           if (id) tagIds.push(id);
        }
        await syncManyToMany(tx, projectsToTags, projectsToTags.projectId, project!.id, projectsToTags.tagId, tagIds);
      }

      // Sync Techstack
      if (techNames) {
        const techIds: number[] = [];
        for (const name of techNames) {
           const id = await resolveEntityReference(tx, technologies, technologies.slug, slugify(name), { name });
           if (id) techIds.push(id);
        }
        await syncManyToMany(tx, projectsToTechnologies, projectsToTechnologies.projectId, project!.id, projectsToTechnologies.technologyId, techIds);
      }
  
      return project;
    });
  },

  async update(id: number, data: ProjectUpdate) {
    return await db.transaction(async (tx) => {
      // Resolve Category
      let categoryId = data.categoryId;
      if (data.categoryName) {
         categoryId = await resolveEntityReference(tx, categories, categories.slug, slugify(data.categoryName), { name: data.categoryName }) || undefined;
      }
  
      const { 
        categoryName, tags: tagNames, techstack: techNames,
        locale, slug, title, subtitle, body, features, learned, challenges,
        translationKey,
        ...entityData
      } = data;
  
      await tx.update(projects).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : undefined,
        categoryId,
      }).where(eq(projects.id, id));
  
      if (locale && slug && title && body) {
          await tx.insert(projectTranslations).values({
              projectId: id, locale, slug, title, subtitle, body, features, learned, challenges
          }).onConflictDoUpdate({
              target: [projectTranslations.projectId, projectTranslations.locale],
              set: { slug, title, subtitle, body, features, learned, challenges, updatedAt: new Date() }
          });
      }
  
      // Sync Tags
      if (tagNames) {
        const tagIds: number[] = [];
        for (const name of tagNames) {
           const id = await resolveEntityReference(tx, tags, tags.slug, slugify(name), { name });
           if (id) tagIds.push(id);
        }
        await syncManyToMany(tx, projectsToTags, projectsToTags.projectId, id, projectsToTags.tagId, tagIds);
      }

      // Sync Techstack
      if (techNames) {
        const techIds: number[] = [];
        for (const name of techNames) {
           const id = await resolveEntityReference(tx, technologies, technologies.slug, slugify(name), { name });
           if (id) techIds.push(id);
        }
        await syncManyToMany(tx, projectsToTechnologies, projectsToTechnologies.projectId, id, projectsToTechnologies.technologyId, techIds);
      }
  
      return await tx.query.projects.findFirst({ where: eq(projects.id, id) });
    });
  }
};