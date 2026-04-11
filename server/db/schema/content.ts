import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { LOCALES } from "../../../shared/utils/locales";
import { users } from "./user";
import { categories, tags, technologies } from "./taxonomy";

export const blogPosts = sqliteTable("blog_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  translationKey: text("translation_key").notNull().unique(),

  status: text("status", { enum: ["draft", "published", "archived"] })
    .default("draft")
    .notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }),

  coverImage: text("cover_image"),
  coverImageAlt: text("cover_image_alt"),

  authorId: integer("author_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => sql`(strftime('%s', 'now'))`,
  ),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  translationKey: text("translation_key").notNull().unique(),

  status: text("status", { enum: ["draft", "published", "archived"] })
    .default("draft")
    .notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" }),

  icon: text("icon"),
  coverImage: text("cover_image"),
  coverImageAlt: text("cover_image_alt"),

  repoUrl: text("repo_url"),
  projectUrl: text("project_url"),

  authorId: integer("author_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),

  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => sql`(strftime('%s', 'now'))`,
  ),
});

export const blogPostTranslations = sqliteTable(
  "blog_post_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    blogPostId: integer("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: LOCALES }).notNull(),

    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    body: text("body").notNull(),
    readingTime: integer("reading_time"),

    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => sql`(strftime('%s', 'now'))`,
    ),
  },
  (t) => ({
    slugLocaleIdx: uniqueIndex("blog_trans_slug_locale_idx").on(
      t.slug,
      t.locale,
    ),
    postLocaleIdx: uniqueIndex("blog_trans_post_locale_idx").on(
      t.blogPostId,
      t.locale,
    ),
  }),
);

export const projectTranslations = sqliteTable(
  "project_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: LOCALES }).notNull(),

    slug: text("slug").notNull(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    body: text("body").notNull(),

    features: text("features", { mode: "json" }).$type<string[]>(),
    learned: text("learned", { mode: "json" }).$type<string[]>(),
    challenges: text("challenges", { mode: "json" }).$type<string[]>(),

    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => sql`(strftime('%s', 'now'))`,
    ),
  },
  (t) => ({
    slugLocaleIdx: uniqueIndex("proj_trans_slug_locale_idx").on(
      t.slug,
      t.locale,
    ),
    projectLocaleIdx: uniqueIndex("proj_trans_proj_locale_idx").on(
      t.projectId,
      t.locale,
    ),
  }),
);

export const blogPostsToTags = sqliteTable(
  "blog_posts_to_tags",
  {
    blogPostId: integer("blog_post_id")
      .notNull()
      .references(() => blogPosts.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: uniqueIndex("blog_posts_tags_pk").on(t.blogPostId, t.tagId),
  }),
);

export const projectsToTags = sqliteTable(
  "projects_to_tags",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: uniqueIndex("projects_tags_pk").on(t.projectId, t.tagId),
  }),
);

export const projectsToTechnologies = sqliteTable(
  "projects_to_technologies",
  {
    projectId: integer("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: uniqueIndex("projects_tech_pk").on(t.projectId, t.technologyId),
  }),
);
