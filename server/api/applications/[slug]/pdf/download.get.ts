import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.resolve(__dirname, `../../data/applications/${slug}.pdf`);
  console.log(filePath)

  if (!fs.existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF not found.',
    });
  }

  const pdfBuffer = fs.readFileSync(filePath);

  // Set headers to prompt download
  event.node.res.setHeader('Content-Type', 'application/pdf');
  event.node.res.setHeader('Content-Disposition', `attachment; filename="${slug}.pdf"`);

  return pdfBuffer;
});
