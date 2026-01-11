import { H3Event, getValidatedQuery } from 'h3';
import { z } from 'zod';

const publicQuerySchema = z.object({
  locale: z.enum(['de', 'en']).catch('de'),
  limit: z.coerce.number().int().positive().optional()
});

export const getPublicQuery = (event: H3Event) => getValidatedQuery(event, publicQuerySchema.parse);

const studioQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional()
});

export const getStudioQuery = (event: H3Event) => getValidatedQuery(event, studioQuerySchema.parse);