import { applicationCreateSchema } from '../../../shared/schemas/application.schema';
import type { ApplicationCreatePayload } from '../../../shared/schemas/application.schema';
import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readBody(event);
  const validation = applicationCreateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: ApplicationCreatePayload = validation.data;

  const result = await applicationService.createOrUpdate(data);

  return { result };
});