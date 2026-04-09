import { eq } from "drizzle-orm";
import { contacts } from "~~/server/db/schema";
import type { ContactCreate } from "~~/shared/schemas/contact.schema";
import { createLogger } from "../utils/logger";
import { createEntityService, type EntityDescriptor } from "../utils/db.engine";

const logger = createLogger("contact");

const contactDescriptor: EntityDescriptor<typeof contacts, ContactCreate> = {
  mainTable: contacts,
};

const engine = createEntityService(contactDescriptor);

export const contactService = {
  ...engine,

  async getAll(options: { companyId?: number; limit?: number } = {}) {
    logger.info("getAll", "Fetching all contacts", options);
    return await db.query.contacts.findMany({
      limit: options.limit,
      where: options.companyId
        ? eq(contacts.companyId, options.companyId)
        : undefined,
      with: { company: { columns: { name: true } } },
      orderBy: (contacts, { asc }) => [asc(contacts.name)],
    });
  },

  async getById(id: number) {
    const contact = await db.query.contacts.findFirst({
      where: eq(contacts.id, id),
      with: { company: true },
    });
    if (!contact)
      throw createError({
        statusCode: 404,
        statusMessage: "Contact not found",
      });
    return contact;
  },

  async create(data: ContactCreate) {
    return await db.transaction(async (tx) => {
      return await engine.create(tx, data);
    });
  },

  async update(id: number, data: Partial<ContactCreate>) {
    return await db.transaction(async (tx) => {
      return await engine.update(tx, id, data);
    });
  },

  async delete(id: number) {
    const [deleted] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();
    if (!deleted)
      throw createError({
        statusCode: 404,
        statusMessage: "Contact not found",
      });
    return deleted;
  },
};
