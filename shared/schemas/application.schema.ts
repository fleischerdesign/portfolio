import { z } from 'zod';

export const addressBaseSchema = z.object({
  name: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactPosition: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  street: z.string(),
  houseNumber: z.string(),
  zipcode: z.number().int().positive(),
  city: z.string(),
});

export const companyBaseSchema = z.object({
  name: z.string(),
  address: addressBaseSchema.optional(),
});

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
  interviews: z.array(interviewBaseSchema).optional().default([]),
  notes: z.array(z.string()).optional().default([]),
  body: z.string().optional().nullable(),
  company: companyBaseSchema,
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  pdfGeneratedAt: z.string().datetime().optional().nullable(),
});

export const applicationCreateSchema = applicationBaseSchema.pick({
  slug: true,
  title: true,
  subtitle: true,
  url: true,
  interviews: true,
  company: true,
  notes: true,
  body: true,
});

export const applicationUpdateSchema = applicationCreateSchema.partial();

export const applicationHistoryCreateSchema = applicationHistoryBaseSchema.pick({
  status: true,
  notes: true,
  createdAt: true,
});

export const applicationHistoryUpdateSchema = applicationHistoryCreateSchema.partial().extend({
  createdAt: z.string().datetime().optional(),
});

export const applicationResponseSchema = applicationBaseSchema.extend({
  currentStatus: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  histories: z.array(applicationHistoryBaseSchema),
});

export type AddressPayload = z.infer<typeof addressBaseSchema>;
export type CompanyPayload = z.infer<typeof companyBaseSchema>;
export type InterviewPayload = z.infer<typeof interviewBaseSchema>;
export type ApplicationHistoryPayload = z.infer<typeof applicationHistoryBaseSchema>;
export type ApplicationPayload = z.infer<typeof applicationBaseSchema>;

export type ApplicationCreatePayload = z.infer<typeof applicationCreateSchema>;
export type ApplicationUpdatePayload = z.infer<typeof applicationUpdateSchema>;
export type ApplicationHistoryCreatePayload = z.infer<typeof applicationHistoryCreateSchema>;
export type ApplicationHistoryUpdatePayload = z.infer<typeof applicationHistoryUpdateSchema>;

export type ApplicationResponsePayload = z.infer<typeof applicationResponseSchema>;