import { z } from 'zod';

export const dbUserSchema = z.object({
  id: z.number().int().positive().optional(),
  authProviderId: z.string(),
  email: z.string().email(),
  name: z.string().optional().nullable(),
  role: z.enum(['admin', 'user']).default('user'),
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

export const updateUserSchema = dbUserSchema.omit({
  id: true,
  authProviderId: true,
  createdAt: true,
}).partial();