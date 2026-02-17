import { documentService } from '~~/server/services/document.service';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const { documentIds } = await readValidatedBody(event, z.object({
    documentIds: z.array(z.number())
  }).parse);
  
  await documentService.reorder(documentIds);

  return {
    success: true,
    message: 'Global document order updated successfully'
  };
});
