
import { defineEventHandler, readMultipartFormData, createError } from 'h3';
import { mediaService } from '~~/server/services/media.service';

export default defineEventHandler(async (event) => {
  // Only admins can upload
  await authorize(event, isAdmin);

  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });
  }

  // We expect a field named 'file'
  const file = formData.find(item => item.name === 'file');
  if (!file || !file.data) {
    throw createError({ statusCode: 400, statusMessage: 'File field is missing' });
  }

  // Basic validation
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (file.type && !allowedMimeTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Only images are allowed.' });
  }

  // Determine subfolder (default to images)
  const type = getQuery(event).type as string || 'images';
  
  return await mediaService.saveFile(file, type);
});
