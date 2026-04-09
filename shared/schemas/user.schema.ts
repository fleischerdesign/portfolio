import { z } from 'zod';
import { i18nSchema } from './i18n.schema';
import { addressSchema } from './address.schema';
import { dateSchema } from './date.schema';

export const dbUserSchema = z.object({
  id: z.number().int().positive().optional(),
  authProviderId: z.string().trim(),
  email: z.string().trim().email(),
  name: z.string().trim().optional().nullable(),
  role: z.enum(['admin', 'user']).default('user'),
  phone: z.string().trim().optional().nullable(),
  website: z.string().trim().optional().nullable(),
  github: z.string().trim().optional().nullable(),
  linkedin: z.string().trim().optional().nullable(),
  instagram: z.string().trim().optional().nullable(),
  
  // Personal Info
  birthday: dateSchema,
  birthLocation: z.string().trim().optional().nullable(),

  // Address - flattened in DB but logical group
  street: addressSchema.shape.street,
  houseNumber: addressSchema.shape.houseNumber,
  zipcode: addressSchema.shape.zipcode,
  city: addressSchema.shape.city,
  country: addressSchema.shape.country,

  // Translatable Meta
  maritalStatus: i18nSchema.optional().nullable(),
  driversLicense: i18nSchema.optional().nullable(),
  availabilityStatus: i18nSchema.optional().nullable(),
  summary: i18nSchema.optional().nullable(),

  createdAt: dateSchema,
});

export type DbUser = z.infer<typeof dbUserSchema>;

// Schema for the user data we typically store in the session
// This is a subset of the full DbUser
export const sessionUserSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  role: z.enum(['admin', 'user']),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

// Schema for public profile data (safe to expose)
export const publicUserSchema = dbUserSchema.pick({
  name: true,
  email: true,
  phone: true,
  website: true,
  github: true,
  linkedin: true,
  instagram: true,
  birthday: true,
  birthLocation: true,
  street: true,
  houseNumber: true,
  zipcode: true,
  city: true,
  country: true,
  maritalStatus: true,
  driversLicense: true,
  availabilityStatus: true,
  summary: true,
});

export type PublicUser = z.infer<typeof publicUserSchema>;

export const updateUserSchema = dbUserSchema.omit({
  id: true,
  authProviderId: true,
  createdAt: true,
}).partial();