
import { projects } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const allProjects = await db.query.projects.findMany({
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
