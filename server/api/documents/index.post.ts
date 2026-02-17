import { documentService } from '~~/server/services/document.service';
import { mediaService } from '~~/server/services/media.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const formData = await readMultipartFormData(event);
  if (!formData) {
    throw createError({ statusCode: 400, statusMessage: 'No form data provided' });
  }

  const file = formData.find(item => item.name === 'file');
  const name = formData.find(item => item.name === 'name')?.data.toString();
  const isDefault = formData.find(item => item.name === 'isDefault')?.data.toString() === 'true';

  if (!file || !name) {
    throw createError({ statusCode: 400, statusMessage: 'File and name are required' });
  }

  const savedFile = await mediaService.saveFile({
    filename: file.filename,
    data: file.data,
    type: file.type
  }, 'documents');

  return await documentService.create({
    name,
    filename: savedFile.filename,
    fileType: file.type || 'application/pdf',
    fileSize: file.data.length,
    isDefault,
  });
});
