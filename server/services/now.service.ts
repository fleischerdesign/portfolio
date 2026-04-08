import { nowEntries } from "~~/server/db/schema";
import { desc } from "drizzle-orm";
import { createLogger } from "../utils/logger";

const logger = createLogger("now");

export const nowService = {
  async getLatest(locale: AppLocale = "de") {
    logger.info("getLatest", `Fetching latest now entry for locale: ${locale}`);

    const latestEntry = await db.query.nowEntries.findFirst({
      orderBy: [desc(nowEntries.createdAt)],
    });

    if (!latestEntry) {
      logger.warn("getLatest", "No now entries found");
      return {
        status: "No status set!",
        updatedAt: null,
        icon: "mage:zap",
      };
    }

    logger.info("getLatest", `Found now entry: ${latestEntry.id}`);

    return {
      status: locale === "de" ? latestEntry.contentDe : latestEntry.contentEn,
      icon: latestEntry.icon || "info",
      updatedAt: latestEntry.createdAt,
    };
  },

  async create(data: { de: string; en: string; icon?: string }) {
    logger.info("create", "Creating new now entry");

    const result = await db
      .insert(nowEntries)
      .values({
        contentDe: data.de,
        contentEn: data.en,
        icon: data.icon,
      })
      .returning();

    logger.info("create", `Created now entry: ${result[0]?.id}`);

    return { success: true, updatedAt: result[0]?.createdAt };
  },
};
