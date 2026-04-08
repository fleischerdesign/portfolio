import { eq } from "drizzle-orm";
import { contacts } from "~~/server/db/schema";
import type { ContactCreate } from "~~/shared/schemas/contact.schema";
import { createLogger } from "../utils/logger";

const logger = createLogger("contact");

export const contactService = {
  async getAll(options: { companyId?: number; limit?: number } = {}) {
    logger.info("getAll", "Fetching all contacts", options);

    const result = await db.query.contacts.findMany({
      limit: options.limit,
      where: options.companyId
        ? eq(contacts.companyId, options.companyId)
        : undefined,
      with: {
        company: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: (contacts, { asc }) => [asc(contacts.name)],
    });

    logger.info("getAll", `Found ${result.length} contacts`);
    return result;
  },

  async getById(id: number) {
    logger.info("getById", `Fetching contact with id: ${id}`);

    const contact = await db.query.contacts.findFirst({
      where: eq(contacts.id, id),
      with: {
        company: true,
      },
    });

    if (!contact) {
      logger.warn("getById", `Contact not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Contact not found",
      });
    }

    logger.info("getById", `Found contact: ${id}`);
    return contact;
  },

  async create(data: ContactCreate) {
    logger.info("create", "Creating new contact");

    const [newContact] = await db.insert(contacts).values(data).returning();

    logger.info("create", `Created contact with id: ${newContact?.id}`);
    return newContact;
  },

  async delete(id: number) {
    logger.info("delete", `Deleting contact with id: ${id}`);

    const [deleted] = await db
      .delete(contacts)
      .where(eq(contacts.id, id))
      .returning();

    if (!deleted) {
      logger.warn("delete", `Contact not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Contact not found",
      });
    }

    logger.info("delete", `Deleted contact: ${id}`);
    return deleted;
  },
};
