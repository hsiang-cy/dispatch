import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { eq, or, and } from 'drizzle-orm'
import { HTTPException } from 'hono/http-exception'
import { sign } from 'hono/jwt'

export const userRoute = new Hono()


    // POST /api/register
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

    // POST /api/user/login
    .post('/login', async (c) => {
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

    // GET /api/user/
    .get('/', async (c) => {
        const users = await drizzleORM.$count(schema.user)

        const message = `總共有 ${users} 位使用者`
        return c.json({
            message,
            data: users,
            route: c.req.path,
            method: c.req.method
        })
    })