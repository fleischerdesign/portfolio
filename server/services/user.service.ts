import { eq, asc } from "drizzle-orm";
import { users, apiKeys } from "~~/server/db/schema";
import { createLogger } from "../utils/logger";

const logger = createLogger("user");

export const userService = {
  async getById(userId: number) {
    logger.info("getById", `Fetching user with id: ${userId}`);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      logger.warn("getById", `User not found: ${userId}`);
      return null;
    }

    logger.info("getById", `Found user: ${userId}`);
    return user;
  },

  async getOwner(ownerEmail?: string) {
    logger.info("getOwner", "Fetching owner user", { ownerEmail });

    let user;

    if (ownerEmail) {
      user = await db.query.users.findFirst({
        where: eq(users.email, ownerEmail),
      });
    }

    if (!user) {
      user = await db.query.users.findFirst({
        where: eq(users.role, "admin"),
        orderBy: [asc(users.createdAt)],
      });
    }

    logger.info("getOwner", `Found owner: ${user?.id}`);
    return user;
  },

  async update(userId: number, data: Partial<typeof users.$inferInsert>) {
    logger.info("update", `Updating user: ${userId}`);

    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      logger.warn("update", `User not found: ${userId}`);
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

    logger.info("update", `Updated user: ${userId}`);
    return updatedUser;
  },

  async createApiKey(userId: number, name: string) {
    logger.info("createApiKey", `Creating API key for user: ${userId}`);

    const newApiKey = generateApiKey();
    const hashedKey = hashApiKey(newApiKey);

    await db.insert(apiKeys).values({
      name,
      keyHash: hashedKey,
      userId,
    });

    logger.info("createApiKey", `Created API key for user: ${userId}`);

    return {
      message:
        "API key created successfully. Save this key somewhere safe. You will not be able to see it again.",
      apiKey: newApiKey,
    };
  },
};
