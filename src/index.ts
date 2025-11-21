import { Hono } from 'hono'
import { userRoute, vehicleRoute } from '#route/route.index.ts'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'
import { loginCheck } from './utils/middleware/index.ts'

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
            message: 'server error',
            error: err.message,
        }, 500)
    })

    // user route    
    .route('/api/user', userRoute)

    .use(loginCheck) // 需要登入的 ↓↓↓↓↓↓↓↓↓

    // vehicle route
    .route('/api/vehicle', vehicleRoute)


    // jwt test
    .get('loginCheckCheck', (c) => c.json(c.get('jwtPayload')))

export default app

