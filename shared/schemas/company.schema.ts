import { z } from 'zod';

export const addressBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  houseNumber: z.string().optional().nullable(),
  zipcode: z.number().int().positive().optional().nullable(),
  city: z.string().optional().nullable(),
});

export const companyBaseSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  addressId: z.number().optional().nullable(),
});

export const companyCreateSchema = companyBaseSchema.omit({ id: true });
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
