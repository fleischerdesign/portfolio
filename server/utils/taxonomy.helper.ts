import { sql, eq, inArray } from "drizzle-orm";
import type { AnySQLiteTable, SQLiteColumn } from "drizzle-orm/sqlite-core";
import { slugify } from "~~/shared/utils/slugify";

/**
 * @helper taxonomyHelper
 * @description Manages categories, tags, and technologies using high-performance Drizzle upserts.
 * Uses official Drizzle types for maximum reliability.
 */
export const taxonomyHelper = {
  /**
   * @param tx Drizzle transaction instance
   * @param categoriesTable Drizzle table for categories
   * @param name Name of the category to ensure
   * @returns The ID of the ensured category or null
   */
  async ensureCategory(tx: unknown, categoriesTable: AnySQLiteTable, name: string | null | undefined): Promise<number | null> {
    if (!name) return null;

    const slug = slugify(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [category] = await (tx as any)
      .insert(categoriesTable)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values({ slug, name } as any)
      .onConflictDoUpdate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target: (categoriesTable as any).slug,
        set: { name },
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .returning({ id: (categoriesTable as any).id });

    return (category as { id: number })?.id || null;
  },

  /**
   * @param tx Drizzle transaction instance
   * @param config Configuration for the many-to-many synchronization
   */
  async syncManyToMany(tx: unknown, config: {
    parentId: number;
    parentColumn: SQLiteColumn;
    junctionTable: AnySQLiteTable;
    lookupTable: AnySQLiteTable;
    lookupColumn: SQLiteColumn;
    names: string[];
  }) {
    const { parentId, parentColumn, junctionTable, lookupTable, lookupColumn, names } = config;

    if (!names || names.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx as any).delete(junctionTable).where(eq(parentColumn, parentId));
      return;
    }

    const lookupData = names.map(name => ({
      name,
      slug: slugify(name)
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tx as any)
      .insert(lookupTable)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values(lookupData as any)
      .onConflictDoUpdate({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        target: (lookupTable as any).slug,
        set: { name: sql`excluded.name` }
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = await (tx as any)
      .select({ 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        id: (lookupTable as any).id, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slug: (lookupTable as any).slug 
      })
      .from(lookupTable)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .where(inArray((lookupTable as any).slug, lookupData.map(d => d.slug)));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (tx as any).delete(junctionTable).where(eq(parentColumn, parentId));

    if (items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx as any)
        .insert(junctionTable)
        .values((items as Array<{ id: number }>).map(item => ({
          [parentColumn.name]: parentId,
          [lookupColumn.name]: item.id
        })));
    }
  }
};
