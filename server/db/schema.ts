import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const addresses = sqliteTable('addresses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  contactName: text('contact_name'),
  contactPosition: text('contact_position'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  street: text('street'),
  houseNumber: text('house_number'),
  zipcode: integer('zipcode'),
  city: text('city'),
});

export const companies = sqliteTable('companies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  addressId: integer('address_id').references(() => addresses.id),
}, (table) => {
  return {
    nameIdx: uniqueIndex('name_idx').on(table.name),
  };
});

export const companiesRelations = relations(companies, ({ one, many }) => ({
  address: one(addresses, {
    fields: [companies.addressId],
    references: [addresses.id],
  }),
  applications: many(applications),
}));

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  slug: text('slug').notNull().unique(),
  url: text('url'),
  applicationDate: integer('application_date', { mode: 'timestamp' }),
  responseDate: integer('response_date', { mode: 'timestamp' }),
  status: text('status', { enum: ['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'] }).default('draft').notNull(),
  notes: text('notes', { mode: 'json' }).$type<string[]>().default('[]'), // Storing array of strings as JSON
  body: text('body'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
  pdfGeneratedAt: integer('pdf_generated_at', { mode: 'timestamp' }),
});

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  interviews: many(interviews),
}));

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
  authProviderId: text('auth_provider_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
}));

export const apiKeys = sqliteTable('api_keys', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  keyHash: text('key_hash').notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
});

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));
