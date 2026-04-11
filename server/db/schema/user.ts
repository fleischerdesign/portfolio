import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  authProviderId: text("auth_provider_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  role: text("role", { enum: ["admin", "user"] })
    .default("user")
    .notNull(),
  phone: text("phone"),
  website: text("website"),
  github: text("github"),
  linkedin: text("linkedin"),
  instagram: text("instagram"),

  birthday: integer("birthday", { mode: "timestamp" }),
  birthLocation: text("birth_location"),

  street: text("street"),
  houseNumber: text("house_number"),
  zipcode: text("zipcode"),
  city: text("city"),
  country: text("country", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),

  maritalStatus: text("marital_status", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),
  driversLicense: text("drivers_license", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),
  availabilityStatus: text("availability_status", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),
  summary: text("summary", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const apiKeys = sqliteTable("api_keys", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull().unique(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  lastUsedAt: integer("last_used_at", { mode: "timestamp" }),
});
