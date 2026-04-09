import type { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { technologies } from '~~/server/db/schema';

/**
 * @schema technologySchema
 * @description Automatically generated from Drizzle schema using drizzle-zod.
 */
export const technologySchema = createSelectSchema(technologies);

export type Technology = z.infer<typeof technologySchema>;
