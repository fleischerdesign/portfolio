import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const addresses = sqliteTable('addresses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  street: text('street'),
  houseNumber: text('house_number'),
  zipcode: text('zipcode'),
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
  contacts: many(contacts),
}));

export const contacts = sqliteTable('contacts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  salutation: text('salutation', { enum: ['male', 'female', 'diverse', 'neutral'] }),
  position: text('position'),
  email: text('email'),
  phone: text('phone'),
  companyId: integer('company_id').references(() => companies.id),
});

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
  applications: many(applications_to_contacts),
}));

export const applications = sqliteTable('applications', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  companyId: integer('company_id').references(() => companies.id).notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  slug: text('slug').notNull().unique(),
  url: text('url'),
  notes: text('notes', { mode: 'json' }).$type<string[]>().default(sql`'[]'`), // Storing array of strings as JSON
  body: text('body'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
  pdfGeneratedAt: integer('pdf_generated_at', { mode: 'timestamp' }),
});

export const applications_to_contacts = sqliteTable('applications_to_contacts', {
  applicationId: integer('application_id').notNull().references(() => applications.id),
  contactId: integer('contact_id').notNull().references(() => contacts.id),
});

export const applicationHistories = sqliteTable('application_histories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  applicationId: integer('application_id').references(() => applications.id, { onDelete: 'cascade' }).notNull(),
  status: text('status', { enum: ['draft', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'] }).default('draft').notNull(),
  notes: text('notes'),
  scheduled_at: integer('scheduled_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  company: one(companies, {
    fields: [applications.companyId],
    references: [companies.id],
  }),
  histories: many(applicationHistories),
  contacts: many(applications_to_contacts),
}));

export const applicationsToContactsRelations = relations(applications_to_contacts, ({ one }) => ({
  application: one(applications, {
    fields: [applications_to_contacts.applicationId],
    references: [applications.id],
  }),
  contact: one(contacts, {
    fields: [applications_to_contacts.contactId],
    references: [contacts.id],
  }),
}));

export const applicationHistoriesRelations = relations(applicationHistories, ({ one }) => ({
  application: one(applications, {
    fields: [applicationHistories.applicationId],
    references: [applications.id],
  }),
}));


export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  authProviderId: text('auth_provider_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name'),
  role: text('role', { enum: ['admin', 'user'] }).default('user').notNull(),
  phone: text('phone'),
  website: text('website'),
  github: text('github'),
  linkedin: text('linkedin'),
  instagram: text('instagram'),

  // Personal Info
  birthday: integer('birthday', { mode: 'timestamp' }),
  birthLocation: text('birth_location'),
  
  // Address
  street: text('street'),
  houseNumber: text('house_number'),
  zipcode: text('zipcode'),
  city: text('city'),
  country: text('country', { mode: 'json' }).$type<{ de: string; en: string }>(),

  // Meta / i18n fields
  maritalStatus: text('marital_status', { mode: 'json' }).$type<{ de: string; en: string }>(),
  driversLicense: text('drivers_license', { mode: 'json' }).$type<{ de: string; en: string }>(),
  availabilityStatus: text('availability_status', { mode: 'json' }).$type<{ de: string; en: string }>(),
  summary: text('summary', { mode: 'json' }).$type<{ de: string; en: string }>(), // Hero summary

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
  courses: many(courses),
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

export const nowEntries = sqliteTable('now_entries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  contentDe: text('content_de').notNull(),
  contentEn: text('content_en').notNull(),
  icon: text('icon'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const courses = sqliteTable('courses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  
  title: text('title', { mode: 'json' }).$type<{ de: string, en: string }>().notNull(),
  organization: text('organization'),
  teachers: text('teachers', { mode: 'json' }).$type<string[]>(),
  
  startedAt: integer('started_at', { mode: 'timestamp' }),
  endedAt: integer('ended_at', { mode: 'timestamp' }),
  
  certificateUrl: text('certificate_url'),
  
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

export const coursesRelations = relations(courses, ({ one }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
}));

// --- Taxonomies ---

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});

export const tags = sqliteTable('tags', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});

export const technologies = sqliteTable('technologies', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
});

// --- Content Entities (Language Neutral) ---

