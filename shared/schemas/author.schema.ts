import { z } from 'zod';

/**
 * @schema authorSchema
 * @description Shared schema for entity authors.
 */
export const authorSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
});

export type Author = z.infer<typeof authorSchema>;
