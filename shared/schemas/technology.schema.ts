import { z } from 'zod';

/**
 * @schema technologySchema
 * @description Shared schema for technical stack items.
 */
export const technologySchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
});

export type Technology = z.infer<typeof technologySchema>;
