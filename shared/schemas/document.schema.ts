import type { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { documents, applications_to_documents } from "~~/server/db/schema";
import { dateSchema } from "./date.schema";

/**
 * @schema documentBaseSchema
 */
export const documentBaseSchema = createSelectSchema(documents, {
  createdAt: dateSchema,
});

/**
 * @schema applicationDocumentBaseSchema
 */
export const applicationDocumentBaseSchema = createSelectSchema(
  applications_to_documents,
);

/**
 * @schema documentCreateSchema
 */
export const documentCreateSchema = createInsertSchema(documents, {
  createdAt: dateSchema,
}).omit({
  id: true,
  createdAt: true,
});

export const documentUpdateSchema = documentCreateSchema.partial();

/**
 * @schema applicationDocumentSchema
 */
export const applicationDocumentSchema = applicationDocumentBaseSchema.extend({
  document: documentBaseSchema,
});

export type DocumentPayload = z.infer<typeof documentBaseSchema>;
export type DocumentCreatePayload = z.infer<typeof documentCreateSchema>;
export type DocumentUpdatePayload = z.infer<typeof documentUpdateSchema>;
export type ApplicationDocumentPayload = z.infer<
  typeof applicationDocumentSchema
>;
