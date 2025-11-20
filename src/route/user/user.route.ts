import { Hono } from 'hono'
import { drizzleORM } from '#db/connect.ts'
import { user } from '#db/schema.ts'
import { eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const userRoute = new Hono()

// GET /api/user
userRoute.get('/', async (c) => {
    try {
        const users = await drizzleORM.select().from(user)



        const message = `總共有 ${users.length} 位使用者`
        return c.json({
            message,
            data: users,
        })
    } catch (e) {
        return c.json({ message: '取得使用者失敗', error: e }, 500)
    }
})

export default userRoute