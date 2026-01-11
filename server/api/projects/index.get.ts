import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  const locale = getValidatedLocale(event);
  const limit = getValidatedLimit(event);

  const projects = await projectService.getPublicAll(locale, limit);

  return {
    projects
  };
});