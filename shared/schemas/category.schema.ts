import { z } from 'zod';

/**
 * @schema categorySchema
 * @description Shared schema for content categories.
 */
export const categorySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export type Category = z.infer<typeof categorySchema>;
