import { sql, eq, inArray, getTableColumns } from "drizzle-orm";
import type { AnySQLiteTable, SQLiteColumn } from "drizzle-orm/sqlite-core";
import type { DbTransaction } from "./db";
import { slugify } from "~~/shared/utils/slugify";

/**
 * Manages categories, tags, and technologies using high-performance Drizzle upserts.
 */
export const taxonomyHelper = {
  /**
   * Upsert a category by name and return its ID.
   */
  async ensureCategory(
    tx: DbTransaction,
    categoriesTable: AnySQLiteTable,
    name: string | null | undefined,
  ): Promise<number | null> {
    if (!name) return null;

    const slug = slugify(name);
    const columns = getTableColumns(categoriesTable);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table insert limitation
    const [category] = await (tx as any)
      .insert(categoriesTable)
      .values({ slug, name })
      .onConflictDoUpdate({
        target: columns.slug as SQLiteColumn,
        set: { name },
      })
      .returning({ id: columns.id as SQLiteColumn });

    return (category as { id: number })?.id ?? null;
  },

  /**
   * Fully synchronize a many-to-many relationship: upsert lookup records, then replace junction rows.
   */
  async syncManyToMany(
    tx: DbTransaction,
    config: {
      parentId: number;
      parentColumn: SQLiteColumn;
      junctionTable: AnySQLiteTable;
      lookupTable: AnySQLiteTable;
      lookupColumn: SQLiteColumn;
      names: string[];
    },
  ) {
    const {
      parentId,
      parentColumn,
      junctionTable,
      lookupTable,
      lookupColumn,
      names,
    } = config;

    if (!names || names.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
      await (tx as any).delete(junctionTable).where(eq(parentColumn, parentId));
      return;
    }

    const lookupData = names.map((name) => ({
      name,
      slug: slugify(name),
    }));

    const lookupColumns = getTableColumns(lookupTable);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    await (tx as any)
      .insert(lookupTable)
      .values(lookupData)
      .onConflictDoUpdate({
        target: lookupColumns.slug as SQLiteColumn,
        set: { name: sql`excluded.name` },
      });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    const items: { id: number }[] = await (tx as any)
      .select({
        id: lookupColumns.id as SQLiteColumn,
        slug: lookupColumns.slug as SQLiteColumn,
      })
      .from(lookupTable)
      .where(
        inArray(
          lookupColumns.slug as SQLiteColumn,
          lookupData.map((d) => d.slug),
        ),
      );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    await (tx as any).delete(junctionTable).where(eq(parentColumn, parentId));

    if (items.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
      await (tx as any).insert(junctionTable).values(
        items.map((item) => ({
          [parentColumn.name]: parentId,
          [lookupColumn.name]: item.id,
        })),
      );
    }
  },
};
