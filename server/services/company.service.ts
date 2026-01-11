import { companies, addresses } from '~~/server/db/schema';
import type { CompanyCreate, Address } from '~~/shared/schemas/company.schema';
import { eq } from 'drizzle-orm';

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
  },

  async create(data: CompanyCreate) {
    const { address, ...companyData } = data;
  
    return await db.transaction(async (tx) => {
      let addressId: number | undefined;

      if (address) {
        const [newAddress] = await tx.insert(addresses).values(address).returning();
        addressId = newAddress?.id;
      }

      const [newCompany] = await tx.insert(companies).values({ ...companyData, addressId }).returning();
      return newCompany;
    });
  },

  async updateAddress(companyId: number, addressData: Partial<Address>) {
    return await db.transaction(async (tx) => {
      const company = await tx.query.companies.findFirst({
        where: eq(companies.id, companyId),
      });
  
      if (!company) {
        throw createError({ statusCode: 404, statusMessage: 'Company not found' });
      }
  
      if (company.addressId) {
        // Update existing address
        await tx.update(addresses)
          .set(addressData)
          .where(eq(addresses.id, company.addressId));
      } else {
        // Create new address and link it
        const [newAddress] = await tx.insert(addresses).values(addressData).returning();
        if (newAddress) {
          await tx.update(companies)
            .set({ addressId: newAddress.id })
            .where(eq(companies.id, companyId));
        }
      }
  
      // Return the updated company with its address
      return tx.query.companies.findFirst({
        where: eq(companies.id, companyId),
        with: {
          address: true
        }
      });
    });
  }
};