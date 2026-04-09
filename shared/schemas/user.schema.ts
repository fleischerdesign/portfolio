import type { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { users } from "~~/server/db/schema";
import { dateSchema } from "./date.schema";

/**
 * @schema dbUserSchema
 * @description Base selection schema for users with date overrides.
 */
export const dbUserSchema = createSelectSchema(users, {
  birthday: dateSchema,
  createdAt: dateSchema,
});

/**
 * @schema publicUserSchema
 */
export const publicUserSchema = dbUserSchema.pick({
  name: true,
  email: true,
  phone: true,
  website: true,
  github: true,
  linkedin: true,
  instagram: true,
  birthday: true,
  birthLocation: true,
  street: true,
  houseNumber: true,
  zipcode: true,
  city: true,
  country: true,
  maritalStatus: true,
  driversLicense: true,
  availabilityStatus: true,
  summary: true,
});

export type PublicUser = z.infer<typeof publicUserSchema>;

/**
 * @schema updateUserSchema
 */
export const updateUserSchema = createInsertSchema(users, {
  birthday: dateSchema,
  createdAt: dateSchema,
})
  .omit({
    id: true,
    authProviderId: true,
    createdAt: true,
  })
  .partial();

export type DbUser = z.infer<typeof dbUserSchema>;
