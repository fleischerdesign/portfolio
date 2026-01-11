import { writeFile, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';

export const mediaService = {
  async saveFile(file: any, type: string = 'images') {
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
  }
};
