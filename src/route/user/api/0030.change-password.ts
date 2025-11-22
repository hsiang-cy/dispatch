import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { eq } from 'drizzle-orm'
import { tbValidator } from '@hono/typebox-validator'

import { factory } from '#factory'
import { jwtAuth, type JWTPayload } from '#middleware'

import {
    ChangePasswordRequestSchema,
} from '../dto/0030.change-password.dto.ts'

export const changePasswordHandlers = factory.createHandlers(
    jwtAuth,
    tbValidator("json", ChangePasswordRequestSchema),
    async (c) => {
        try {
            const payload = c.get('jwtPayload')
            const { oldPassword, newPassword } = c.req.valid('json')

            const [user] = await drizzleORM
                .select().from(schema.user)
                .where(eq(schema.user.id, payload.id))
                .limit(1)

            if (!user || user.password !== oldPassword) {
                throw new HTTPException(400, { message: '舊密碼不正確' })
            }

            await drizzleORM
                .update(schema.user)
                .set({ password: newPassword })
                .where(eq(schema.user.id, payload.id))

            return c.json({
                message: '密碼已成功更新'
            })
        } catch (e) {
            console.error('/api/user/change-password 錯誤：', e)
            throw new HTTPException(500, { message: '更新密碼時資料庫錯誤' })
        }
    }
)
