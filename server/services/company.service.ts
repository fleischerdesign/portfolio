export const companyService = {
  async getAll(limit?: number) {
    return await db.query.companies.findMany({
      limit,
      with: {
        address: true,
        contacts: true,
      },
      orderBy: (companies, { asc }) => [asc(companies.name)],
    });
  }
};
