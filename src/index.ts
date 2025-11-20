import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import userRoute from '#route/user/user.route.ts'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'

// 測試資料庫連線
try {
    await drizzleORM.execute(sql`SELECT 1`)
    console.log('資料庫連線成功')
} catch (e) {
    console.error('資料庫連線失敗：\n', e)
    process.exit(1)
}

const app = new Hono()

app.onError((err, c) => {
    console.error({
        errorRoute: c.req.path,
        method: c.req.method,
        errorMessage: err.message,
    })
    return c.json({
        message: '伺服器錯誤',
        error: err.message,
    }, 500)
})



// routes
app.route('/api/user', userRoute)
    .get('/', (c) => c.json({ message: 'Hello from /api' }))

export default app

