import { z } from 'zod';

/**
 * @schema tagSchema
 * @description Shared schema for content tags.
 */
export const tagSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export type Tag = z.infer<typeof tagSchema>;
