import { type LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq, inArray, and, getTableColumns } from 'drizzle-orm';
import { type SQLiteTable } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';

// Helper type to support both the main DB instance and transaction instances
export type DbContext = LibSQLDatabase<typeof schema> | Parameters<Parameters<LibSQLDatabase<typeof schema>['transaction']>[0]>[0];

/**
 * Resolves a string value to a database entity ID.
 * If the entity exists (case-sensitive match), its ID is returned.
 * If it does not exist, it is created and the new ID is returned.
 * 
 * Useful for handling lookup tables like Categories, Tags, Technologies.
 * 
 * @param ctx Database context (db or tx)
 * @param table The Drizzle table definition (e.g. categories)
 * @param nameColumn The column to search/insert by (e.g. categories.name)
 * @param value The string value to resolve (e.g. "Nuxt")
 */
export async function resolveEntityReference(
  ctx: DbContext,
  table: SQLiteTable,
  nameColumn: any,
  value: string | null | undefined,
  extraInsertValues: Record<string, any> = {}
): Promise<number | null> {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  // 1. Try to find existing
  // We use .get() which is specific to better-sqlite3/libsql driver
  const existing = await ctx
    .select({ id: (table as any).id })
    .from(table)
    .where(eq(nameColumn, trimmed))
    .get();

  if (existing) {
    return existing.id;
  }

  // 2. Create new if not found
  const [created] = await ctx
    .insert(table)
    .values({ [nameColumn.name]: trimmed, ...extraInsertValues } as any)
    .returning({ id: (table as any).id });

  if (!created) return null;

  return created.id;
}

/**
 * Synchronizes a Many-to-Many relationship.
 * Ensures the junction table exactly matches the provided list of reference IDs for a given entity.
 * - Adds missing links.
 * - Removes obsolete links.
 * 
 * @param ctx Database context (db or tx)
 * @param junctionTable The junction table (e.g. projectsToTags)
 * @param entityCol The column pointing to the parent entity (e.g. projectsToTags.projectId)
 * @param entityId The ID of the parent entity
 * @param refCol The column pointing to the referenced entity (e.g. projectsToTags.tagId)
 * @param targetRefIds The list of IDs that SHOULD be linked
 */
export async function syncManyToMany(
  ctx: DbContext,
  junctionTable: SQLiteTable,
  entityCol: any,
  entityId: number,
  refCol: any,
  targetRefIds: number[]
) {
  // 1. Resolve keys from columns to allow safe insert
  const columns = getTableColumns(junctionTable);
  let entityKey: string | undefined;
  let refKey: string | undefined;

  // Since column objects are identical by reference in Drizzle schema definitions,
  // we can find the key by comparing the column object passed in.
  // Note: This relies on passing the EXACT column export from the schema.
  for (const [key, col] of Object.entries(columns)) {
     // We compare the name (DB column name) and table to ensure it's the right column
     // Direct reference comparison (col === entityCol) might fail if Drizzle clones columns internally,
     // but usually schema exports are stable. Safer is to check table name and column name.
     if ((col as any).name === entityCol.name && (col as any).table === entityCol.table) entityKey = key;
     if ((col as any).name === refCol.name && (col as any).table === refCol.table) refKey = key;
  }

  if (!entityKey || !refKey) {
      throw new Error(`Could not resolve column keys for junction table synchronization. Ensure you pass the correct column objects from the schema.`);
  }

  // 2. Get currently linked IDs
  const currentLinks = await ctx
    .select({ refId: refCol })
    .from(junctionTable)
    .where(eq(entityCol, entityId));

  const currentRefIds = currentLinks.map(l => l.refId);

  // 3. Calculate Diff
  const idsToAdd = targetRefIds.filter(id => !currentRefIds.includes(id));
  const idsToRemove = currentRefIds.filter((id: number) => !targetRefIds.includes(id));

  // 4. Apply Changes
  
  // Remove obsolete
  if (idsToRemove.length > 0) {
    await ctx.delete(junctionTable)
      .where(
        and(
          eq(entityCol, entityId),
          inArray(refCol, idsToRemove)
        )
      );
  }

  // Add new
  if (idsToAdd.length > 0) {
    await ctx.insert(junctionTable).values(
      idsToAdd.map(refId => ({
        [entityKey!]: entityId,
        [refKey!]: refId
      } as any))
    );
  }
}
