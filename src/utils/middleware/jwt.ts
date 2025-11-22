import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { HTTPException } from 'hono/http-exception'

export type JWTPayload = {
    id: number,
    account: string,
    exp: number,
}

export const jwtAuth = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new HTTPException(401, { message: '缺少 Header' })
    }
    const token = authHeader.substring(7)
    const secret = process.env.JWT_SECRET as string
    if (!secret) {
        throw new Error('JWT_SECRET env error')
    }
    try {
        const payload = await verify(token, secret) as JWTPayload
        c.set('jwtPayload', payload)
    } catch (e) {
        throw new HTTPException(401, { message: 'JWT error' })
    }
    await next()
})
