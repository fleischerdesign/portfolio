import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../db/schema';

let url = process.env.NUXT_DB_URL;

if (!url) {
    try {
        const config = useRuntimeConfig();
        url = config.dbUrl;
    } catch {
        // Running outside Nuxt context (e.g. seed script)
        url = process.env.DB_URL || 'file:./.data/db.sqlite';
    }
}

// Fallback default
url = url || 'file:./.data/db.sqlite';

const client = createClient({ url });

export const db = drizzle(client, { schema, logger: import.meta.dev });
