import { documents, applications_to_documents } from '~~/server/db/schema';
import type { DocumentPayload, DocumentCreatePayload, DocumentUpdatePayload } from '~~/shared/schemas/document.schema';
import { eq, desc, and } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export const documentService = {
  async getAll(): Promise<DocumentPayload[]> {
    return await db.query.documents.findMany({
      orderBy: [desc(documents.createdAt)],
    });
  },

  async getById(id: number): Promise<DocumentPayload | null> {
    const document = await db.query.documents.findFirst({
      where: eq(documents.id, id),
    });
    return document || null;
  },

  async create(data: DocumentCreatePayload) {
    const [newDoc] = await db.insert(documents).values({
      ...data,
      createdAt: new Date(),
    }).returning();
    return newDoc;
  },

  async update(id: number, data: DocumentUpdatePayload) {
    const [updated] = await db.update(documents)
      .set(data)
      .where(eq(documents.id, id))
      .returning();
    return updated;
  },

  async delete(id: number) {
    const document = await this.getById(id);
    if (!document) return null;

    // Delete from database
    const [deleted] = await db.delete(documents).where(eq(documents.id, id)).returning();

    // Delete file from disk
    const filePath = path.join(process.cwd(), '.data', 'uploads', 'documents', document.filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete document file: ${filePath}`, err);
      }
    }

    return deleted;
  },

  async getForApplication(applicationId: number) {
    const appDocs = await db.query.applications_to_documents.findMany({
      where: eq(applications_to_documents.applicationId, applicationId),
      with: {
        document: true,
      },
      orderBy: [applications_to_documents.sortOrder],
    });
    return appDocs;
  },

  async getForApplicationWithFallback(applicationId: number) {
    const appDocs = await this.getForApplication(applicationId);
    
    if (appDocs.length > 0) {
      return appDocs;
    }

    // Fallback to defaults
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
      orderBy: [documents.id], // Just a fallback order
    });
  },

  async syncApplicationDocuments(applicationId: number, documentIds: number[]) {
    return await db.transaction(async (tx) => {
      // Remove current associations
      await tx.delete(applications_to_documents).where(eq(applications_to_documents.applicationId, applicationId));

      // Add new associations with order
      if (documentIds.length > 0) {
        await tx.insert(applications_to_documents).values(
          documentIds.map((docId, index) => ({
            applicationId,
            documentId: docId,
            sortOrder: index,
          }))
        );
      }
    });
  }
};