export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  translationKey: text('translation_key').notNull().unique(), // e.g. "clean-code" (helper for migration/admin)
  
  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  
  coverImage: text('cover_image'),
  coverImageAlt: text('cover_image_alt'), // Alt text is technically translatable, but often kept neutral or English for simplicity. Let's keep it here for now.
  
  authorId: integer('author_id').references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
});

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  translationKey: text('translation_key').notNull().unique(),

  status: text('status', { enum: ['draft', 'published', 'archived'] }).default('draft').notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),

  icon: text('icon'),
  coverImage: text('cover_image'),
  coverImageAlt: text('cover_image_alt'),
  
  repoUrl: text('repo_url'),
  projectUrl: text('project_url'),

  authorId: integer('author_id').references(() => users.id),
  categoryId: integer('category_id').references(() => categories.id),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
});

// --- Content Translations ---

export const blogPostTranslations = sqliteTable('blog_post_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  blogPostId: integer('blog_post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  locale: text('locale', { enum: ['de', 'en'] }).notNull(),
  
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  body: text('body').notNull(),
  readingTime: integer('reading_time'), // specific to language

  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
}, (t) => ({
  slugLocaleIdx: uniqueIndex('blog_trans_slug_locale_idx').on(t.slug, t.locale),
  postLocaleIdx: uniqueIndex('blog_trans_post_locale_idx').on(t.blogPostId, t.locale), // One translation per post per language
}));

export const projectTranslations = sqliteTable('project_translations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  locale: text('locale', { enum: ['de', 'en'] }).notNull(),

  slug: text('slug').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  body: text('body').notNull(),

  // These lists contain text, so they belong in translations
  features: text('features', { mode: 'json' }).$type<string[]>(),
  learned: text('learned', { mode: 'json' }).$type<string[]>(),
  challenges: text('challenges', { mode: 'json' }).$type<string[]>(),

  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(() => sql`(strftime('%s', 'now'))`),
}, (t) => ({
  slugLocaleIdx: uniqueIndex('proj_trans_slug_locale_idx').on(t.slug, t.locale),
  projectLocaleIdx: uniqueIndex('proj_trans_proj_locale_idx').on(t.projectId, t.locale),
}));


// --- Junction Tables (Linked to Entities) ---

export const blogPostsToTags = sqliteTable('blog_posts_to_tags', {
  blogPostId: integer('blog_post_id').notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: uniqueIndex('blog_posts_tags_pk').on(t.blogPostId, t.tagId),
}));

export const projectsToTags = sqliteTable('projects_to_tags', {
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: uniqueIndex('projects_tags_pk').on(t.projectId, t.tagId),
}));

export const projectsToTechnologies = sqliteTable('projects_to_technologies', {
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  technologyId: integer('technology_id').notNull().references(() => technologies.id, { onDelete: 'cascade' }),
}, (t) => ({
  pk: uniqueIndex('projects_tech_pk').on(t.projectId, t.technologyId),
}));

// --- Relations ---

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogPosts: many(blogPosts),
  projects: many(projects),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  blogPosts: many(blogPostsToTags),
  projects: many(projectsToTags),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  projects: many(projectsToTechnologies),
}));

export const blogPostsRelations = relations(blogPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [blogPosts.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
  tags: many(blogPostsToTags),
  translations: many(blogPostTranslations),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  author: one(users, {
    fields: [projects.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [projects.categoryId],
    references: [categories.id],
  }),
  tags: many(projectsToTags),
  techstack: many(projectsToTechnologies),
  translations: many(projectTranslations),
}));

export const blogPostTranslationsRelations = relations(blogPostTranslations, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostTranslations.blogPostId],
    references: [blogPosts.id],
  }),
}));

export const projectTranslationsRelations = relations(projectTranslations, ({ one }) => ({
  project: one(projects, {
    fields: [projectTranslations.projectId],
    references: [projects.id],
  }),
}));

export const blogPostsToTagsRelations = relations(blogPostsToTags, ({ one }) => ({
  post: one(blogPosts, {
    fields: [blogPostsToTags.blogPostId],
    references: [blogPosts.id],
  }),
  tag: one(tags, {
    fields: [blogPostsToTags.tagId],
    references: [tags.id],
  }),
}));

export const projectsToTagsRelations = relations(projectsToTags, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToTags.projectId],
    references: [projects.id],
  }),
  tag: one(tags, {
    fields: [projectsToTags.tagId],
    references: [tags.id],
  }),
}));

export const projectsToTechnologiesRelations = relations(projectsToTechnologies, ({ one }) => ({
  project: one(projects, {
    fields: [projectsToTechnologies.projectId],
    references: [projects.id],
  }),
  technology: one(technologies, {
    fields: [projectsToTechnologies.technologyId],
    references: [technologies.id],
  }),
}));