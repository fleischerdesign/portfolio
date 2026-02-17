import { documentService } from '~~/server/services/document.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID is required' });
  }

  const deleted = await documentService.delete(parseInt(id));
  if (!deleted) {
    throw createError({ statusCode: 404, statusMessage: 'Document not found' });
  }

  return {
    success: true,
    message: 'Document deleted successfully',
  };
});
