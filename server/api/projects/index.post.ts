
import { projectService } from '~~/server/services/project.service';
import { projectCreateSchema } from '~~/shared/schemas/project.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, projectCreateSchema.parse);

  const result = await projectService.create(data, event.context.user?.id);

  return { result };
});
