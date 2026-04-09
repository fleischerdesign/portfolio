import type { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { users } from '~~/server/db/schema';

/**
 * @schema authorSchema
 * @description Automatically generated from Drizzle users schema using drizzle-zod.
 */
export const authorSchema = createSelectSchema(users).pick({
  id: true,
  name: true
});

export type Author = z.infer<typeof authorSchema>;
