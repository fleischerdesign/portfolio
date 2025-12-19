import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

// Addresses Table
export const addresses = sqliteTable('addresses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'), // e.g., "Company Headquarters"
  contactName: text('contact_name'),
  contactPosition: text('contact_position'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  street: text('street'),
  houseNumber: text('house_number'),
  zipcode: integer('zipcode'), // Assuming zipcode can be stored as integer, convert if needed
  city: text('city'),
});

// Companies Table
export const companies = sqliteTable('companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  addressId: integer('address_id').references(() => addresses.id), // Foreign key to addresses
}, (table) => {
  return {
    nameIdx: uniqueIndex('name_idx').on(table.name), // Ensure company names are unique
  };
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
  address: one(addresses, {
    fields: [companies.addressId],
    references: [addresses.id],
  }),
  applications: many(applications),
}));

// Applications Table
export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyId: integer('company_id').references(() => companies.id).notNull(), // Foreign key to companies
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  slug: text('slug').notNull().unique(), // Slug should be unique
  url: text('url'), // Link to application
  applicationDate: integer('application_date', { mode: 'timestamp' }),
  responseDate: integer('response_date', { mode: 'timestamp' }),
  status: text('status', { enum: ['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'] }).default('draft').notNull(),
  notes: text('notes', { mode: 'json' }).$type<string[]>().default('[]'), // Storing array of strings as JSON
  body: text('body'), // To store the cover letter / main content
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
});

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  interviews: many(interviews),
}));

// Interviews Table
export const interviews = sqliteTable('interviews', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  applicationId: integer('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  notes: text('notes'),
});

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
}));

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  authProviderId: text('auth_provider_id').notNull().unique(), // ID from Authentik
  email: text('email').notNull().unique(),
  name: text('name'),
  // other fields you might want to store
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});
