import { eq } from 'drizzle-orm';
import { users, apiKeys } from '~~/server/db/schema';
import { updateUserSchema } from '#shared/schemas/user.schema';
import { z } from 'zod';

export const userService = {
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
