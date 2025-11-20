import postgres from 'postgres'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema.js';

const client = postgres(process.env.DB_URL!, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 60,
    ssl: 'require'
})

export const drizzleORM = drizzle(client, { schema });
// export const sql = client;