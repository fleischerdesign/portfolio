import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const limit = getValidatedLimit(event);

  const projects = await projectService.getStudioAll(limit);

  return { projects };
});