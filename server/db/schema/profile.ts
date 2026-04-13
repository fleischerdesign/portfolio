import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const skills = sqliteTable("skills", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  score: integer("score").notNull().default(0),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const languages = sqliteTable("languages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  level: text("level", { mode: "json" }).$type<{
    de: string;
    en: string;
  }>(),
  score: integer("score").notNull().default(0),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const interestCategories = sqliteTable("interest_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const interests = sqliteTable("interests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  categoryId: integer("category_id")
    .references(() => interestCategories.id, { onDelete: "cascade" })
    .notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const timelineEntries = sqliteTable("timeline_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  date: text("date").notNull(),
  title: text("title", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  description: text("description", { mode: "json" })
    .$type<{ de: string; en: string }>()
    .notNull(),
  icon: text("icon"),
  type: text("type", { enum: ["education", "career"] }).notNull(),
  skills: text("skills", { mode: "json" }).$type<
    { de: string; en: string }[]
  >(),
  sortOrder: integer("sort_order").notNull().default(0),
});
