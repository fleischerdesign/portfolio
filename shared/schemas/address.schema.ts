import { z } from 'zod';
import { i18nSchema } from './i18n.schema';

/**
 * @schema addressSchema
 * @description Standard schema for physical addresses.
 */
export const addressSchema = z.object({
  street: z.string().trim().optional().nullable(),
  houseNumber: z.string().trim().optional().nullable(),
  zipcode: z.string().trim().optional().nullable(),
  city: z.string().trim().optional().nullable(),
  country: i18nSchema.optional().nullable(),
});

export type Address = z.infer<typeof addressSchema>;
