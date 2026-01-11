
import { createReadStream, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineEventHandler, createError, setResponseHeader } from 'h3';

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path;
  
  if (!path) {
    throw createError({ statusCode: 400, statusMessage: 'Path is required' });
  }

  // Resolve the file path within the .data/uploads directory
  const baseDir = resolve(process.cwd(), '.data/uploads');
  const filePath = join(baseDir, path);

  // Security check: ensure the resolved path is still within the base directory
  if (!filePath.startsWith(baseDir)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  if (!existsSync(filePath)) {
    throw createError({ statusCode: 404, statusMessage: 'File not found' });
  }

  // Simple mime map
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf'
  };

  const contentType = mimeTypes[extension] || 'application/octet-stream';
  
  setResponseHeader(event, 'Content-Type', contentType);
  setResponseHeader(event, 'Cache-Control', 'public, max-age=86400');

  return createReadStream(filePath);
});
