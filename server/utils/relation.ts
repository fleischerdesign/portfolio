import { type LibSQLDatabase } from 'drizzle-orm/libsql';
import { eq, inArray, and, getTableColumns } from 'drizzle-orm';
import { type SQLiteTable } from 'drizzle-orm/sqlite-core';
import * as schema from '../db/schema';

// Helper type to support both the main DB instance and transaction instances
export type DbContext = LibSQLDatabase<typeof schema> | Parameters<Parameters<LibSQLDatabase<typeof schema>['transaction']>[0]>[0];

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

  const existing = await ctx
    .select({ id: (table as any).id })
    .from(table)
    .where(eq(nameColumn, trimmed))
    .get();

  if (existing) {
    return existing.id;
  }

  const [created] = await ctx
    .insert(table)
    .values({ [nameColumn.name]: trimmed, ...extraInsertValues } as any)
    .returning({ id: (table as any).id });

  if (!created) return null;

  return created.id;
}

export async function syncManyToMany(
  ctx: DbContext,
  junctionTable: SQLiteTable,
  entityCol: any,
  entityId: number,
  refCol: any,
  targetRefIds: number[]
) {
  const columns = getTableColumns(junctionTable);
  let entityKey: string | undefined;
  let refKey: string | undefined;

  for (const [key, col] of Object.entries(columns)) {
     if ((col as any).name === entityCol.name && (col as any).table === entityCol.table) entityKey = key;
     if ((col as any).name === refCol.name && (col as any).table === refCol.table) refKey = key;
  }

  if (!entityKey || !refKey) {
      throw new Error(`Could not resolve column keys for junction table synchronization. Ensure you pass the correct column objects from the schema.`);
  }

  const currentLinks = await ctx
    .select({ refId: refCol })
    .from(junctionTable)
    .where(eq(entityCol, entityId));

  const currentRefIds = currentLinks.map(l => l.refId);

  const idsToAdd = targetRefIds.filter(id => !currentRefIds.includes(id));
  const idsToRemove = currentRefIds.filter((id: number) => !targetRefIds.includes(id));

  if (idsToRemove.length > 0) {
    await ctx.delete(junctionTable)
      .where(
        and(
          eq(entityCol, entityId),
          inArray(refCol, idsToRemove)
        )
      );
  }

  if (idsToAdd.length > 0) {
    await ctx.insert(junctionTable).values(
      idsToAdd.map(refId => ({
        [entityKey!]: entityId,
        [refKey!]: refId
      } as any))
    );
  }
}
