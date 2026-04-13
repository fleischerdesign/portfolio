import { relations } from "drizzle-orm";
import {
  addresses,
  companies,
  contacts,
  applications,
  applicationHistories,
  applications_to_contacts,
  documents,
  applications_to_documents,
} from "./application";
import { users, apiKeys } from "./user";
import { courses } from "./course";
import { nowEntries, nowEntryTranslations } from "./now";
import { categories, tags, technologies } from "./taxonomy";
import {
  blogPosts,
  projects,
  blogPostTranslations,
  projectTranslations,
  blogPostsToTags,
  projectsToTags,
  projectsToTechnologies,
} from "./content";
import { interestCategories, interests } from "./profile";

export const companiesRelations = relations(companies, ({ one, many }) => ({
  address: one(addresses, {
    fields: [companies.addressId],
    references: [addresses.id],
  }),
  applications: many(applications),
  contacts: many(contacts),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
  applications: many(applications_to_contacts),
}));

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    company: one(companies, {
      fields: [applications.companyId],
      references: [companies.id],
    }),
    histories: many(applicationHistories),
    contacts: many(applications_to_contacts),
    documents: many(applications_to_documents),
  }),
);

export const applicationsToContactsRelations = relations(
  applications_to_contacts,
  ({ one }) => ({
    application: one(applications, {
      fields: [applications_to_contacts.applicationId],
      references: [applications.id],
    }),
    contact: one(contacts, {
      fields: [applications_to_contacts.contactId],
      references: [contacts.id],
    }),
  }),
);

export const applicationHistoriesRelations = relations(
  applicationHistories,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationHistories.applicationId],
      references: [applications.id],
    }),
  }),
);

export const documentsRelations = relations(documents, ({ many }) => ({
  applications: many(applications_to_documents),
}));

export const applicationsToDocumentsRelations = relations(
  applications_to_documents,
  ({ one }) => ({
    application: one(applications, {
      fields: [applications_to_documents.applicationId],
      references: [applications.id],
    }),
    document: one(documents, {
      fields: [applications_to_documents.documentId],
      references: [documents.id],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  apiKeys: many(apiKeys),
  courses: many(courses),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const nowEntriesRelations = relations(nowEntries, ({ many }) => ({
  translations: many(nowEntryTranslations),
}));

export const nowEntryTranslationsRelations = relations(
  nowEntryTranslations,
  ({ one }) => ({
    entry: one(nowEntries, {
      fields: [nowEntryTranslations.nowEntryId],
      references: [nowEntries.id],
    }),
  }),
);

export const coursesRelations = relations(courses, ({ one }) => ({
  user: one(users, {
    fields: [courses.userId],
    references: [users.id],
  }),
}));

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

export const blogPostTranslationsRelations = relations(
  blogPostTranslations,
  ({ one }) => ({
    post: one(blogPosts, {
      fields: [blogPostTranslations.blogPostId],
      references: [blogPosts.id],
    }),
  }),
);

export const projectTranslationsRelations = relations(
  projectTranslations,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectTranslations.projectId],
      references: [projects.id],
    }),
  }),
);

export const blogPostsToTagsRelations = relations(
  blogPostsToTags,
  ({ one }) => ({
    post: one(blogPosts, {
      fields: [blogPostsToTags.blogPostId],
      references: [blogPosts.id],
    }),
    tag: one(tags, {
      fields: [blogPostsToTags.tagId],
      references: [tags.id],
    }),
  }),
);

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

export const projectsToTechnologiesRelations = relations(
  projectsToTechnologies,
  ({ one }) => ({
    project: one(projects, {
      fields: [projectsToTechnologies.projectId],
      references: [projects.id],
    }),
    technology: one(technologies, {
      fields: [projectsToTechnologies.technologyId],
      references: [technologies.id],
    }),
  }),
);

export const interestCategoriesRelations = relations(
  interestCategories,
  ({ many }) => ({
    interests: many(interests),
  }),
);

export const interestsRelations = relations(interests, ({ one }) => ({
  category: one(interestCategories, {
    fields: [interests.categoryId],
    references: [interestCategories.id],
  }),
}));
