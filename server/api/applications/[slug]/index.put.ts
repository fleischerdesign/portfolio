import { eq } from 'drizzle-orm';
import { applications } from '~~/server/db/schema';
import { applicationUpdateSchema } from '#shared/schemas/application.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const body = await readValidatedBody(event, (body) => applicationUpdateSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const updateData = body.data;

  if (Object.keys(updateData).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields provided for update' });
  }

  try {
    const [updatedApplication] = await db.update(applications)
      .set(updateData)
      .where(eq(applications.slug, slug))
      .returning();

    if (!updatedApplication) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' });
    }

    const fullUpdatedApplication = await db.query.applications.findFirst({
      where: eq(applications.id, updatedApplication.id),
      with: {
        company: true,
      },
    });

    return fullUpdatedApplication;
  } catch (error) {
    console.error('Error updating application:', error);
    if (typeof error === 'object' && error !== null && 'statusCode' in error) {
      throw error;
    }
    throw createError({ statusCode: 500, statusMessage: 'Could not update application' });
  }
});
