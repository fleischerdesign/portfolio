import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import type { ProjectResponse, ProjectUpdate, ProjectCreate } from '~~/shared/schemas/project.schema';

export const projectService = {
  // Public Methods
  async getPublicAll(locale: 'de' | 'en', limit?: number): Promise<ProjectResponse[]> {
    const allProjects = await db.query.projects.findMany({
      where: (p, { eq }) => eq(p.status, 'published'),
      limit,
      with: {
        translations: {
          where: (trans, { eq }) => eq(trans.locale, locale),
        },
        category: true,
        tags: {
          with: { tag: true }
        },
        techstack: {
          with: { technology: true }
        },
        author: true
      },
      orderBy: [desc(projects.publishedAt)]
    });

    return allProjects.map(project => {
      const translation = project.translations[0];
      if (!translation) return null;

      return {
        ...project,
        ...translation,
        id: project.id,
        tags: project.tags.map(t => t.tag),
        techstack: project.techstack.map(t => t.technology),
        author: project.author || null,
        category: project.category || null,
      } as ProjectResponse;
    }).filter((p): p is ProjectResponse => p !== null);
  },

  async getPublicBySlug(slug: string, locale: 'de' | 'en'): Promise<ProjectResponse | null> {
    const translation = await db.query.projectTranslations.findFirst({
      where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
      with: {
        project: {
          with: {
            category: true,
            tags: {
              with: { tag: true }
            },
            techstack: {
              with: { technology: true }
            },
            author: true
          }
        }
      }
    });
  
    if (!translation || !translation.project) return null;
  
    const { project } = translation;
  
    if (project.status !== 'published') return null;
  
    return {
      ...project,
      ...translation,
      id: project.id,
      tags: project.tags.map(t => t.tag),
      techstack: project.techstack.map(t => t.technology),
      author: project.author || null,
      category: project.category || null,
    } as ProjectResponse;
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
      let categoryId = data.categoryId;
      if (!categoryId && data.categoryName) {
        const slug = data.categoryName.toLowerCase().replace(/\s+/g, '-');
        const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
        if (existing) {
          categoryId = existing.id;
        } else {
          const [inserted] = await tx.insert(categories).values({ name: data.categoryName, slug }).returning();
          categoryId = inserted!.id;
        }
      }
  
      const { 
        categoryName, tags: tagNames, techstack: techNames,
        locale, slug, title, subtitle, body: contentBody, features, learned, challenges,
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
        locale,
        slug,
        title,
        subtitle,
        body: contentBody,
        features,
        learned,
        challenges
      }).onConflictDoUpdate({
        target: [projectTranslations.projectId, projectTranslations.locale],
        set: {
          slug,
          title,
          subtitle,
          body: contentBody,
          features,
          learned,
          challenges,
          updatedAt: new Date()
        }
      });
  
      if (tagNames) {
        await tx.delete(projectsToTags).where(eq(projectsToTags.projectId, project!.id));
        for (const tagName of tagNames) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
          if (!tag) {
            [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
          }
          await tx.insert(projectsToTags).values({ projectId: project!.id, tagId: tag!.id }).onConflictDoNothing();
        }
      }
  
      if (techNames) {
        await tx.delete(projectsToTechnologies).where(eq(projectsToTechnologies.projectId, project!.id));
        for (const techName of techNames) {
          const techSlug = techName.toLowerCase().replace(/\s+/g, '-');
          let tech = await tx.query.technologies.findFirst({ where: eq(technologies.slug, techSlug) });
          if (!tech) {
            [tech] = await tx.insert(technologies).values({ name: techName, slug: techSlug }).returning();
          }
          await tx.insert(projectsToTechnologies).values({ projectId: project!.id, technologyId: tech!.id }).onConflictDoNothing();
        }
      }
  
      return project;
    });
  },

  async update(id: number, data: ProjectUpdate) {
    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (!categoryId && data.categoryName) {
        const slug = data.categoryName.toLowerCase().replace(/\s+/g, '-');
        const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
        if (existing) {
          categoryId = existing.id;
        } else {
          const [inserted] = await tx.insert(categories).values({ name: data.categoryName, slug }).returning();
          categoryId = inserted!.id;
        }
      }
  
      const { 
        categoryName, tags: tagNames, techstack: techNames,
        locale, slug, title, subtitle, body: contentBody, features, learned, challenges,
        translationKey,
        ...entityData
      } = data;
  
      await tx.update(projects).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : undefined,
        categoryId: categoryId,
      }).where(eq(projects.id, id));
  
      if (locale && slug && title && contentBody) {
          await tx.insert(projectTranslations).values({
              projectId: id,
              locale: locale!,
              slug: slug!,
              title: title!,
              subtitle,
              body: contentBody!,
              features,
              learned,
              challenges
          }).onConflictDoUpdate({
              target: [projectTranslations.projectId, projectTranslations.locale],
              set: {
                  slug,
                  title,
                  subtitle,
                  body: contentBody,
                  features,
                  learned,
                  challenges,
                  updatedAt: new Date()
              }
          });
      }
  
      if (tagNames) {
        await tx.delete(projectsToTags).where(eq(projectsToTags.projectId, id));
        for (const tagName of tagNames) {
          const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
          let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
          if (!tag) {
            [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
          }
          await tx.insert(projectsToTags).values({ projectId: id, tagId: tag!.id }).onConflictDoNothing();
        }
      }
  
      if (techNames) {
        await tx.delete(projectsToTechnologies).where(eq(projectsToTechnologies.projectId, id));
        for (const techName of techNames) {
          const techSlug = techName.toLowerCase().replace(/\s+/g, '-');
          let tech = await tx.query.technologies.findFirst({ where: eq(technologies.slug, techSlug) });
          if (!tech) {
            [tech] = await tx.insert(technologies).values({ name: techName, slug: techSlug }).returning();
          }
          await tx.insert(projectsToTechnologies).values({ projectId: id, technologyId: tech!.id }).onConflictDoNothing();
        }
      }
  
      return await tx.query.projects.findFirst({ where: eq(projects.id, id) });
    });
  }
};