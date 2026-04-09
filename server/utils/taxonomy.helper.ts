import { sql, eq, inArray } from "drizzle-orm";
import { slugify } from "~~/shared/utils/slugify";

/**
 * @helper taxonomyHelper
 * @description Manages categories, tags, and technologies using high-performance Drizzle upserts.
 * Placed in utils to be auto-imported and prevent circular dependencies with services.
 */
export const taxonomyHelper = {
  /**
   * @param tx Drizzle transaction instance
   * @param categoriesTable Drizzle table for categories
   * @param name Name of the category to ensure
   * @returns The ID of the ensured category or null
   */
  async ensureCategory(tx: any, categoriesTable: any, name: string | null | undefined): Promise<number | null> {
    if (!name) return null;

    const slug = slugify(name);
    const [category] = await tx
      .insert(categoriesTable)
      .values({ slug, name })
      .onConflictDoUpdate({
        target: categoriesTable.slug,
        set: { name },
      })
      .returning({ id: categoriesTable.id });

    return category?.id || null;
  },

  /**
   * @param tx Drizzle transaction instance
   * @param config Configuration for the many-to-many synchronization
   */
  async syncManyToMany(tx: any, config: {
    parentId: number;
    parentColumn: any;
    junctionTable: any;
    lookupTable: any;
    lookupColumn: any;
    names: string[];
  }) {
    const { parentId, parentColumn, junctionTable, lookupTable, lookupColumn, names } = config;

    if (!names || names.length === 0) {
      await tx.delete(junctionTable).where(eq(parentColumn, parentId));
      return;
    }

    const lookupData = names.map(name => ({
      name,
      slug: slugify(name)
    }));

    await tx
      .insert(lookupTable)
      .values(lookupData)
      .onConflictDoUpdate({
        target: lookupTable.slug,
        set: { name: sql`excluded.name` }
      });

    const items = await tx
      .select({ id: lookupTable.id, slug: lookupTable.slug })
      .from(lookupTable)
      .where(inArray(lookupTable.slug, lookupData.map(d => d.slug)));

    await tx.delete(junctionTable).where(eq(parentColumn, parentId));

    if (items.length > 0) {
      await tx
        .insert(junctionTable)
        .values(items.map((item: any) => ({
          [parentColumn.name]: parentId,
          [lookupColumn.name]: item.id
        })));
    }
  }
};
