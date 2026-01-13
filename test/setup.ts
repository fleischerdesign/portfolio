import { beforeAll, afterAll, vi } from 'vitest';
import { unlinkSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import * as schema from '../server/db/schema';

const TEST_DB_PATH = resolve(process.cwd(), 'test.sqlite');

beforeAll(async () => {
  console.log(`Initializing test DB at ${TEST_DB_PATH}...`);
  
  // 1. Create DB Client
  const client = createClient({ url: `file:${TEST_DB_PATH}` });
  const db = drizzle(client, { schema });

  // 2. Apply Migrations
  await migrate(db, { migrationsFolder: './server/db/migrations' });

  // 3. Stub global 'db'
  vi.stubGlobal('db', db);
});

afterAll(() => {
  // Cleanup after all tests
  if (existsSync(TEST_DB_PATH)) {
    try {
      unlinkSync(TEST_DB_PATH);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
});
