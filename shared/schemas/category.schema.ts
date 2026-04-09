import type { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { categories } from '~~/server/db/schema';

/**
 * @schema categorySchema
 * @description Automatically generated from Drizzle schema using drizzle-zod.
 */
export const categorySchema = createSelectSchema(categories);

export type Category = z.infer<typeof categorySchema>;
