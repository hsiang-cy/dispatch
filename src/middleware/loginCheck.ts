import { createMiddleware } from "hono/factory";
import { HTTPException } from 'hono/http-exception'
import { decode, verify } from 'hono/jwt'

export const loginCheck = createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ message: 'Authorization Error' }, 401);
    }
    const token = authHeader.substring(7);

    const jwtKey = process.env.JWT_SECRET as string;

    try {
        const payload = await verify(token, jwtKey);

        c.set('jwtPayload', payload);

        await next();
    } catch (e) {
        console.error("JWT hahaha error:", e);
        throw new HTTPException(401, { message: "JWT error" });
    }
});

