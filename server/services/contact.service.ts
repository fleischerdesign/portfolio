import { eq } from 'drizzle-orm';
import { contacts } from '~~/server/db/schema';
import type { ContactCreatePayload } from '~~/shared/schemas/contact.schema';

export const contactService = {
  async getAll(options: { companyId?: number; limit?: number } = {}) {
    return await db.query.contacts.findMany({
      limit: options.limit,
      where: options.companyId ? eq(contacts.companyId, options.companyId) : undefined,
      with: {
        company: {
          columns: {
            name: true,
          },
        },
      },
      orderBy: (contacts, { asc }) => [asc(contacts.name)],
    });
  },

  async create(data: ContactCreatePayload) {
    const [newContact] = await db.insert(contacts).values(data).returning();
    return newContact;
  }
};