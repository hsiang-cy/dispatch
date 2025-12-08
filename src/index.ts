import { Hono } from 'hono'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'
import { jwtAuth } from '#middleware'
import { HTTPException } from 'hono/http-exception'


import { openApiDoc, stoplight } from './openapi.ts'
import { Scalar } from '@scalar/hono-api-reference'

import {
    userRoute,
    vehicleRoute,
    destinationRoute
} from '#route/route.index.ts'

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
    .get('/stoplight', (c) => { return c.html(stoplight); })

    .onError((err, c) => {
        console.error({
            errorRoute: c.req.path,
            method: c.req.method,
            errorMessage: err.message,
        })
        if (!(err instanceof HTTPException)) {
            return c.json({ message: 'unknown error' }, 500)
        }
        const { message, cause, status } = err
        return c.json({
            message,
            error: cause,
        }, status)
    })

    // user route    
    .route('/api/user', userRoute)

    // vehicle route
    .route('/api/vehicle', vehicleRoute)
    // destination route
    .route('/api/destination', destinationRoute)


    // jwt test
    .get('loginCheckCheck', (c) => c.json(c.get('jwtPayload')))

export default app
console.log('http://localhost:3000/scalar')
console.log('http://localhost:3000/stoplight')
