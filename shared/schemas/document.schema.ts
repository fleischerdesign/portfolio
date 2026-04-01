import { z } from 'zod';

export const documentBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1),
  filename: z.string(),
  fileType: z.string(),
  fileSize: z.number().optional().nullable(),
  sortOrder: z.number().default(0),
  isDefault: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
});

export const documentCreateSchema = documentBaseSchema.omit({ id: true, createdAt: true });
export const documentUpdateSchema = documentBaseSchema.partial();

export const applicationDocumentSchema = z.object({
  applicationId: z.number(),
  documentId: z.number(),
  sortOrder: z.number().default(0),
  document: documentBaseSchema,
});

export type DocumentPayload = z.infer<typeof documentBaseSchema>;
export type DocumentCreatePayload = z.infer<typeof documentCreateSchema>;
export type DocumentUpdatePayload = z.infer<typeof documentUpdateSchema>;
export type ApplicationDocumentPayload = z.infer<typeof applicationDocumentSchema>;
