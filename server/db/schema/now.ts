import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { LOCALES } from "../../../shared/utils/locales";

export const nowEntries = sqliteTable("now_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  icon: text("icon"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`(strftime('%s', 'now'))`,
  ),
});

export const nowEntryTranslations = sqliteTable(
  "now_entry_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nowEntryId: integer("now_entry_id")
      .notNull()
      .references(() => nowEntries.id, { onDelete: "cascade" }),
    locale: text("locale", { enum: LOCALES }).notNull(),
    content: text("content").notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
      () => sql`(strftime('%s', 'now'))`,
    ),
  },
  (t) => ({
    entryLocaleIdx: uniqueIndex("now_trans_entry_locale_idx").on(
      t.nowEntryId,
      t.locale,
    ),
  }),
);
