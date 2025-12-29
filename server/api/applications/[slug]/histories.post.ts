import { db } from '~~/server/utils/db';
import { applicationHistories, applications } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { applicationHistoryCreateSchema } from '~~/shared/schemas/application.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' });
  }

  const body = await readValidatedBody(event, (body) => applicationHistoryCreateSchema.safeParse(body));
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const application = await db.query.applications.findFirst({
    where: eq(applications.slug, slug),
    columns: {
      id: true,
    },
  });

  if (!application) {
    throw createError({ statusCode: 404, statusMessage: 'Application not found' });
  }

  const { status, notes, createdAt } = body.data;

  try {
    const [newHistory] = await db.insert(applicationHistories).values({
      applicationId: application.id,
      status,
      notes,
      ...(createdAt && { createdAt: new Date(createdAt) }),
    }).returning();

    return newHistory;
  } catch (error) {
    console.error('Error adding application history:', error);
    throw createError({ statusCode: 500, statusMessage: 'Could not add application history' });
  }
});
