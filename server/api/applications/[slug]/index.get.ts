import { applicationHistories, applications } from '~~/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { ApplicationResponsePayload } from '~~/shared/schemas/application.schema';

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
      contacts: {
        with: {
          contact: true,
        },
      },
      interviews: true,
      histories: {
        orderBy: [desc(applicationHistories.createdAt), desc(applicationHistories.id)],
      },
    },
  });

  if (!application) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Application not found',
    });
  }

  const currentStatus = application.histories.length > 0 ? application.histories[0]!.status : 'draft';
  const associatedContacts = application.contacts.map(appToContact => appToContact.contact);

  const response: ApplicationResponsePayload = {
    ...application,
    currentStatus,
    company: {
        ...application.company,
        address: application.company.address || null,
    },
    contacts: associatedContacts,
    histories: application.histories,
  };

  return response;
});