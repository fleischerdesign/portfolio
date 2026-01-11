import { eq } from 'drizzle-orm';
import { getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const query = getQuery(event);
  const companyId = query.companyId ? Number(query.companyId) : undefined;
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const contacts = await db.query.contacts.findMany({
    limit,
    where: companyId ? eq(db.contacts.companyId, companyId) : undefined,
    with: {
      company: {
        columns: {
          name: true,
        },
      },
    },
    orderBy: (contacts, { asc }) => [asc(contacts.name)],
  });

  return contacts;
});
