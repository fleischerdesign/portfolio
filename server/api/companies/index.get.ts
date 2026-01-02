export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const companies = await db.query.companies.findMany({
    with: {
      address: true,
      contacts: true,
    },
    orderBy: (companies, { asc }) => [asc(companies.name)],
  });

  return companies;
});
