import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { eq, or, and } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'

export const register = new Hono()
    .post('/register', async (c) => {
        const { account, password, email, name } = await c.req.json()
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

        // xh localhost:3000/api/user/register name=hi email=hi@mail account=hi password=pass

        return c.json({
            message: '使用者註冊成功',
            data: {
                account: createNewUser[0]?.account,
                email: createNewUser[0]?.email,
                name: createNewUser[0]?.name,
            }
        }, 201)
    })

