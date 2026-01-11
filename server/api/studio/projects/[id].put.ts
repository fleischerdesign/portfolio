import { projectService } from '~~/server/services/project.service';
import { projectUpdateSchema } from '~~/shared/schemas/project.schema';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number().int().positive()
  }).parse);

  const data = await readValidatedBody(event, projectUpdateSchema.parse);

  const result = await projectService.update(id, data);

  return { result };
});