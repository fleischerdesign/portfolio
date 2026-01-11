import { projectService } from '~~/server/services/project.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const project = await projectService.getStudioById(id);

  if (!project) throw createError({ statusCode: 404, statusMessage: 'Project not found' });

  return { project };
});