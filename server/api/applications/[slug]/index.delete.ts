import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { applications } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  try {
    // Delete the database entry
    const deletedApplications = await db.delete(applications).where(eq(applications.slug, slug)).returning();

    if (deletedApplications.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Application not found',
      });
    }

    // Delete the associated PDF file, if it exists
    const pdfPath = path.join(process.cwd(), 'data', 'applications', `${slug}.pdf`);
    if (fs.existsSync(pdfPath)) {
      fs.unlinkSync(pdfPath);
    }

    return new Response(null, { status: 204, statusText: 'No Content' });
  } catch (error) {
    console.error('Error deleting application:', error);
    // Forward potential errors from the DB delete (like not found)
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Error deleting application',
    });
  }
});
