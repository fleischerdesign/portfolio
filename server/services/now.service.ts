import { nowEntries, nowEntryTranslations } from "~~/server/db/schema";
import { desc } from "drizzle-orm";
import { createLogger } from "../utils/logger";
import { nowEntryResponseSchema } from "~~/shared/schemas/now.schema";

const logger = createLogger("now");

export const nowService = {
  async getLatest(locale: AppLocale = "de") {
    logger.info("getLatest", `Fetching latest now entry for locale: ${locale}`);
    const latestEntry = await db.query.nowEntries.findFirst({
      orderBy: [desc(nowEntries.createdAt)],
      with: {
        translations: {
          where: (t, { eq }) => eq(t.locale, locale),
        },
      },
    });

    if (!latestEntry || latestEntry.translations.length === 0) {
      return { status: "No status set!", updatedAt: null, icon: "mage:zap" };
    }

    return nowEntryResponseSchema.parse({
      status: latestEntry.translations[0]!.content,
      icon: latestEntry.icon || "info",
      updatedAt: latestEntry.createdAt,
    });
  },

  async create(data: { de: string; en: string; icon?: string }) {
    return await db.transaction(async (tx) => {
      const [entry] = await tx
        .insert(nowEntries)
        .values({ icon: data.icon })
        .returning();

      if (!entry) throw new Error("Failed to create now entry");

      await tx.insert(nowEntryTranslations).values([
        { nowEntryId: entry.id, locale: "de", content: data.de },
        { nowEntryId: entry.id, locale: "en", content: data.en },
      ]);

      return { success: true, updatedAt: entry.createdAt };
    });
  },
};
