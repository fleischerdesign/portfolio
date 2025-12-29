import { applications } from '~~/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const application = await db.query.applications.findFirst({
    where: eq(applications.slug, slug),
    with: {
      company: {
        with: {
          address: true,
        },
      },
      interviews: true,
      histories: {
        orderBy: [desc(applications.createdAt)],
      },
    },
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found',
    });
  }

  const currentStatus = application.histories.length > 0 ? application.histories[0].status : 'draft';

  return {
    ...application,
    currentStatus,
    histories: application.histories,
  };
});