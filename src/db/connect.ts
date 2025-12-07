import postgres from 'postgres'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

if (!process.env.DB_URL) {
    throw new Error('DB_URL .env error');
}

const client = postgres(process.env.DB_URL!, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 60,
    ssl: false,
})

export const drizzleORM = drizzle(client, { schema });
// export const sql = client;