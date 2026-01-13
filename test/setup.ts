import { execSync } from 'node:child_process';
import { beforeAll, afterAll } from 'vitest';
import { unlinkSync, existsSync } from 'node:fs';

import { resolve } from 'node:path';

const TEST_DB_PATH = resolve(process.cwd(), 'test.sqlite');

beforeAll(() => {
  console.log(`Initializing test DB at ${TEST_DB_PATH}...`);
  execSync('npx drizzle-kit push --force', {
    env: { ...process.env, NUXT_DB_URL: `file:${TEST_DB_PATH}` },
    stdio: 'inherit'
  });

  if (existsSync(TEST_DB_PATH)) {
    console.log('Test DB created')
  } else {
    console.error('Test DB NOT created!');
  }
});

afterAll(() => {
  // Cleanup after all tests
  if (existsSync(TEST_DB_PATH)) {
    unlinkSync(TEST_DB_PATH);
  }
});
