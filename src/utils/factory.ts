import { createFactory } from 'hono/factory'
import type { JWTPayload } from '#middleware'

export type JWTPayload = {
    userId: number,
    account: string,
    exp: number,
}

export const factory = createFactory<{ Variables: { jwtPayload: JWTPayload } }>()