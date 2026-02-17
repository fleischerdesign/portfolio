import { documentService } from '~~/server/services/document.service';
import { documentUpdateSchema } from '~~/shared/schemas/document.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  const body = await readValidatedBody(event, documentUpdateSchema.parse);
  
  const updated = await documentService.update(parseInt(id), body);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' });
  }

  return updated;
});
