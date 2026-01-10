
import { projects } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

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

  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' });

  const mappedProject = {
    ...project,
    tags: project.tags.map(t => t.tag),
    techstack: project.techstack.map(t => t.technology)
  };

  return { project: mappedProject };
});
