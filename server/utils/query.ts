import type { H3Event} from 'h3';
import { getValidatedQuery } from 'h3';
import { z } from 'zod';
import { LOCALES } from '~~/shared/utils/locales';

const publicQuerySchema = z.object({
  locale: z.enum(LOCALES).catch('de'),
  limit: z.coerce.number().int().positive().optional()
});

export const getPublicQuery = (event: H3Event) => getValidatedQuery(event, publicQuerySchema.parse);

const studioQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional()
});

export const getStudioQuery = (event: H3Event) => getValidatedQuery(event, studioQuerySchema.parse);