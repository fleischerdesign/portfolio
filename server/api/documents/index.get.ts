import { documentService } from '~~/server/services/document.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  return await documentService.getAll();
});
