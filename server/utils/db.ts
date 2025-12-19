import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../db/schema';

const config = useRuntimeConfig();

const url = config.dbUrl || 'file:./.data/db.sqlite';

const client = createClient({ url });

export const db = drizzle(client, { schema, logger: import.meta.dev });
