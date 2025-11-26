import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { eq, or } from 'drizzle-orm'
import { tbValidator } from '@hono/typebox-validator'

import { factory } from '#factory'

import {
    type RegisterRequest,
    RegisterRequestSchema,
    RegisterResponseSchema,
} from '../dto/0010.register.dto.ts'

export const registerHandlers = factory.createHandlers(
    tbValidator("json", RegisterRequestSchema),
    async (c) => {
        const { account, password, email, name } = c.req.valid('json') as  RegisterRequest

        const existingUser = await drizzleORM
            .select().from(schema.user)
            .where(or(
                eq(schema.user.account, account),
                eq(schema.user.email, email),
            ))
            .limit(1)

        if (existingUser.length > 0) {
            throw new HTTPException(400, { message: '帳號或電子郵件已存在' })
        }

        const createNewUser = await drizzleORM
            .insert(schema.user)
            .values({
                account,
                password,
                email,
                name
            })
            .returning()

        return c.json({
            message: '使用者註冊成功',
            data: {
                id: createNewUser[0]?.id,
                account: createNewUser[0]?.account,
                email: createNewUser[0]?.email,
                name: createNewUser[0]?.name,
            }
        }, 201)
    }
)

