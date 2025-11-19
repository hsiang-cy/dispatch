import { Hono } from 'hono'
import sql from './db/connect.js'


console.table((await sql`select 1 as number`).columns);

const app = new Hono()

app
    .get('/', (c) => c.text('Hello Bun!'))
    .get('/test', async (c) => {
        const users = await sql`select 1 as number`
        return c.json(users)
    })

export default app