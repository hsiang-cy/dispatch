import { createFactory } from 'hono/factory'

export type JwtPayload = {
    userId: number;
    email: string;
    account: string;
}

export const factory = createFactory<{ Variables: { jwtPayload: JwtPayload } }>()