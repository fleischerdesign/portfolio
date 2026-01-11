
import { writeFile, mkdir } from 'node:fs/promises';
import { join, resolve, extname } from 'node:path';
import { defineEventHandler, readMultipartFormData, createError } from 'h3';

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
  const baseDir = resolve(process.cwd(), '.data/uploads', type);
  
  // Ensure directory exists
  await mkdir(baseDir, { recursive: true });

  // Generate unique filename
  const timestamp = Date.now();
  const originalName = file.filename || 'upload.bin';
  const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, '_');
  const filename = `${timestamp}-${cleanName}`;
  const filePath = join(baseDir, filename);

  // Save the file
  await writeFile(filePath, file.data);

  // Return the public URL path
  return {
    url: `/media/${type}/${filename}`,
    filename: filename
  };
});
