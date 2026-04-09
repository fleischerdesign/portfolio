import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { applications, applicationHistories } from "~~/server/db/schema";
import { companyResponseSchema } from "./company.schema";
import { contactBaseSchema } from "./contact.schema";
import { addressSchema } from "./address.schema";
import { dateSchema } from "./date.schema";
import { applicationDocumentSchema } from "./document.schema";

/**
 * @schema applicationBaseSchema
 * @description Base selection schema with in-place date coercion.
 */
export const applicationBaseSchema = createSelectSchema(applications, {
  createdAt: dateSchema,
  updatedAt: dateSchema,
  pdfGeneratedAt: dateSchema,
});

/**
 * @schema applicationHistoryBaseSchema
 */
export const applicationHistoryBaseSchema = createSelectSchema(applicationHistories, {
  scheduled_at: dateSchema,
  createdAt: dateSchema,
});

/**
 * @schema applicationCreateSchema
 * @description Refined insert schema using Drizzle-Zod overrides.
 */
export const applicationCreateSchema = createInsertSchema(applications, {
  createdAt: dateSchema,
  updatedAt: dateSchema,
  pdfGeneratedAt: dateSchema,
}).extend({
  companyName: z.string().trim().optional(),
  companyAddress: addressSchema.optional(),
  contactIds: z.array(z.number()).optional().default([]),
});

export const applicationUpdateSchema = applicationCreateSchema.partial().extend({
  histories: z.array(applicationHistoryBaseSchema).optional(),
});

export const applicationHistoryCreateSchema = createInsertSchema(applicationHistories, {
  scheduled_at: dateSchema,
  createdAt: dateSchema,
});

// --- Relation Mapping (Clean Composition) ---

const applicationRelations = {
  company: companyResponseSchema,
  contacts: z.array(z.object({ contact: contactBaseSchema })),
  documents: z.array(applicationDocumentSchema).optional().default([]),
  histories: z.array(applicationHistoryBaseSchema),
};

/**
 * @schema applicationResponseSchema
 * @description The final API response shape. No 'any' needed as Zod infers the merged shape.
 */
export const applicationResponseSchema = applicationBaseSchema
  .extend(applicationRelations)
  .extend({
    currentStatus: z.string().optional(),
  })
  .transform((val) => {
    // val is now perfectly typed as the intersection of all extended schemas
    const histories = val.histories || [];
    const sortedHistories = [...histories].sort(
      (a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0),
    );
    
    const latestHistory = sortedHistories[sortedHistories.length - 1];
    
    return {
      ...val,
      currentStatus: latestHistory?.status ?? "draft",
      contacts: val.contacts?.map((c) => c.contact) ?? [],
    };
  });

// --- Types ---

export type ApplicationHistoryPayload = z.infer<typeof applicationHistoryBaseSchema>;
export type ApplicationPayload = z.infer<typeof applicationBaseSchema>;
export type ApplicationCreatePayload = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdatePayload = z.infer<typeof applicationUpdateSchema>;
export type ApplicationHistoryCreatePayload = z.infer<typeof applicationHistoryCreateSchema>;
export type ApplicationResponsePayload = z.infer<typeof applicationResponseSchema>;
export type Status = ApplicationHistoryPayload["status"];
