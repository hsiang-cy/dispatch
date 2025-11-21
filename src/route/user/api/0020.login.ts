import { factory } from '#factory'
import { drizzleORM, schema } from '#db'
import { eq, or, and } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'

export const loginHandlers = factory.createHandlers(async (c) => {
    const { account, password } = await c.req.json()
    const user = await drizzleORM
        .select().from(schema.user)
        .where(and(
            eq(schema.user.account, account),
            eq(schema.user.password, password),
        ))
        .limit(1)

    if (user.length === 0) {
        throw new HTTPException(401, { message: '帳號或密碼錯誤' })
    }

    const payload = {
        account: user[0]?.account,
        email: user[0]?.email,
        userId: user[0]?.id,
    }
    const secret = process.env.JWT_SECRET as string
    const token = await sign(payload, secret)


    return c.json({
        message: '使用者登入成功',
        data: {
            account: user[0]?.account,
            email: user[0]?.email,
            name: user[0]?.name,
        },
        token: token
    })
})
