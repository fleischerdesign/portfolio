import { z } from 'zod';

export const contactBaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  salutation: z.enum(['male', 'female', 'diverse', 'neutral']).nullable(),
  position: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  companyId: z.number().nullable(),
});

export const contactCreateSchema = contactBaseSchema.omit({ id: true });
export const contactUpdateSchema = contactCreateSchema.partial();

export const contactResponseSchema = contactBaseSchema.extend({
  company: z.object({
    name: z.string(),
  }).nullable().optional(),
});

export type Contact = z.infer<typeof contactBaseSchema>;
export type ContactCreate = z.infer<typeof contactCreateSchema>;
export type ContactUpdate = z.infer<typeof contactUpdateSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
