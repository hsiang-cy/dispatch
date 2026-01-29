import { Hono } from 'hono'
import type { BlankEnv } from 'hono/types'
import { drizzleORM } from '#db'
import { sql } from 'drizzle-orm'
import { errorControl } from '#middleware'


import { openApiDoc, stoplight } from './openapi.ts'
import { Scalar } from '@scalar/hono-api-reference'

import {
    userRoute,
    vehicleRoute,
    destinationRoute,
    orderRoute
} from '#route/route.index.ts'

// 測試資料庫連線
try {
    await drizzleORM.execute(sql`SELECT 1`)
    console.log('資料庫連線成功')
} catch (e) {
    console.error('資料庫連線失敗：\n', e)
    process.exit(1)
}

// const app: BlankEnv = new Hono()
const app = new Hono()
    .get('/test', (c) => c.text('test succesful'))

    .onError((err, c) => errorControl(err, c))

    // user route    
    .route('/api/user', userRoute)

    // vehicle route
    .route('/api/vehicle', vehicleRoute)

    // destination route
    .route('/api/destination', destinationRoute)

    // order route
    .route('/api/order', orderRoute)


    // jwt test
    .get('loginCheckCheck', (c) => c.json(c.get('jwtPayload')))

    .get('/doc', (c) => c.json(openApiDoc))
    .get('/scalar', Scalar({ url: '/doc', theme: 'purple' }))
    .get('/stoplight', (c) => { return c.html(stoplight); })

const server = Bun.serve({
    port: 3000,
    hostname: "0.0.0.0",  // 綁定所有網路介面

    fetch: app.fetch,
})
console.log('http://localhost:3000/scalar')
console.log('http://localhost:3000/stoplight')
