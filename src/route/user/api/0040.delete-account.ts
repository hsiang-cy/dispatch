import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { eq } from 'drizzle-orm'

import { factory } from '#factory'
import { jwtAuth } from '#middleware'

export const deleteAccountHandlers = factory.createHandlers(
    jwtAuth,
    async (c) => {
        try {
            const payload = c.get('jwtPayload')

            const [user] = await drizzleORM
                .select({ id: schema.user.id })
                .from(schema.user)
                .where(eq(schema.user.id, payload.id))
                .limit(1)

            if (!user) {
                // 理論上不可能通過jwt卻又不存在
                throw new HTTPException(404, { message: '使用者不存在' })
            }

            await drizzleORM
                .update(schema.user)
                .set({ status: 'deleted' })
                .where(eq(schema.user.id, payload.id))

            return c.json({
                message: '帳號已成功刪除'
            }, 200)
        } catch (e) {
            console.error('/api/user/delete-account 錯誤：', e)
            throw new HTTPException(500, { message: '刪除帳號時發生錯誤' })
        }
    }
)
