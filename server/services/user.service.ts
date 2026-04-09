import { eq, asc } from "drizzle-orm";
import { users, apiKeys } from "~~/server/db/schema";
import { createLogger } from "../utils/logger";
import { createTranslatableService, type TranslatableEntityDescriptor } from "../utils/db.engine";

const logger = createLogger("user");

/**
 * @descriptor userDescriptor
 * @description Configuration for the user entity.
 */
const userDescriptor: TranslatableEntityDescriptor = {
  mainTable: users
};

const engine = createTranslatableService<any, any>(userDescriptor);

/**
 * @service userService
 * @description Service for managing users and authentication.
 */
export const userService = {
  ...engine,

  async getById(userId: number) {
    logger.info("getById", `Fetching user: ${userId}`);
    return await db.query.users.findFirst({ where: eq(users.id, userId) });
  },

  async getOwner(ownerEmail?: string) {
    logger.info("getOwner", "Fetching owner", { ownerEmail });
    if (ownerEmail) {
      const user = await db.query.users.findFirst({ where: eq(users.email, ownerEmail) });
      if (user) return user;
    }
    return await db.query.users.findFirst({
      where: eq(users.role, "admin"),
      orderBy: [asc(users.createdAt)],
    });
  },

  async update(userId: number, data: Partial<typeof users.$inferInsert>) {
    return await db.transaction(async (tx) => {
      return await engine.update(tx, userId, data);
    });
  },

  async createApiKey(userId: number, name: string) {
    logger.info("createApiKey", `Creating API key for user: ${userId}`);
    const newApiKey = generateApiKey();
    const hashedKey = hashApiKey(newApiKey);

    await db.insert(apiKeys).values({ name, keyHash: hashedKey, userId });
    return {
      message: "API key created successfully. Save it somewhere safe.",
      apiKey: newApiKey,
    };
  },
};
