import { nowEntries } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';

export const nowService = {
  async getLatest(locale: 'de' | 'en' = 'de') {
    const latestEntry = await db.query.nowEntries.findFirst({
      orderBy: [desc(nowEntries.createdAt)]
    });

    if (!latestEntry) {
      return { status: 'No status set!', updatedAt: null, icon: 'mage:zap' };
    }

    return {
      status: locale === 'de' ? latestEntry.contentDe : latestEntry.contentEn,
      icon: latestEntry.icon || 'info',
      updatedAt: latestEntry.createdAt
    };
  },

  async create(data: { de: string; en: string; icon?: string }) {
    const result = await db.insert(nowEntries).values({
      contentDe: data.de,
      contentEn: data.en,
      icon: data.icon
    }).returning();

    return { success: true, updatedAt: result[0]?.createdAt };
  }
};
