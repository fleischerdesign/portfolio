import { eq, getTableColumns, getTableName, sql, inArray } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnySQLiteTable, AnySQLiteColumn, SQLiteColumn } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import type { DbTransaction } from "./db";
import { taxonomyHelper } from "./taxonomy.helper";

// ---------------------------------------------------------------------------
// Shared Types & Errors
// ---------------------------------------------------------------------------

/** Configuration for a many-to-many relationship managed via taxonomyHelper. */
export interface RelationConfig {
  junctionTable: AnySQLiteTable;
  lookupTable: AnySQLiteTable;
  parentColumn: AnySQLiteColumn;
  lookupColumn: AnySQLiteColumn;
}

/** 
 * Centralized DB Error mapping (Optional enhancement)
 */
export class DatabaseError extends Error {
  constructor(public message: string, public statusCode = 500, public cause?: unknown) {
    super(message);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers — strictly typed wrappers
// ---------------------------------------------------------------------------

/**
 * Insert a record into any table. 
 * Input is strictly typed based on the table's insert model.
 */
async function insertInto<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  data: InferInsertModel<T>,
): Promise<InferSelectModel<T>> {
  try {
    const [row] = await tx
      .insert(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle limitation with generic tables
      .values(data as any)
      .returning();
    
    if (!row) throw new DatabaseError("Failed to insert record: No row returned.");
    return row as InferSelectModel<T>;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new DatabaseError("Database insertion failed", 500, error);
  }
}

async function updateTable<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  id: number,
  data: Partial<InferInsertModel<T>>,
): Promise<void> {
  const cols = getTableColumns(table);
  const idCol = cols.id as AnySQLiteColumn;

  await tx
    .update(table)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic table limitation
    .set(data as any)
    .where(eq(idCol, id));
}

async function upsertTranslation<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
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

/**
 * Clean Refetching: Avoids string-based lookup in tx.query.
 */
async function refetch<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  id: number,
): Promise<InferSelectModel<T>> {
  const cols = getTableColumns(table);
  const idCol = cols.id as AnySQLiteColumn;

  const [row] = await tx
    .select()
    .from(table)
    .where(eq(idCol, id))
    .limit(1);

  if (!row) throw new DatabaseError(`Record with ID ${id} not found after operation`, 404);
  return row as InferSelectModel<T>;
}

// ---------------------------------------------------------------------------
// 1. Entity Service — base CRUD factory
// ---------------------------------------------------------------------------

export interface EntityDescriptor<
  TMain extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain>,
> {
  mainTable: TMain;
  schema?: z.ZodSchema<TCreate>; // Added for automatic validation
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

export function createEntityService<
  TMain extends AnySQLiteTable,
  TCreate = InferInsertModel<TMain>,
>(descriptor: EntityDescriptor<TMain, TCreate>) {
  type TSelect = InferSelectModel<TMain>;

  /** Internal validator */
  function validate(data: unknown): TCreate {
    if (descriptor.schema) {
      return descriptor.schema.parse(data);
    }
    return data as TCreate;
  }

  return {
    async create(tx: DbTransaction, rawData: TCreate): Promise<TSelect> {
      const validatedData = validate(rawData);
      
      const processedData = descriptor.hooks?.beforeCreate
        ? await descriptor.hooks.beforeCreate(tx, validatedData)
        : validatedData;

      const entity = await insertInto(
        tx,
        descriptor.mainTable,
        processedData as InferInsertModel<TMain>,
      );

      const entityId = (entity as unknown as { id: number }).id;

      if (descriptor.relations) {
        await syncRelations(
          tx,
          descriptor.relations,
          processedData as Record<string, unknown>,
          entityId,
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
      rawData: Partial<TCreate>,
    ): Promise<TSelect> {
      // Partial validation for updates
      const validatedData = descriptor.schema 
        ? (descriptor.schema as z.ZodObject<any>).partial().parse(rawData) 
        : rawData;

      const processedData = descriptor.hooks?.beforeUpdate
        ? await descriptor.hooks.beforeUpdate(tx, id, validatedData)
        : validatedData;

      await updateTable(
        tx,
        descriptor.mainTable,
        id,
        processedData as Partial<InferInsertModel<TMain>>,
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
// 2. Translatable Entity Service
// ---------------------------------------------------------------------------

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
  /** Custom fields that shouldn't be auto-mapped to columns */
  ignoredFields?: string[];
}

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

  const mainColumns = getTableColumns(descriptor.mainTable);
  const transColumns = getTableColumns(descriptor.translationTable);
  
  const mainColumnNames = new Set(Object.keys(mainColumns));
  const transColumnNames = new Set(Object.keys(transColumns));
  
  const managedFields = new Set([
    "id", "categoryName", "tags", "techstack", 
    ...(descriptor.ignoredFields || [])
  ]);

  /** Dynamic Splitter: Maps flat payload to table-specific structures */
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
    async create(tx: DbTransaction, data: TCreate, authorId?: number): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeCreate
        ? await descriptor.hooks.beforeCreate(tx, data)
        : data;

      const record = processedData as Record<string, unknown>;

      // Taxonomy Handling
      let categoryId = record.categoryId as number | null | undefined;
      if (descriptor.categoriesTable && record.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(
          tx,
          descriptor.categoriesTable,
          record.categoryName as string,
        );
      }

      const { mainData, transData } = splitPayload(record);

      // Auto-populate system fields
      if (mainColumnNames.has("translationKey") && !mainData.translationKey) {
        mainData.translationKey = crypto.randomUUID();
      }
      if (categoryId !== undefined) mainData.categoryId = categoryId;
      if (authorId !== undefined) mainData.authorId = authorId;

      const entity = await insertInto(tx, descriptor.mainTable, mainData as InferInsertModel<TMain>);
      const entityId = (entity as unknown as { id: number }).id;

      // Translation Layer
      transData[descriptor.parentColumnName as string] = entityId;
      await insertInto(tx, descriptor.translationTable, transData as InferInsertModel<TTrans>);

      if (descriptor.relations) {
        await syncRelations(tx, descriptor.relations, record, entityId);
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, processedData);
      }

      return entity;
    },

    async update(tx: DbTransaction, id: number, data: Partial<TCreate>): Promise<TSelect> {
      const processedData = descriptor.hooks?.beforeUpdate
        ? await descriptor.hooks.beforeUpdate(tx, id, data)
        : data;

      const record = processedData as Record<string, unknown>;

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

      await updateTable(tx, descriptor.mainTable, id, mainData as Partial<InferInsertModel<TMain>>);

      // Upsert translation if essential fields are present
      if (transData.locale && (transData.slug || transData.title)) {
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
// Shared Utility Helpers
// ---------------------------------------------------------------------------

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
        parentColumn: rel.parentColumn as SQLiteColumn,
        junctionTable: rel.junctionTable,
        lookupTable: rel.lookupTable,
        lookupColumn: rel.lookupColumn as SQLiteColumn,
        names: names as string[],
      });
    }
  }
}
