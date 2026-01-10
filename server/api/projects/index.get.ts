
import { projects } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';
import { ProjectResponse } from '~~/shared/schemas/project.schema';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

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

  const mappedProjects: ProjectResponse[] = allProjects.map(project => {
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

  return {
    projects: mappedProjects
  };
});
