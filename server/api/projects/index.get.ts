import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  const { locale, limit } = await getPublicQuery(event);

  const projects = await projectService.getPublicAll(locale, limit);

  return {
    projects
  };
});