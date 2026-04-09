import { z } from 'zod';

/**
 * @schema dateSchema
 * @description Absolute base schema for date coercion.
 */
export const dateSchema = z.coerce.date().nullable();
