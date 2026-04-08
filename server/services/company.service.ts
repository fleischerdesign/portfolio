import { companies, addresses } from "~~/server/db/schema";
import type { CompanyCreate, Address } from "~~/shared/schemas/company.schema";
import { eq } from "drizzle-orm";
import { createLogger } from "../utils/logger";

const logger = createLogger("company");

export const companyService = {
  async getAll(limit?: number) {
    logger.info("getAll", "Fetching all companies", { limit });

    const result = await db.query.companies.findMany({
      limit,
      with: {
        address: true,
        contacts: true,
      },
      orderBy: (companies, { asc }) => [asc(companies.name)],
    });

    logger.info("getAll", `Found ${result.length} companies`);
    return result;
  },

  async getById(id: number) {
    logger.info("getById", `Fetching company with id: ${id}`);

    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
      with: {
        address: true,
        contacts: true,
      },
    });

    if (!company) {
      logger.warn("getById", `Company not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Company not found",
      });
    }

    logger.info("getById", `Found company: ${id}`);
    return company;
  },

  async create(data: CompanyCreate) {
    logger.info("create", "Creating new company");

    const { address, ...companyData } = data;

    const result = await db.transaction(async (tx) => {
      let addressId: number | undefined;

      if (address) {
        const [newAddress] = await tx
          .insert(addresses)
          .values(address)
          .returning();
        addressId = newAddress?.id;
      }

      const [newCompany] = await tx
        .insert(companies)
        .values({ ...companyData, addressId })
        .returning();

      logger.info("create", `Created company with id: ${newCompany?.id}`);
      return newCompany;
    });

    return result;
  },

  async updateAddress(companyId: number, addressData: Partial<Address>) {
    logger.info("updateAddress", `Updating address for company: ${companyId}`);

    return await db.transaction(async (tx) => {
      const company = await tx.query.companies.findFirst({
        where: eq(companies.id, companyId),
      });

      if (!company) {
        logger.warn("updateAddress", `Company not found: ${companyId}`);
        throw createError({
          statusCode: 404,
          statusMessage: "Company not found",
        });
      }

      if (company.addressId) {
        await tx
          .update(addresses)
          .set(addressData)
          .where(eq(addresses.id, company.addressId));
      } else {
        const [newAddress] = await tx
          .insert(addresses)
          .values(addressData)
          .returning();
        if (newAddress) {
          await tx
            .update(companies)
            .set({ addressId: newAddress.id })
            .where(eq(companies.id, companyId));
        }
      }

      logger.info("updateAddress", `Updated address for company: ${companyId}`);

      return tx.query.companies.findFirst({
        where: eq(companies.id, companyId),
        with: {
          address: true,
        },
      });
    });
  },
};
