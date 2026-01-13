import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import type { ProjectResponse, ProjectUpdate, ProjectCreate } from '~~/shared/schemas/project.schema';
import { slugify } from '~~/shared/utils/slugify';

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

async function ensureCategory(tx: any, categoryId?: number | null, categoryName?: string | null) {
  if (categoryId) return categoryId;
  if (!categoryName) return null;

  const slug = slugify(categoryName);
  const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
  if (existing) return existing.id;

  const [inserted] = await tx.insert(categories).values({ name: categoryName, slug }).returning();
  return inserted.id;
}

async function syncTags(tx: any, projectId: number, tagNames: string[]) {
  await tx.delete(projectsToTags).where(eq(projectsToTags.projectId, projectId));
  for (const name of tagNames) {
    const slug = slugify(name);
    let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, slug) });
    if (!tag) {
      [tag] = await tx.insert(tags).values({ name, slug }).returning();
    }
    await tx.insert(projectsToTags).values({ projectId, tagId: tag.id }).onConflictDoNothing();
  }
}

async function syncTechstack(tx: any, projectId: number, techNames: string[]) {
  await tx.delete(projectsToTechnologies).where(eq(projectsToTechnologies.projectId, projectId));
  for (const name of techNames) {
    const slug = slugify(name);
    let tech = await tx.query.technologies.findFirst({ where: eq(technologies.slug, slug) });
    if (!tech) {
      [tech] = await tx.insert(technologies).values({ name, slug }).returning();
    }
    await tx.insert(projectsToTechnologies).values({ projectId, technologyId: tech.id }).onConflictDoNothing();
  }
}

export const projectService = {
  // Public Methods
  async getPublicAll(locale: 'de' | 'en', limit?: number): Promise<ProjectResponse[]> {
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

  async getPublicBySlug(slug: string, locale: 'de' | 'en'): Promise<ProjectResponse | null> {
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
      const categoryId = await ensureCategory(tx, data.categoryId, data.categoryName);
  
      const { 
        categoryName, tags, techstack,
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
  
      if (tags) await syncTags(tx, project!.id, tags);
      if (techstack) await syncTechstack(tx, project!.id, techstack);
  
      return project;
    });
  },

  async update(id: number, data: ProjectUpdate) {
    return await db.transaction(async (tx) => {
      const categoryId = await ensureCategory(tx, data.categoryId, data.categoryName);
  
      const { 
        categoryName, tags, techstack,
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
  
      if (tags) await syncTags(tx, id, tags);
      if (techstack) await syncTechstack(tx, id, techstack);
  
      return await tx.query.projects.findFirst({ where: eq(projects.id, id) });
    });
  }
};