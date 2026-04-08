import { createError } from "h3";
import { documents, applications_to_documents } from "~~/server/db/schema";
import type {
  DocumentCreatePayload,
  DocumentUpdatePayload,
} from "~~/shared/schemas/document.schema";
import { eq, desc } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { createLogger } from "../utils/logger";

const logger = createLogger("document");

type DocumentRow = typeof documents.$inferSelect;
type ApplicationDocumentRow = typeof applications_to_documents.$inferSelect & {
  document: DocumentRow;
};

export const documentService = {
  async getAll(): Promise<DocumentRow[]> {
    logger.info("getAll", "Fetching all documents");
    return await db.query.documents.findMany({
      orderBy: [documents.sortOrder, desc(documents.createdAt)],
    });
  },

  async getById(id: number): Promise<DocumentRow | null> {
    logger.info("getById", `Fetching document by id: ${id}`, { id });
    const document = await db.query.documents.findFirst({
      where: eq(documents.id, id),
    });
    if (!document) {
      logger.warn("getById", `Document not found: ${id}`, { id });
      throw createError({
        statusCode: 404,
        statusMessage: `Document with id ${id} not found`,
      });
    }
    return document;
  },

  async reorder(documentIds: number[]) {
    logger.info("reorder", `Reordering documents`, { documentIds });
    return await db.transaction(async (tx) => {
      for (let i = 0; i < documentIds.length; i++) {
        await tx
          .update(documents)
          .set({ sortOrder: i })
          .where(eq(documents.id, documentIds[i]!));
      }
    });
  },

  async create(data: DocumentCreatePayload): Promise<DocumentRow> {
    logger.info("create", `Creating document`, { name: data.name });
    const [newDoc] = await db
      .insert(documents)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();
    if (!newDoc) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create document",
      });
    }
    return newDoc;
  },

  async update(id: number, data: DocumentUpdatePayload): Promise<DocumentRow> {
    logger.info("update", `Updating document: ${id}`, { id, data });
    const [updated] = await db
      .update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    if (!updated) {
      logger.warn("update", `Document not found: ${id}`, { id });
      throw createError({
        statusCode: 404,
        statusMessage: `Document with id ${id} not found`,
      });
    }
    return updated;
  },

  async delete(id: number): Promise<DocumentRow | null> {
    logger.info("delete", `Deleting document: ${id}`, { id });
    const document = await this.getById(id);
    if (!document) {
      return null;
    }

    const [deleted] = await db
      .delete(documents)
      .where(eq(documents.id, id))
      .returning();

    const filePath = path.join(
      process.cwd(),
      ".data",
      "uploads",
      "documents",
      document.filename,
    );
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        logger.info("delete", `Deleted file: ${filePath}`);
      } catch (err) {
        logger.error("delete", `Failed to delete document file: ${filePath}`, {
          error: err,
        });
      }
    }

    if (!deleted) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to delete document",
      });
    }

    return deleted;
  },

  async getForApplication(
    applicationId: number,
  ): Promise<ApplicationDocumentRow[]> {
    logger.info(
      "getForApplication",
      `Fetching documents for application: ${applicationId}`,
      {
        applicationId,
      },
    );
    const appDocs = await db.query.applications_to_documents.findMany({
      where: eq(applications_to_documents.applicationId, applicationId),
      with: {
        document: true,
      },
      orderBy: [applications_to_documents.sortOrder],
    });
    return appDocs;
  },

  async getForApplicationWithFallback(
    applicationId: number,
  ): Promise<ApplicationDocumentRow[]> {
    logger.info(
      "getForApplicationWithFallback",
      `Fetching documents for application with fallback: ${applicationId}`,
      { applicationId },
    );
    const appDocs = await this.getForApplication(applicationId);

    if (appDocs.length > 0) {
      return appDocs;
    }

    const defaults = await this.getDefaultDocuments();
    return defaults.map((doc, index) => ({
      applicationId,
      documentId: doc.id,
      sortOrder: index,
      document: doc,
    }));
  },

  async getDefaultDocuments(): Promise<DocumentRow[]> {
    logger.info("getDefaultDocuments", "Fetching default documents");
    return await db.query.documents.findMany({
      where: eq(documents.isDefault, true),
      orderBy: [documents.sortOrder, desc(documents.createdAt)],
    });
  },

  async syncApplicationDocuments(applicationId: number, documentIds: number[]) {
    logger.info(
      "syncApplicationDocuments",
      `Syncing documents for application: ${applicationId}`,
      {
        applicationId,
        documentIds,
      },
    );
    return await db.transaction(async (tx) => {
      await tx
        .delete(applications_to_documents)
        .where(eq(applications_to_documents.applicationId, applicationId));

      if (documentIds.length > 0) {
        await tx.insert(applications_to_documents).values(
          documentIds.map((docId, index) => ({
            applicationId,
            documentId: docId,
            sortOrder: index,
          })),
        );
      }
    });
  },
};
