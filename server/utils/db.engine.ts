import { eq, getTableColumns } from "drizzle-orm";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { AnySQLiteTable, SQLiteColumn } from "drizzle-orm/sqlite-core";
import type { z } from "zod";
import type { DbTransaction } from "./db";
import { taxonomyHelper } from "./taxonomy.helper";
import { createLogger } from "./logger";

// ---------------------------------------------------------------------------
// Shared Types & Errors
// ---------------------------------------------------------------------------

export interface RelationConfig {
  junctionTable: AnySQLiteTable;
  lookupTable: AnySQLiteTable;
  parentColumn: AnySQLiteColumn;
  lookupColumn: AnySQLiteColumn;
}

export class DatabaseError extends Error {
  constructor(
    public message: string,
    public statusCode = 500,
    public cause?: unknown,
  ) {
    super(message);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function insertInto<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  data: InferInsertModel<T>,
): Promise<InferSelectModel<T>> {
  try {
    const [row] = await tx
      .insert(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .values(data as any)
      .returning();

    if (!row)
      throw new DatabaseError("Failed to insert record: No row returned.");
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .values(data as any)
    .onConflictDoUpdate({
      target: [parentCol, localeCol],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: data as any,
    });
}

async function refetch<T extends AnySQLiteTable>(
  tx: DbTransaction,
  table: T,
  id: number,
): Promise<InferSelectModel<T>> {
  const cols = getTableColumns(table);
  const idCol = cols.id as AnySQLiteColumn;

  const [row] = await tx.select().from(table).where(eq(idCol, id)).limit(1);

  if (!row)
    throw new DatabaseError(
      `Record with ID ${id} not found after operation`,
      404,
    );
  return row as InferSelectModel<T>;
}

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

// ---------------------------------------------------------------------------
// Unified Entity Service — Layer 1
// ---------------------------------------------------------------------------

export interface Hooks<TSelect, TCreate> {
  beforeCreate?: (tx: DbTransaction, data: TCreate) => Promise<TCreate>;
  afterCreate?: (
    tx: DbTransaction,
    entity: TSelect,
    data: TCreate,
  ) => Promise<void>;
  beforeUpdate?: (
    tx: DbTransaction,
    id: number,
    data: Partial<TCreate>,
  ) => Promise<Partial<TCreate>>;
  afterUpdate?: (
    tx: DbTransaction,
    entity: TSelect,
    data: Partial<TCreate>,
  ) => Promise<void>;
}

export interface EntityDescriptor<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable | undefined = undefined,
  TCreate = InferInsertModel<TMain>,
> {
  mainTable: TMain;
  schema?: z.ZodSchema<TCreate>;
  relations?: Record<string, RelationConfig>;
  hooks?: Hooks<InferSelectModel<TMain>, TCreate>;

  translationTable?: TTrans;
  parentColumnName?: string;
  categoriesTable?: AnySQLiteTable;
  ignoredFields?: string[];
}

export function createEntityService<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable | undefined = undefined,
  TCreate = InferInsertModel<TMain>,
>(descriptor: EntityDescriptor<TMain, TTrans, TCreate>) {
  type TSelect = InferSelectModel<TMain>;

  const isTranslatable = !!descriptor.translationTable;
  const mainColumns = getTableColumns(descriptor.mainTable);
  const transColumns = descriptor.translationTable
    ? getTableColumns(descriptor.translationTable)
    : {};

  const mainColumnNames = new Set(Object.keys(mainColumns));
  const transColumnNames = new Set(Object.keys(transColumns));
  const managedFields = new Set([
    "id",
    "categoryName",
    "tags",
    "techstack",
    ...(descriptor.ignoredFields || []),
  ]);

  function validate(data: unknown): TCreate {
    if (descriptor.schema) return descriptor.schema.parse(data);
    return data as TCreate;
  }

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

  async function ensureCategory(
    tx: DbTransaction,
    record: Record<string, unknown>,
  ) {
    if (!descriptor.categoriesTable || !record.categoryName) return undefined;
    return await taxonomyHelper.ensureCategory(
      tx,
      descriptor.categoriesTable,
      record.categoryName as string,
    );
  }

  return {
    async create(
      tx: DbTransaction,
      rawData: TCreate,
      authorId?: number,
    ): Promise<TSelect> {
      const data = descriptor.hooks?.beforeCreate
        ? await descriptor.hooks.beforeCreate(tx, rawData)
        : rawData;

      const record = data as Record<string, unknown>;
      const categoryId = await ensureCategory(tx, record);

      if (!isTranslatable) {
        const validated = validate(data);
        const processed = validated as Record<string, unknown>;

        if (categoryId !== undefined) processed.categoryId = categoryId;

        const entity = await insertInto(
          tx,
          descriptor.mainTable,
          processed as InferInsertModel<TMain>,
        );
        const entityId = (entity as unknown as { id: number }).id;

        if (descriptor.relations) {
          await syncRelations(tx, descriptor.relations, processed, entityId);
        }

        if (descriptor.hooks?.afterCreate) {
          await descriptor.hooks.afterCreate(tx, entity, data);
        }

        return entity;
      }

      const { mainData, transData } = splitPayload(record);

      if (mainColumnNames.has("translationKey") && !mainData.translationKey) {
        mainData.translationKey = crypto.randomUUID();
      }
      if (categoryId !== undefined) mainData.categoryId = categoryId;
      if (authorId !== undefined) mainData.authorId = authorId;

      const entity = await insertInto(
        tx,
        descriptor.mainTable,
        mainData as InferInsertModel<TMain>,
      );
      const entityId = (entity as unknown as { id: number }).id;

      if (descriptor.parentColumnName) {
        transData[descriptor.parentColumnName] = entityId;
      }
      await insertInto(
        tx,
        descriptor.translationTable!,
        transData as InferInsertModel<NonNullable<TTrans>>,
      );

      if (descriptor.relations) {
        await syncRelations(tx, descriptor.relations, record, entityId);
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, data);
      }

      return entity;
    },

    async update(
      tx: DbTransaction,
      id: number,
      rawData: Partial<TCreate>,
    ): Promise<TSelect> {
      const data = descriptor.hooks?.beforeUpdate
        ? await descriptor.hooks.beforeUpdate(tx, id, rawData)
        : rawData;

      const record = data as Record<string, unknown>;
      const categoryId = await ensureCategory(tx, record);

      if (!isTranslatable) {
        const validated = descriptor.schema
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Drizzle generic schema partial
            (descriptor.schema as z.ZodObject<any>).partial().parse(data)
          : data;
        const processed = validated as Record<string, unknown>;

        if (categoryId !== undefined) processed.categoryId = categoryId;

        await updateTable(
          tx,
          descriptor.mainTable,
          id,
          processed as Partial<InferInsertModel<TMain>>,
        );

        if (descriptor.relations) {
          await syncRelations(tx, descriptor.relations, processed, id);
        }

        const updated = await refetch(tx, descriptor.mainTable, id);

        if (descriptor.hooks?.afterUpdate) {
          await descriptor.hooks.afterUpdate(tx, updated, data);
        }

        return updated;
      }

      const { mainData, transData } = splitPayload(record);

      if (categoryId !== undefined) mainData.categoryId = categoryId;
      if (mainColumnNames.has("updatedAt")) {
        mainData.updatedAt = mainData.updatedAt ?? new Date();
      }

      await updateTable(
        tx,
        descriptor.mainTable,
        id,
        mainData as Partial<InferInsertModel<TMain>>,
      );

      if (transData.locale && (transData.slug || transData.title)) {
        if (descriptor.parentColumnName) {
          transData[descriptor.parentColumnName] = id;
        }
        if (transColumnNames.has("updatedAt")) {
          transData.updatedAt = new Date();
        }
        await upsertTranslation(
          tx,
          descriptor.translationTable!,
          descriptor.parentColumnName!,
          transData,
        );
      }

      if (descriptor.relations) {
        await syncRelations(tx, descriptor.relations, record, id);
      }

      const updated = await refetch(tx, descriptor.mainTable, id);

      if (descriptor.hooks?.afterUpdate) {
        await descriptor.hooks.afterUpdate(tx, updated, data);
      }

      return updated;
    },
  };
}

// ---------------------------------------------------------------------------
// Content Service — Layer 2 (high-level public/studio CRUD)
// ---------------------------------------------------------------------------

export interface ContentQueries<TPublic, TStudio> {
  publishedList(locale: AppLocale, limit?: number): Promise<TPublic[]>;
  publishedBySlug(
    slug: string,
    locale: AppLocale,
  ): Promise<TPublic | null | undefined>;
  studioList(limit?: number): Promise<TStudio[]>;
  studioById(id: number): Promise<TStudio | null | undefined>;
}

export interface ContentServiceConfig<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable | undefined,
  TCreate,
  TPublic,
  TStudio,
> {
  name: string;
  entityName: string;
  descriptor: EntityDescriptor<TMain, TTrans, TCreate>;
  publicResponseSchema: z.ZodSchema<TPublic>;
  studioResponseSchema: z.ZodSchema<TStudio>;
  queries: ContentQueries<TPublic, TStudio>;
}

export function createContentService<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable | undefined,
  TCreate,
  TPublic,
  TStudio,
>(config: ContentServiceConfig<TMain, TTrans, TCreate, TPublic, TStudio>) {
  const engine = createEntityService(config.descriptor);
  const logger = createLogger(config.name);

  return {
    engine,

    async getPublicAll(locale: AppLocale, limit?: number): Promise<TPublic[]> {
      logger.info(
        "getPublicAll",
        `Fetching ${config.name} for locale: ${locale}`,
        { limit },
      );
      return await config.queries.publishedList(locale, limit);
    },

    async getPublicBySlug(
      slug: string,
      locale: AppLocale,
    ): Promise<TPublic | null> {
      const result = await config.queries.publishedBySlug(slug, locale);
      return result ?? null;
    },

    async getStudioAll(limit?: number): Promise<TStudio[]> {
      return await config.queries.studioList(limit);
    },

    async getStudioById(id: number): Promise<TStudio> {
      const item = await config.queries.studioById(id);
      if (!item) {
        throw createError({
          statusCode: 404,
          statusMessage: `${config.entityName} not found`,
        });
      }
      return item;
    },

    async create(data: TCreate, authorId?: number) {
      logger.info("create", `Creating new ${config.name}`, { authorId });
      return await db.transaction(async (tx) => {
        return await engine.create(tx, data, authorId);
      });
    },

    async update(id: number, data: Partial<TCreate>) {
      logger.info("update", `Updating ${config.name} with id: ${id}`);
      return await db.transaction(async (tx) => {
        return await engine.update(tx, id, data);
      });
    },
  };
}
