import { documentService } from '~~/server/services/document.service';
import { applicationService } from '~~/server/services/application.service';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const application = await applicationService.getBySlug(slug);
  if (!application) {
    throw createError({ statusCode: 404, statusMessage: 'Application not found' });
  }

  const { documentIds } = await readValidatedBody(event, z.object({
    documentIds: z.array(z.number())
  }).parse);
  
  await documentService.syncApplicationDocuments(application.id!, documentIds);

  return {
    success: true,
    message: 'Attachments synced successfully'
  };
});
