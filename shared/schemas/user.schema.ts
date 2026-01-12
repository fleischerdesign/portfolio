import { z } from 'zod';

const i18nSchema = z.object({
  de: z.string(),
  en: z.string(),
});

export const dbUserSchema = z.object({
  id: z.number().int().positive().optional(),
  authProviderId: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  role: z.enum(['admin', 'user']).default('user'),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  
  // Personal Info
  birthday: z.coerce.date().optional().nullable(),
  birthLocation: z.string().optional().nullable(),

  // Address
  street: z.string().optional().nullable(),
  houseNumber: z.string().optional().nullable(),
  zipcode: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  country: i18nSchema.optional().nullable(),

  // Translatable Meta
  maritalStatus: i18nSchema.optional().nullable(),
  driversLicense: i18nSchema.optional().nullable(),
  availabilityStatus: i18nSchema.optional().nullable(),
  summary: i18nSchema.optional().nullable(),

  createdAt: z.date().nullable().optional(),
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