import { z } from 'zod';
import { companyResponseSchema, type CompanyResponse } from './company.schema';
import { contactBaseSchema, type Contact } from './contact.schema';

export const interviewBaseSchema = z.object({
  date: z.string().datetime(),
  notes: z.string().optional().nullable(),
});

export const applicationHistoryBaseSchema = z.object({
  id: z.number().optional(),
  status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  notes: z.string().optional().nullable(),
  createdAt: z.string().datetime().optional(),
});

export const applicationBaseSchema = z.object({
  id: z.number().optional(),
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  companyId: z.number(), // Reference to company
  contactIds: z.array(z.number()).optional().default([]), // References to contacts
  interviews: z.array(interviewBaseSchema).optional().default([]),
  notes: z.array(z.string()).optional().default([]),
  body: z.string().optional().nullable(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  pdfGeneratedAt: z.string().datetime().optional().nullable(),
});

export const applicationCreateSchema = applicationBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  pdfGeneratedAt: true,
}).extend({
  companyName: z.string(), // For creating a new company on the fly
  companyAddress: z.object({
    street: z.string(),
    houseNumber: z.string(),
    zipcode: z.number().int().positive(),
    city: z.string(),
  }).optional(),
});

export const applicationUpdateSchema = applicationBaseSchema.partial().extend({
  companyName: z.string().optional(),
  companyAddress: z.object({
    street: z.string(),
    houseNumber: z.string(),
    zipcode: z.number().int().positive(),
    city: z.string(),
  }).partial().optional(),
});


export const applicationHistoryCreateSchema = applicationHistoryBaseSchema.pick({
  status: true,
  notes: true,
  createdAt: true,
});

export const applicationHistoryUpdateSchema = applicationHistoryCreateSchema.partial().extend({
  createdAt: z.preprocess((arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()).optional(),
});

export const applicationResponseSchema = applicationBaseSchema.extend({
  currentStatus: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  histories: z.array(applicationHistoryBaseSchema),
  company: companyResponseSchema, // Full company object
  contacts: z.array(contactBaseSchema), // Full contact objects
});

export type InterviewPayload = z.infer<typeof interviewBaseSchema>;
export type ApplicationHistoryPayload = z.infer<typeof applicationHistoryBaseSchema>;
export type ApplicationPayload = z.infer<typeof applicationBaseSchema>;

export type ApplicationCreatePayload = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdatePayload = z.infer<typeof applicationUpdateSchema>;
export type ApplicationHistoryCreatePayload = z.infer<typeof applicationHistoryCreateSchema>;
export type ApplicationHistoryUpdatePayload = z.infer<typeof applicationHistoryUpdateSchema>;

export type ApplicationResponsePayload = z.infer<typeof applicationResponseSchema>;