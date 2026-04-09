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
import { createEntityService, type EntityDescriptor } from "../utils/db.engine";

const logger = createLogger("document");

const documentDescriptor: EntityDescriptor<
  typeof documents,
  DocumentCreatePayload
> = {
  mainTable: documents,
};

const engine = createEntityService(documentDescriptor);

export const documentService = {
  ...engine,

  async getAll() {
    logger.info("getAll", "Fetching all documents");
    return await db.query.documents.findMany({
      orderBy: [documents.sortOrder, desc(documents.createdAt)],
    });
  },

  async getById(id: number) {
    const document = await db.query.documents.findFirst({
      where: eq(documents.id, id),
    });
    if (!document)
      throw createError({
        statusCode: 404,
        statusMessage: "Document not found",
      });
    return document;
  },

  async reorder(documentIds: number[]) {
    return await db.transaction(async (tx) => {
      for (let i = 0; i < documentIds.length; i++) {
        await tx
          .update(documents)
          .set({ sortOrder: i })
          .where(eq(documents.id, documentIds[i]!));
      }
    });
  },

  async create(data: DocumentCreatePayload) {
    return await db.transaction(async (tx) => {
      return await engine.create(tx, data);
    });
  },

  async update(id: number, data: DocumentUpdatePayload) {
    return await db.transaction(async (tx) => {
      return await engine.update(tx, id, data);
    });
  },

  async delete(id: number) {
    const document = await this.getById(id);
    const result = await db.transaction(async (tx) => {
      const [deleted] = await tx
        .delete(documents)
        .where(eq(documents.id, id))
        .returning();
      return deleted;
    });

    if (result) {
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
        } catch (err) {
          logger.error("delete", `Failed to delete file: ${filePath}`, err);
        }
      }
    }
    return result;
  },

  async getForApplication(applicationId: number) {
    return await db.query.applications_to_documents.findMany({
      where: eq(applications_to_documents.applicationId, applicationId),
      with: { document: true },
      orderBy: [applications_to_documents.sortOrder],
    });
  },

  async getForApplicationWithFallback(applicationId: number) {
    const appDocs = await this.getForApplication(applicationId);
    if (appDocs.length > 0) return appDocs;

    const defaults = await this.getDefaultDocuments();
    return defaults.map((doc, index) => ({
      applicationId,
      documentId: doc.id,
      sortOrder: index,
      document: doc,
    }));
  },

  async getDefaultDocuments() {
    return await db.query.documents.findMany({
      where: eq(documents.isDefault, true),
      orderBy: [documents.sortOrder, desc(documents.createdAt)],
    });
  },

  async syncApplicationDocuments(applicationId: number, documentIds: number[]) {
    return await db.transaction(async (tx) => {
      await tx
        .delete(applications_to_documents)
        .where(eq(applications_to_documents.applicationId, applicationId));
      if (documentIds.length > 0) {
        await tx
          .insert(applications_to_documents)
          .values(
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
