import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const projects = await projectService.getStudioAll(limit);

  return { projects };
});