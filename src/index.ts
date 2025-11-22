import { Hono } from 'hono'
import { userRoute, vehicleRoute } from '#route/route.index.ts'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'
import { jwtAuth } from '#middleware'
import { HTTPException } from 'hono/http-exception'


import { openApiDoc } from './openapi.ts'
import { Scalar } from '@scalar/hono-api-reference'

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
    
    .get('/doc', (c) => c.json(openApiDoc))
    .get('/scalar', Scalar({ url: '/doc', theme: 'purple' }))

    .onError((err, c) => {
        console.error({
            errorRoute: c.req.path,
            method: c.req.method,
            errorMessage: err.message,
        })
        const status = (err instanceof HTTPException) ? err.status : 500
        return c.json({
            message: 'server error',
            error: err.message,
        }, status)
    })

    // user route    
    .route('/api/user', userRoute)

    .use(jwtAuth) // 需要登入的 ↓↓↓↓↓↓↓↓↓

    // vehicle route
    .route('/api/vehicle', vehicleRoute)


    // jwt test
    .get('loginCheckCheck', (c) => c.json(c.get('jwtPayload')))

export default app
console.log('http://localhost:3000/scalar')
