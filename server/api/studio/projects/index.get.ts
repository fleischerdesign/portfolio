
import { projects } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

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

  return { projects: allProjects.map(p => ({
      ...p,
      tags: p.tags.map(t => t.tag)
  })) };
});
