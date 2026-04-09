import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { contacts } from '~~/server/db/schema';

/**
 * @schema contactBaseSchema
 */
export const contactBaseSchema = createSelectSchema(contacts, {
  name: (s) => s.min(1, 'Name is required'),
});

/**
 * @schema contactCreateSchema
 */
export const contactCreateSchema = createInsertSchema(contacts, {
  name: (s) => s.min(1, 'Name is required'),
});

export const contactUpdateSchema = contactCreateSchema.partial();

/**
 * @schema contactResponseSchema
 */
export const contactResponseSchema = contactBaseSchema.extend({
  company: z.object({
    name: z.string(),
  }).nullable().optional(),
});

export type Contact = z.infer<typeof contactBaseSchema>;
export type ContactCreate = z.infer<typeof contactCreateSchema>;
export type ContactUpdate = z.infer<typeof contactUpdateSchema>;
export type ContactResponse = z.infer<typeof contactResponseSchema>;
