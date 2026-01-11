import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = (query.locale as 'de' | 'en') || 'de';
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const projects = await projectService.getPublicAll(locale, limit);

  return {
    projects
  };
});