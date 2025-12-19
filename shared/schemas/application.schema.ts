import { z } from 'zod';

export const addressApiSchema = z.object({
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

export const companyApiSchema = z.object({
  name: z.string(),
  address: addressApiSchema.optional(),
});

export const interviewApiSchema = z.object({
  date: z.string().datetime(),
  notes: z.string().optional().nullable(),
});

export const applicationApiSchema = z.object({
  slug: z.string(),
  title: z.string(),
  subtitle: z.string().optional().nullable(),
  url: z.string().url().optional().nullable(),
  applicationDate: z.string().datetime().optional().nullable(),
  responseDate: z.string().datetime().optional().nullable(),
  interviews: z.array(interviewApiSchema).optional().default([]),
  status: z.enum(['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn']),
  company: companyApiSchema,
  notes: z.array(z.string()).optional().default([]),
  body: z.string().optional().nullable(),
});

export type ApplicationApiPayload = z.infer<typeof applicationApiSchema>;
export type CompanyApiPayload = z.infer<typeof companyApiSchema>;
export type AddressApiPayload = z.infer<typeof addressApiSchema>;
export type InterviewApiPayload = z.infer<typeof interviewApiSchema>;
