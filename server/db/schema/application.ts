import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const addresses = sqliteTable("addresses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  street: text("street"),
  houseNumber: text("house_number"),
  zipcode: text("zipcode"),
  city: text("city"),
});

export const companies = sqliteTable(
  "companies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    addressId: integer("address_id").references(() => addresses.id),
  },
  (table) => ({
    nameIdx: uniqueIndex("name_idx").on(table.name),
  }),
);

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  salutation: text("salutation", {
    enum: ["male", "female", "diverse", "neutral"],
  }),
  position: text("position"),
  email: text("email"),
  phone: text("phone"),
  companyId: integer("company_id").references(() => companies.id),
});

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  companyId: integer("company_id")
    .references(() => companies.id)
    .notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  slug: text("slug").notNull().unique(),
  url: text("url"),
  notes: text("notes", { mode: "json" })
    .$type<string[]>()
    .default(sql`'[]'`),
  body: text("body"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => sql`(strftime('%s', 'now'))`,
  ),
  pdfGeneratedAt: integer("pdf_generated_at", { mode: "timestamp" }),
});

export const applications_to_contacts = sqliteTable(
  "applications_to_contacts",
  {
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id),
    contactId: integer("contact_id")
      .notNull()
      .references(() => contacts.id),
  },
);

export const applicationHistories = sqliteTable("application_histories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  applicationId: integer("application_id")
    .references(() => applications.id, { onDelete: "cascade" })
    .notNull(),
  status: text("status", {
    enum: ["draft", "applied", "interview", "offer", "rejected", "withdrawn"],
  })
    .default("draft")
    .notNull(),
  notes: text("notes"),
  scheduled_at: integer("scheduled_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  filename: text("filename").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isDefault: integer("is_default", { mode: "boolean" })
    .default(false)
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const applications_to_documents = sqliteTable(
  "applications_to_documents",
  {
    applicationId: integer("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    documentId: integer("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
);
