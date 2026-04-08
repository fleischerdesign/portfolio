import { z } from "zod";
import { companyResponseSchema } from "./company.schema";
import { contactBaseSchema } from "./contact.schema";
import { addressSchema } from "./common.schema";
import { applicationDocumentSchema } from "./document.schema";
import { APPLICATION_STATUS } from "../types/application/status";

export const applicationHistoryBaseSchema = z.object({
  id: z.number().optional(),
  status: z.enum(APPLICATION_STATUS),
  notes: z.string().optional().nullable(),
  scheduled_at: z.date().optional().nullable(),
  createdAt: z.date().optional(),
});

export const applicationBaseSchema = z.object({
  id: z.number().optional(),
  slug: z.string().trim(),
  title: z.string().trim(),
  subtitle: z.string().trim().optional().nullable(),
  url: z.string().trim().url().optional().nullable(),
  companyId: z.number(),
  contactIds: z.array(z.number()).optional().default([]),
  notes: z.array(z.string()).optional().default([]),
  body: z.string().optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  pdfGeneratedAt: z.date().optional().nullable(),
});

export const applicationCreateSchema = applicationBaseSchema
  .omit({
    id: true,
    companyId: true,
  })
  .extend({
    companyId: z.number().nullable(),
    companyName: z.string().trim().optional(),
    companyAddress: addressSchema.optional(),
  });

export const applicationUpdateSchema = applicationBaseSchema.partial().extend({
  companyName: z.string().trim().optional(),
  companyAddress: addressSchema.partial().optional(),
  histories: z.array(applicationHistoryBaseSchema).optional(),
});

export const applicationHistoryCreateSchema = applicationHistoryBaseSchema
  .pick({
    status: true,
    notes: true,
    scheduled_at: true,
    createdAt: true,
  })
  .extend({
    scheduled_at: z.coerce.date().optional().nullable(),
    createdAt: z.coerce.date().optional(),
  });

export const applicationHistoryUpdateSchema = applicationHistoryCreateSchema
  .partial()
  .extend({
    createdAt: z.coerce.date().optional(),
  });

// Raw database relation shapes (before transformation)
const applicationRawRelations = z.object({
  company: companyResponseSchema,
  contacts: z.array(z.object({ contact: contactBaseSchema })),
  documents: z.array(applicationDocumentSchema).optional().default([]),
  histories: z.array(applicationHistoryBaseSchema),
});

export const applicationResponseSchema = applicationBaseSchema
  .extend(applicationRawRelations.shape)
  .extend({
    currentStatus: z.enum(APPLICATION_STATUS).optional(),
  })
  .transform((val) => {
    const sortedHistories = [...(val.histories ?? [])].sort(
      (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0),
    );
    const latestHistory = sortedHistories[sortedHistories.length - 1];
    const resolvedCurrentStatus = latestHistory?.status ?? "draft";

    return {
      id: val.id,
      slug: val.slug,
      title: val.title,
      subtitle: val.subtitle,
      url: val.url,
      companyId: val.companyId,
      contactIds: val.contactIds,
      notes: val.notes,
      body: val.body,
      createdAt: val.createdAt,
      updatedAt: val.updatedAt,
      pdfGeneratedAt: val.pdfGeneratedAt,
      currentStatus: resolvedCurrentStatus,
      histories: val.histories ?? [],
      company: val.company,
      contacts: val.contacts?.map((c) => c.contact) ?? [],
      documents: val.documents ?? [],
    };
  });

// Removed InterviewPayload
export type ApplicationHistoryPayload = z.infer<
  typeof applicationHistoryBaseSchema
>;
export type ApplicationPayload = z.infer<typeof applicationBaseSchema>;

export type ApplicationCreatePayload = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdatePayload = z.infer<typeof applicationUpdateSchema>;
export type ApplicationHistoryCreatePayload = z.infer<
  typeof applicationHistoryCreateSchema
>;
export type ApplicationHistoryUpdatePayload = z.infer<
  typeof applicationHistoryUpdateSchema
>;

export type ApplicationResponsePayload = z.infer<
  typeof applicationResponseSchema
>;
export type Status = ApplicationHistoryPayload["status"];
