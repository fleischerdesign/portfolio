import { z } from 'zod';

export const dbUserSchema = z.object({
  id: z.number().int().positive().optional(),
  authProviderId: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  role: z.enum(['admin', 'user']).default('user'), // Added role property
  createdAt: z.date().nullable().optional(),
});

// Type for the user as retrieved from or inserted into the database
export type DbUser = z.infer<typeof dbUserSchema>;

// Schema for the user data we typically store in the session
// This is a subset of the full DbUser
export const sessionUserSchema = z.object({
  id: z.number().int().positive(), // ID must be present in session
  email: z.string().email(),
  name: z.string().optional().nullable(),
  role: z.enum(['admin', 'user']),
});

// Type for the user as stored in the session and used in composables/abilities
export type SessionUser = z.infer<typeof sessionUserSchema>;

// Schema for updating user properties via API
export const updateUserSchema = dbUserSchema.omit({
  id: true,
  authProviderId: true,
  createdAt: true,
}).partial();