import { nowEntries } from "~~/server/db/schema";
import { desc } from "drizzle-orm";
import { createLogger } from "../utils/logger";
import { createTranslatableService, type TranslatableEntityDescriptor } from "../utils/db.engine";

const logger = createLogger("now");

/**
 * @descriptor nowDescriptor
 * @description Configuration for the now entry entity.
 */
const nowDescriptor: TranslatableEntityDescriptor = {
  mainTable: nowEntries
};

const engine = createTranslatableService<Record<string, unknown>, Record<string, unknown>>(nowDescriptor);

/**
 * @service nowService
 * @description Service for managing 'Now' status entries.
 */
export const nowService = {
  ...engine,

  async getLatest(locale: AppLocale = "de") {
    logger.info("getLatest", `Fetching latest now entry for locale: ${locale}`);
    const latestEntry = await db.query.nowEntries.findFirst({
      orderBy: [desc(nowEntries.createdAt)],
    });

    if (!latestEntry) {
      return { status: "No status set!", updatedAt: null, icon: "mage:zap" };
    }

    return {
      status: locale === "de" ? latestEntry.contentDe : latestEntry.contentEn,
      icon: latestEntry.icon || "info",
      updatedAt: latestEntry.createdAt,
    };
  },

  async create(data: { de: string; en: string; icon?: string }) {
    return await db.transaction(async (tx) => {
      const result = await engine.create(tx, {
        contentDe: data.de,
        contentEn: data.en,
        icon: data.icon
      });
      return { success: true, updatedAt: result?.createdAt };
    });
  },
};
