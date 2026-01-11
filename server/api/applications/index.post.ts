import { applicationCreateSchema } from '../../../shared/schemas/application.schema';
import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, applicationCreateSchema.parse);

  const result = await applicationService.createOrUpdate(data);

  return { result };
});