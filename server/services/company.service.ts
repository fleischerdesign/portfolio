import { companies, addresses } from "~~/server/db/schema";
import type { CompanyCreate, Address } from "~~/shared/schemas/company.schema";
import { eq } from "drizzle-orm";
import { createLogger } from "../utils/logger";
import { createTranslatableService, type TranslatableEntityDescriptor } from "../utils/db.engine";

const logger = createLogger("company");

/**
 * @descriptor companyDescriptor
 * @description Configuration for the company entity.
 */
const companyDescriptor: TranslatableEntityDescriptor = {
  mainTable: companies,
  hooks: {
    beforeCreate: async (tx, data) => {
      let addressId = undefined;
      if (data.address) {
        const [newAddress] = await tx.insert(addresses).values(data.address).returning({ id: addresses.id });
        addressId = newAddress?.id;
      }
      return { ...data, addressId };
    },
    beforeUpdate: async (tx, id, data) => {
      if (data.address) {
        const company = await tx.query.companies.findFirst({ where: eq(companies.id, id) });
        if (company?.addressId) {
          await tx.update(addresses).set(data.address).where(eq(addresses.id, company.addressId));
        } else {
          const [newAddress] = await tx.insert(addresses).values(data.address).returning({ id: addresses.id });
          return { ...data, addressId: newAddress?.id };
        }
      }
      return data;
    }
  }
};

const engine = createTranslatableService<CompanyCreate, CompanyCreate>(companyDescriptor);

/**
 * @service companyService
 * @description Service for managing companies.
 */
export const companyService = {
  ...engine,

  async getAll(limit?: number) {
    logger.info("getAll", "Fetching all companies", { limit });
    return await db.query.companies.findMany({
      limit,
      with: { address: true, contacts: true },
      orderBy: (companies, { asc }) => [asc(companies.name)],
    });
  },

  async getById(id: number) {
    const company = await db.query.companies.findFirst({
      where: eq(companies.id, id),
      with: { address: true, contacts: true },
    });
    if (!company) throw createError({ statusCode: 404, statusMessage: "Company not found" });
    return company;
  },

  async create(data: CompanyCreate) {
    return await db.transaction(async (tx) => {
      return await engine.create(tx, data);
    });
  },

  async update(id: number, data: Partial<CompanyCreate>) {
    return await db.transaction(async (tx) => {
      return await engine.update(tx, id, data);
    });
  }
};
