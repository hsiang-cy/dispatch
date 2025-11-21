import { factory, type JwtPayload } from '../factory.ts';
import { HTTPException } from 'hono/http-exception'
import { verify } from 'hono/jwt'

export const loginCheck = factory.createMiddleware(async (c, next) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ message: 'Authorization Error' }, 401);
    }
    const token = authHeader.substring(7);

    const jwtKey = process.env.JWT_SECRET as string;

    try {
        const payload = await verify(token, jwtKey);

        c.set('jwtPayload', payload as JwtPayload);

        await next();
    } catch (e) {
        console.error("JWT hahaha error:", e);
        throw new HTTPException(401, { message: "JWT error" });
    }
});

