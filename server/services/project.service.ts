import { projects, projectTranslations } from '~~/server/db/schema';
import { desc, eq, and } from 'drizzle-orm';
import { ProjectResponse, ProjectDetailResponse } from '~~/shared/schemas/project.schema';

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
      };
    }).filter((p): p is ProjectResponse => p !== null);
  },

  async getPublicBySlug(slug: string, locale: 'de' | 'en'): Promise<ProjectDetailResponse | null> {
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
    };
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
  }
};
