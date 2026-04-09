import { eq, getTableColumns, getTableName } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnySQLiteTable, AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import type { DbTransaction } from "./db";

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Configuration for a many-to-many relationship managed via taxonomyHelper. */
export interface RelationConfig {
  junctionTable: AnySQLiteTable;
  lookupTable: AnySQLiteTable;
  parentColumn: AnySQLiteColumn;
  lookupColumn: AnySQLiteColumn;
}

// ---------------------------------------------------------------------------
// Internal helpers — typed wrappers around Drizzle's generic table operations
// ---------------------------------------------------------------------------

/**
 * Insert a record into any table. Uses `Record<string, unknown>` internally
 * because Drizzle's `.values()` overloads fight with generic `AnySQLiteTable`.
 */
async function insertInto<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  data: Record<string, unknown>,
): Promise<InferSelectModel<T>> {
  const [row] = await tx
    .insert(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle's insert overload doesn't accept Record<string, unknown> for generic tables
    .values(data as any)
    .returning();
  return row as InferSelectModel<T>;
}

async function updateTable(
  tx: DbTransaction,
  table: AnySQLiteTable,
  id: number,
  data: Record<string, unknown>,
): Promise<void> {
  const cols = getTableColumns(table);
  await tx
    .update(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    .set(data as any)
    .where(eq(cols.id as AnySQLiteColumn, id));
}

async function upsertTranslation(
  tx: DbTransaction,
  table: AnySQLiteTable,
  parentColumnName: string,
  data: Record<string, unknown>,
): Promise<void> {
  const cols = getTableColumns(table);
  const parentCol = cols[parentColumnName] as AnySQLiteColumn;
  const localeCol = cols.locale as AnySQLiteColumn;

  await tx
    .insert(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    .values(data as any)
    .onConflictDoUpdate({
      target: [parentCol, localeCol],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
      set: data as any,
    });
}

async function refetch<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  id: number,
): Promise<InferSelectModel<T>> {
  const cols = getTableColumns(table);
  const tableName = getTableName(table);
  const queryTable = (
    tx.query as Record<
      string,
      { findFirst: (opts: unknown) => Promise<InferSelectModel<T>> }
    >
  )[tableName]!;
  return queryTable.findFirst({
    where: eq(cols.id as AnySQLiteColumn, id),
  });
}

// ---------------------------------------------------------------------------
// 1. Entity Service — base CRUD for any table
// ---------------------------------------------------------------------------

/** Descriptor for a plain (non-translatable) entity. */
export interface EntityDescriptor<
  TMain extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain>,
> {
  mainTable: TMain;
  relations?: Record<string, RelationConfig>;
  hooks?: {
    beforeCreate?: (tx: DbTransaction, data: TCreate) => Promise<TCreate>;
    afterCreate?: (
      tx: DbTransaction,
      entity: InferSelectModel<TMain>,
      data: TCreate,
    ) => Promise<void>;
    beforeUpdate?: (
      tx: DbTransaction,
      id: number,
      data: Partial<TCreate>,
    ) => Promise<Partial<TCreate>>;
    afterUpdate?: (
      tx: DbTransaction,
      entity: InferSelectModel<TMain>,
      data: Partial<TCreate>,
    ) => Promise<void>;
  };
}

/**
 * Factory for plain entity services.
 *
 * Provides `create` and `update` that accept an *external* transaction,
 * keeping transaction ownership with the caller (service layer).
 */
export function createEntityService<
  TMain extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain>,
>(descriptor: EntityDescriptor<TMain, TCreate>) {
  type TSelect = InferSelectModel<TMain>;

  return {
    async create(tx: DbTransaction, data: TCreate): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeCreate
        ? await descriptor.hooks.beforeCreate(tx, data)
        : data;

      const entity = await insertInto(
        tx,
        descriptor.mainTable,
        processedData as Record<string, unknown>,
      );

      if (descriptor.relations) {
        await syncRelations(
          tx,
          descriptor.relations,
          processedData as Record<string, unknown>,
          (entity as unknown as { id: number }).id,
        );
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, processedData);
      }

      return entity;
    },

    async update(
      tx: DbTransaction,
      id: number,
      data: Partial<TCreate>,
    ): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeUpdate
        ? await descriptor.hooks.beforeUpdate(tx, id, data)
        : data;

      await updateTable(
        tx,
        descriptor.mainTable,
        id,
        processedData as Record<string, unknown>,
      );

      if (descriptor.relations) {
        await syncRelations(
          tx,
          descriptor.relations,
          processedData as Record<string, unknown>,
          id,
        );
      }

      const updatedEntity = await refetch(tx, descriptor.mainTable, id);

      if (descriptor.hooks?.afterUpdate) {
        await descriptor.hooks.afterUpdate(tx, updatedEntity, processedData);
      }

      return updatedEntity;
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Translatable Entity Service — extends base with i18n + taxonomy
// ---------------------------------------------------------------------------

/** Extended descriptor for entities with a separate translations table. */
export interface TranslatableEntityDescriptor<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain> &
    InferInsertModel<TTrans> & {
      categoryName?: string | null;
      tags?: string[];
      techstack?: string[];
    },
> extends EntityDescriptor<TMain, TCreate> {
  translationTable: TTrans;
  parentColumnName: keyof InferInsertModel<TTrans>;
  categoriesTable?: AnySQLiteTable;
}

/**
 * Factory for translatable entity services.
 *
 * Dynamically splits a flat payload into main-table and translation-table
 * parts based on actual column metadata — no hardcoded field names.
 */
export function createTranslatableEntityService<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain> &
    InferInsertModel<TTrans> & {
      categoryName?: string | null;
      tags?: string[];
      techstack?: string[];
    },
>(descriptor: TranslatableEntityDescriptor<TMain, TTrans, TCreate>) {
  type TSelect = InferSelectModel<TMain>;

  // Pre-compute column name sets for dynamic field splitting
  const mainColumnNames = new Set(
    Object.keys(getTableColumns(descriptor.mainTable)),
  );
  const transColumnNames = new Set(
    Object.keys(getTableColumns(descriptor.translationTable)),
  );
  const managedFields = new Set(["categoryName", "tags", "techstack"]);

  /** Split a flat payload into main-table and translation-table parts. */
  function splitPayload(payload: Record<string, unknown>) {
    const mainData: Record<string, unknown> = {};
    const transData: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(payload)) {
      if (managedFields.has(key)) continue;
      if (mainColumnNames.has(key)) mainData[key] = value;
      if (transColumnNames.has(key)) transData[key] = value;
    }

    return { mainData, transData };
  }

  return {
    async create(
      tx: DbTransaction,
      data: TCreate,
      authorId?: number,
    ): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeCreate
        ? await descriptor.hooks.beforeCreate(tx, data)
        : data;

      const record = processedData as Record<string, unknown>;

      // Resolve category
      let categoryId = record.categoryId as number | null | undefined;
      if (descriptor.categoriesTable && record.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(
          tx,
          descriptor.categoriesTable,
          record.categoryName as string,
        );
      }

      const { mainData, transData } = splitPayload(record);

      if (mainColumnNames.has("translationKey") && !mainData.translationKey) {
        mainData.translationKey = crypto.randomUUID();
      }
      if (categoryId !== undefined) mainData.categoryId = categoryId;
      if (authorId !== undefined) mainData.authorId = authorId;

      const entity = await insertInto(tx, descriptor.mainTable, mainData);
      const entityId = (entity as unknown as { id: number }).id;

      // Insert translation row
      transData[descriptor.parentColumnName as string] = entityId;
      await insertInto(tx, descriptor.translationTable, transData);

      // Sync M2M relations
      if (descriptor.relations) {
        await syncRelations(tx, descriptor.relations, record, entityId);
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, processedData);
      }

      return entity;
    },

    async update(
      tx: DbTransaction,
      id: number,
      data: Partial<TCreate>,
    ): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeUpdate
        ? await descriptor.hooks.beforeUpdate(tx, id, data)
        : data;

      const record = processedData as Record<string, unknown>;

      // Resolve category
      let categoryId = record.categoryId as number | null | undefined;
      if (descriptor.categoriesTable && record.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(
          tx,
          descriptor.categoriesTable,
          record.categoryName as string,
        );
      }

      const { mainData, transData } = splitPayload(record);

      if (categoryId !== undefined) mainData.categoryId = categoryId;
      if (mainColumnNames.has("updatedAt")) {
        mainData.updatedAt = mainData.updatedAt ?? new Date();
      }

      await updateTable(tx, descriptor.mainTable, id, mainData);

      // Upsert translation (only when locale is present)
      if (transData.locale && transData.slug && transData.title) {
        transData[descriptor.parentColumnName as string] = id;
        if (transColumnNames.has("updatedAt")) {
          transData.updatedAt = new Date();
        }
        await upsertTranslation(
          tx,
          descriptor.translationTable,
          descriptor.parentColumnName as string,
          transData,
        );
      }

      // Sync M2M relations
      if (descriptor.relations) {
        await syncRelations(tx, descriptor.relations, record, id);
      }

      const updatedEntity = await refetch(tx, descriptor.mainTable, id);

      if (descriptor.hooks?.afterUpdate) {
        await descriptor.hooks.afterUpdate(tx, updatedEntity, processedData);
      }

      return updatedEntity;
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Sync all configured M2M relations for a given parent entity. */
async function syncRelations(
  tx: DbTransaction,
  relations: Record<string, RelationConfig>,
  data: Record<string, unknown>,
  parentId: number,
) {
  for (const [key, rel] of Object.entries(relations)) {
    const names = data[key];
    if (Array.isArray(names)) {
      await taxonomyHelper.syncManyToMany(tx, {
        parentId,
        parentColumn: rel.parentColumn,
        junctionTable: rel.junctionTable,
        lookupTable: rel.lookupTable,
        lookupColumn: rel.lookupColumn,
        names: names as string[],
      });
    }
  }
}
