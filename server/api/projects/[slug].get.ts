import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const project = await projectService.getPublicBySlug(slug, locale);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  return {
    project
  };
});