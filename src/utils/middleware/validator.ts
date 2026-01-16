import { zValidator } from '@hono/zod-validator'
import { HTTPException } from 'hono/http-exception'
import { type ZodSchema } from 'zod/v3'
import { type ValidationTargets } from 'hono'
import type { ZodAny } from 'zod'

export const validator = <T extends ZodAny, k extends keyof ValidationTargets>(
    target: k,
    schema: T
) => {
    return zValidator(target, schema, (result, c) => {
        if (!result.success) {
            throw new HTTPException(400, {
                message: '請求格式錯誤',
                cause: result.error
            })
        }
    })
}