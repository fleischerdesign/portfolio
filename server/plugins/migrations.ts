import { migrate } from 'drizzle-orm/libsql/migrator';

export default defineNitroPlugin(async () => {
  // We only run migrations in production builds.
  // In development, `drizzle-kit push` or `drizzle-kit migrate`
  if (import.meta.prerender || import.meta.dev) {
    return;
  }

  try {
    console.log('Running database migrations...');
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('Database migrations completed successfully.');
  } catch (e) {
    console.error('Error running database migrations:', e);
    // Depending on the app's needs, we might want to exit the process
    // if migrations fail, as the app might be in an unusable state.
    // process.exit(1);
  }
});
