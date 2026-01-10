
import { projectTranslations } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { ProjectDetailResponse } from '~~/shared/schemas/project.schema';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

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

  if (!translation || !translation.project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  const { project } = translation;

  if (project.status !== 'published') {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  const response: ProjectDetailResponse = {
    ...project,
    ...translation,
    id: project.id,
    tags: project.tags.map(t => t.tag),
    techstack: project.techstack.map(t => t.technology),
    author: project.author || null,
    category: project.category || null,
  };

  return {
    project: response
  };
});
