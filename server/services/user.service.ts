import { eq, asc } from 'drizzle-orm';
import { users, apiKeys } from '~~/server/db/schema';

export const userService = {
  async getById(userId: number) {
    return await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  },

  async getOwner(ownerEmail?: string) {
    let user;

    if (ownerEmail) {
      user = await db.query.users.findFirst({
        where: eq(users.email, ownerEmail),
      });
    }

    if (!user) {
      user = await db.query.users.findFirst({
        where: eq(users.role, 'admin'),
        orderBy: [asc(users.createdAt)],
      });
    }

    return user;
  },

  async update(userId: number, data: Partial<typeof users.$inferInsert>) {
    const [updatedUser] = await db.update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw createError({ statusCode: 404, statusMessage: 'User not found' });
    }

    return updatedUser;
  },

  async createApiKey(userId: number, name: string) {
    const newApiKey = generateApiKey();
    const hashedKey = hashApiKey(newApiKey);

    await db.insert(apiKeys).values({
      name,
      keyHash: hashedKey,
      userId,
    });

    return {
      message: 'API key created successfully. Save this key somewhere safe. You will not be able to see it again.',
      apiKey: newApiKey,
    };
  }
};
