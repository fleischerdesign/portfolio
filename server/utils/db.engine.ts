import { eq } from "drizzle-orm";

/**
 * @interface TranslatableEntityDescriptor
 * @description Blueprint for entities and their optional translation relations.
 */
export interface TranslatableEntityDescriptor {
  mainTable: any;
  translationTable?: any;
  parentColumnName?: string;
  categoriesTable?: any;
  relations?: {
    [key: string]: {
      junctionTable: any;
      lookupTable: any;
      parentColumn: any;
      lookupColumn: any;
    }
  };
  hooks?: {
    beforeCreate?: (tx: any, data: any) => Promise<any>;
    afterCreate?: (tx: any, entity: any, data: any) => Promise<void>;
    beforeUpdate?: (tx: any, id: number, data: any) => Promise<any>;
    afterUpdate?: (tx: any, entity: any, data: any) => Promise<void>;
  };
}

/**
 * @factory createTranslatableService
 * @description Creates a standardized service for entities. 
 * Relies on taxonomyHelper being auto-imported by Nuxt.
 */
export function createTranslatableService<TCreate, TUpdate>(descriptor: TranslatableEntityDescriptor) {
  return {
    async create(tx: any, data: any, authorId?: number) {
      const processedData = descriptor.hooks?.beforeCreate 
        ? await descriptor.hooks.beforeCreate(tx, data) 
        : data;

      let categoryId = null;
      if (descriptor.categoriesTable && processedData.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(tx, descriptor.categoriesTable, processedData.categoryName);
      } else if (processedData.categoryId) {
        categoryId = processedData.categoryId;
      }

      const { 
        locale, slug, title, subtitle, body, 
        categoryName, tags, techstack, translationKey,
        ...entityPayload 
      } = processedData;

      const [entity] = await tx
        .insert(descriptor.mainTable)
        .values({
          ...entityPayload,
          translationKey: translationKey || (descriptor.mainTable.translationKey ? crypto.randomUUID() : undefined),
          categoryId: categoryId || entityPayload.categoryId,
          authorId,
          publishedAt: entityPayload.publishedAt ? new Date(entityPayload.publishedAt) : (entityPayload.publishedAt === null ? null : undefined),
          createdAt: entityPayload.createdAt ? new Date(entityPayload.createdAt) : undefined,
          updatedAt: entityPayload.updatedAt ? new Date(entityPayload.updatedAt) : undefined,
        })
        .returning();

      if (descriptor.translationTable && descriptor.parentColumnName) {
        await tx
          .insert(descriptor.translationTable)
          .values({
            [descriptor.parentColumnName]: entity.id,
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
              parentId: entity.id,
              parentColumn: rel.parentColumn,
              junctionTable: rel.junctionTable,
              lookupTable: rel.lookupTable,
              lookupColumn: rel.lookupColumn,
              names: processedData[key]
            });
          }
        }
      }

      if (descriptor.hooks?.afterCreate) {
        await descriptor.hooks.afterCreate(tx, entity, processedData);
      }

      return entity;
    },

    async update(tx: any, id: number, data: any) {
      const processedData = descriptor.hooks?.beforeUpdate 
        ? await descriptor.hooks.beforeUpdate(tx, id, data) 
        : data;

      let categoryId = processedData.categoryId;
      if (descriptor.categoriesTable && processedData.categoryName) {
        categoryId = await taxonomyHelper.ensureCategory(tx, descriptor.categoriesTable, processedData.categoryName);
      }

      const { 
        locale, slug, title, subtitle, body, 
        categoryName, tags, techstack, translationKey,
        ...entityPayload 
      } = processedData;

      await tx
        .update(descriptor.mainTable)
        .set({
          ...entityPayload,
          publishedAt: entityPayload.publishedAt ? new Date(entityPayload.publishedAt) : (entityPayload.publishedAt === null ? null : undefined),
          categoryId,
          updatedAt: entityPayload.updatedAt ? new Date(entityPayload.updatedAt) : new Date(),
        })
        .where(eq(descriptor.mainTable.id, id));

      if (descriptor.translationTable && descriptor.parentColumnName && locale && slug && title) {
        await tx
          .insert(descriptor.translationTable)
          .values({
            [descriptor.parentColumnName]: id,
            locale,
            slug,
            title,
            subtitle,
            body,
            ...entityPayload
          })
          .onConflictDoUpdate({
            target: [descriptor.translationTable[descriptor.parentColumnName], descriptor.translationTable.locale],
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
              names: processedData[key]
            });
          }
        }
      }

      const updatedEntity = await tx.query[descriptor.mainTable.name]?.findFirst({
        where: eq(descriptor.mainTable.id, id)
      });

      if (descriptor.hooks?.afterUpdate) {
        await descriptor.hooks.afterUpdate(tx, updatedEntity, processedData);
      }

      return updatedEntity;
    }
  };
}
