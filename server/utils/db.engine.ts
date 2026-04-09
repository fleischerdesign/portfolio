import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import type { AnySQLiteTable, SQLiteColumn } from "drizzle-orm/sqlite-core";

/**
 * @interface TranslatableEntityDescriptor
 * @description Blueprint using official Drizzle types for maximum safety.
 */
export interface TranslatableEntityDescriptor<
  TMain extends AnySQLiteTable = AnySQLiteTable,
  TTrans extends AnySQLiteTable = AnySQLiteTable
> {
  mainTable: TMain;
  translationTable?: TTrans;
  parentColumnName?: keyof InferInsertModel<TTrans>;
  categoriesTable?: AnySQLiteTable;
  relations?: {
    [key: string]: {
      junctionTable: AnySQLiteTable;
      lookupTable: AnySQLiteTable;
      parentColumn: SQLiteColumn;
      lookupColumn: SQLiteColumn;
    }
  };
  hooks?: {
    beforeCreate?: (tx: unknown, data: unknown) => Promise<unknown>;
    afterCreate?: (tx: unknown, entity: unknown, data: unknown) => Promise<void>;
    beforeUpdate?: (tx: unknown, id: number, data: unknown) => Promise<unknown>;
    afterUpdate?: (tx: unknown, entity: unknown, data: unknown) => Promise<void>;
  };
}

/**
 * @factory createTranslatableService
 * @description Standardized service using Drizzle's own type inference.
 */
export function createTranslatableService<
  TMain extends AnySQLiteTable,
  TTrans extends AnySQLiteTable = AnySQLiteTable,
  TCreate = InferInsertModel<TMain> & (TTrans extends AnySQLiteTable ? InferInsertModel<TTrans> : object) & { categoryName?: string, tags?: string[], techstack?: string[] },
  TUpdate = Partial<TCreate>
>(descriptor: TranslatableEntityDescriptor<TMain, TTrans>) {
  return {
    /**
     * @param tx Drizzle transaction instance
     * @param data Data inferred from Drizzle schemas
     */
    async create(tx: unknown, data: TCreate, authorId?: number) {
      const processedData = (descriptor.hooks?.beforeCreate 
        ? await descriptor.hooks.beforeCreate(tx, data) 
        : data) as Record<string, unknown>;

      let categoryId: number | null = null;
      if (descriptor.categoriesTable && processedData.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(
          tx, 
          descriptor.categoriesTable, 
          processedData.categoryName as string
        );
      } else if (processedData.categoryId) {
        categoryId = processedData.categoryId as number;
      }

      const { 
        locale, slug, title, subtitle, body, 
        categoryName, tags, techstack, translationKey,
        ...entityPayload 
      } = processedData;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [entity] = await (tx as any)
        .insert(descriptor.mainTable)
        .values({
          ...entityPayload,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          translationKey: translationKey || ((descriptor.mainTable as any).translationKey ? crypto.randomUUID() : undefined),
          categoryId: categoryId || entityPayload.categoryId,
          authorId,
          publishedAt: entityPayload.publishedAt ? new Date(entityPayload.publishedAt as string) : (entityPayload.publishedAt === null ? null : undefined),
          createdAt: entityPayload.createdAt ? new Date(entityPayload.createdAt as string) : undefined,
          updatedAt: entityPayload.updatedAt ? new Date(entityPayload.updatedAt as string) : undefined,
        })
        .returning();

      if (descriptor.translationTable && descriptor.parentColumnName) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (tx as any)
          .insert(descriptor.translationTable)
          .values({
            [descriptor.parentColumnName as string]: (entity as { id: number }).id,
            locale,
            slug,
            title,
            subtitle,
            body,
            ...entityPayload
          });
      }

      if (descriptor.relations) {
        for (const [key, rel] of Object.entries(descriptor.relations)) {
          if (processedData[key]) {
            await taxonomyHelper.syncManyToMany(tx, {
              parentId: (entity as { id: number }).id,
              parentColumn: rel.parentColumn,
              junctionTable: rel.junctionTable,
              lookupTable: rel.lookupTable,
              lookupColumn: rel.lookupColumn,
              names: processedData[key] as string[]
            });
          }
        }
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, processedData);
      }

      return entity as InferSelectModel<TMain>;
    },

    async update(tx: unknown, id: number, data: TUpdate) {
      const processedData = (descriptor.hooks?.beforeUpdate 
        ? await descriptor.hooks.beforeUpdate(tx, id, data) 
        : data) as Record<string, unknown>;

      let categoryId = processedData.categoryId;
      if (descriptor.categoriesTable && processedData.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(
          tx, 
          descriptor.categoriesTable, 
          processedData.categoryName as string
        );
      }

      const { 
        locale, slug, title, subtitle, body, 
        categoryName, tags, techstack, translationKey,
        ...entityPayload 
      } = processedData;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (tx as any)
        .update(descriptor.mainTable)
        .set({
          ...entityPayload,
          publishedAt: entityPayload.publishedAt ? new Date(entityPayload.publishedAt as string) : (entityPayload.publishedAt === null ? null : undefined),
          categoryId,
          updatedAt: entityPayload.updatedAt ? new Date(entityPayload.updatedAt as string) : new Date(),
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .where(eq((descriptor.mainTable as any).id, id));

      if (descriptor.translationTable && descriptor.parentColumnName && locale && slug && title) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (tx as any)
          .insert(descriptor.translationTable)
          .values({
            [descriptor.parentColumnName as string]: id,
            locale,
            slug,
            title,
            subtitle,
            body,
            ...entityPayload
          })
          .onConflictDoUpdate({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            target: [(descriptor.translationTable as any)[descriptor.parentColumnName as string], (descriptor.translationTable as any).locale],
            set: {
              slug,
              title,
              subtitle,
              body,
              ...entityPayload,
              updatedAt: new Date(),
            },
          });
      }

      if (descriptor.relations) {
        for (const [key, rel] of Object.entries(descriptor.relations)) {
          if (processedData[key]) {
            await taxonomyHelper.syncManyToMany(tx, {
              parentId: id,
              parentColumn: rel.parentColumn,
              junctionTable: rel.junctionTable,
              lookupTable: rel.lookupTable,
              lookupColumn: rel.lookupColumn,
              names: processedData[key] as string[]
            });
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tableName = (descriptor.mainTable as any)._?.name || (descriptor.mainTable as any).name;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedEntity = await (tx as any).query[tableName].findFirst({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        where: eq((descriptor.mainTable as any).id, id)
      });

      if (descriptor.hooks?.afterUpdate) {
        await descriptor.hooks.afterUpdate(tx, updatedEntity, processedData);
      }

      return updatedEntity as InferSelectModel<TMain>;
    }
  };
}
