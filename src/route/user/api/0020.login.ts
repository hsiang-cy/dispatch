import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { eq } from 'drizzle-orm'
import { tbValidator } from '@hono/typebox-validator'
import { sign } from 'hono/jwt'

import { factory } from '#factory'

import {
    LoginRequestSchema,
    type LoginRequest
} from '../dto/0020.login.dto.ts'

export const loginHandlers = factory.createHandlers(
    tbValidator("json", LoginRequestSchema),
    async (c) => {
        const { account, password } = c.req.valid('json') as LoginRequest

        const [user] = await drizzleORM
            .select({
                id: schema.user.id,
                account: schema.user.account,
                password: schema.user.password,
            }).from(schema.user)
            .where(eq(schema.user.account, account))
            .limit(1)

        if (!user || user.password !== password) {
            throw new HTTPException(401, { message: '帳號或密碼錯誤' })
        }

        const payload = {
            id: user.id,
            account: user.account,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 小時
        }

        const secret = process.env.JWT_SECRET as string
        if (!secret) {
            throw new Error('JWT_SECRET environment error')
        }
        const token = await sign(payload, secret)

        return c.json({
            message: '使用者登入成功',
            data: {
                token
            }
        })
    }
)