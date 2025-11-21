import { createFactory } from 'hono/factory'

export type JwtPayload = {
    userId: string;
    email: string;
    account: string;
}

export const factory = createFactory<{ Variables: { jwtPayload: JwtPayload } }>()