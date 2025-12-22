import fs from 'fs';
import path from 'path'; // Import path module

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  // Use process.cwd() which is reliably /app in the container
  const filePath = path.join(process.cwd(), 'data', 'applications', `${slug}.pdf`);
  console.log(`Reading PDF from: ${filePath}`);

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
