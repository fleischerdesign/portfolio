export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const companies = await db.query.companies.findMany({
    limit,
    with: {
      address: true,
      contacts: true,
    },
    orderBy: (companies, { asc }) => [asc(companies.name)],
  });

  return companies;
});
