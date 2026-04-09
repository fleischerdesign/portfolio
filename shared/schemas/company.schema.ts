import { z } from 'zod';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { companies, addresses } from '~~/server/db/schema';
import { addressSchema } from './address.schema';

/**
 * @schema addressBaseSchema
 */
export const addressBaseSchema = createSelectSchema(addresses);

/**
 * @schema companyBaseSchema
 */
export const companyBaseSchema = createSelectSchema(companies);

/**
 * @schema companyCreateSchema
 */
export const companyCreateSchema = createInsertSchema(companies)
.extend({
  address: addressSchema.optional(),
  contactIds: z.array(z.number()).optional().default([]),
});

export const companyUpdateSchema = companyCreateSchema.partial();

/**
 * @schema companyResponseSchema
 */
export const companyResponseSchema = companyBaseSchema.extend({
  address: addressBaseSchema.nullable().optional(),
  contacts: z.array(z.any()).optional(), // Contacts are usually fetched separately or via relations
});

export type Address = z.infer<typeof addressBaseSchema>;
export type Company = z.infer<typeof companyBaseSchema>;
export type CompanyCreate = z.infer<typeof companyCreateSchema>;
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;
export type CompanyResponse = z.infer<typeof companyResponseSchema>;
