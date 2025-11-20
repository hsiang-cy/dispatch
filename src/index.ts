import { Hono } from 'hono'
import userRoute from '#route/user/user.route.ts'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'
import { loginCheck } from '#middleware'

// 測試資料庫連線
try {
    await drizzleORM.execute(sql`SELECT 1`)
    console.log('資料庫連線成功')
} catch (e) {
    console.error('資料庫連線失敗：\n', e)
    process.exit(1)
}

const app = new Hono()
    .get('/test', (c) => c.text('test succesful'))
    .onError((err, c) => {
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

    // user route    
    .route('/api/user', userRoute)

    // 需要登入的 ↓↓↓↓↓↓↓↓↓
    .use(loginCheck)



    // routes
    .get('loginCheckCheck', (c) => c.json(c.get('jwtPayload')))

export default app

