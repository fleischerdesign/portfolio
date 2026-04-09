import { z } from 'zod';
import { addressSchema } from './address.schema';

// Extend the common address schema for the DB entity which has ID and Name
export const addressBaseSchema = addressSchema.extend({
  id: z.number().optional(),
  name: z.string().trim().optional().nullable(),
});

export const companyBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().trim().min(1, 'Name is required'),
  addressId: z.number().optional().nullable(),
});

export const companyCreateSchema = companyBaseSchema.omit({ id: true }).extend({
  address: addressBaseSchema.optional(),
});
export const companyUpdateSchema = companyCreateSchema.partial();

// Response schema for when company is fetched with its address
export const companyResponseSchema = companyBaseSchema.extend({
  address: addressBaseSchema.optional().nullable(),
});

export type Address = z.infer<typeof addressBaseSchema>;
export type Company = z.infer<typeof companyBaseSchema>;
export type CompanyCreate = z.infer<typeof companyCreateSchema>;
export type CompanyUpdate = z.infer<typeof companyUpdateSchema>;
export type CompanyResponse = z.infer<typeof companyResponseSchema>;

