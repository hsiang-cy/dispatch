import postgres from 'postgres'
import 'dotenv/config'

const sql = postgres(process.env.DB_URL!, {
    max: 20,
    idle_timeout: 20,
    connect_timeout: 60,
    ssl: 'require'
})

export default sql