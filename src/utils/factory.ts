import { createFactory } from 'hono/factory'
import type { JWTPayload } from '#middleware'

export const factory = createFactory<{ Variables: { jwtPayload: JWTPayload } }>()