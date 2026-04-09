import { nowEntries } from "~~/server/db/schema";
import type { InferInsertModel } from "drizzle-orm";
import { desc } from "drizzle-orm";
import { createLogger } from "../utils/logger";
import { createEntityService, type EntityDescriptor } from "../utils/db.engine";

const logger = createLogger("now");

const nowDescriptor: EntityDescriptor<typeof nowEntries> = {
  mainTable: nowEntries,
};

const engine = createEntityService(nowDescriptor);

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
    const payload: InferInsertModel<typeof nowEntries> = {
      contentDe: data.de,
      contentEn: data.en,
      icon: data.icon,
    };
    return await db.transaction(async (tx) => {
      const result = await engine.create(tx, payload);
      return { success: true, updatedAt: result?.createdAt };
    });
  },
};
