import type { z } from 'zod';
import { createSelectSchema } from 'drizzle-zod';
import { tags } from '~~/server/db/schema';

/**
 * @schema tagSchema
 * @description Automatically generated from Drizzle schema using drizzle-zod.
 */
export const tagSchema = createSelectSchema(tags);

export type Tag = z.infer<typeof tagSchema>;
