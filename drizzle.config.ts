import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema",
  out: "./server/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url:
      process.env.NUXT_DB_URL || process.env.DB_URL || "file:./.data/db.sqlite",
  },
  verbose: true,
  strict: true,
});
