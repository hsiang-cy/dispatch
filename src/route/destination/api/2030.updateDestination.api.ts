import { factory } from '#factory'
import { HTTPException } from 'hono/http-exception'
import { jwtAuth } from '#middleware'
import { zValidator } from '@hono/zod-validator'
import { validator } from '#root/utils/middleware/validator.ts'
import {
    UpdateDestinationPathSchema,
    UpdateDestinationRequestSchema,
    type UpdateDestinationResponse
} from '../dto/2030.updateDestination.dto.ts'
import { db } from '../db/destination.db.ts'

export const updateDestinationHandlers = factory.createHandlers(
    validator('param', UpdateDestinationPathSchema),
    validator('json', UpdateDestinationRequestSchema),
    jwtAuth,
    async (c) => {
        const { destinationId } = (c.req.valid('param'))
        const data = c.req.valid('json')
        if (!((Object.keys(data)).length > 0)) { throw new HTTPException(400, { message: '至少輸入一個欄位' }) }

        try {
            const updated = await db.update(
                c.get('jwtPayload').id,
                Number(destinationId),
                data
            )
            if (updated.length === 0) throw new HTTPException(404, { message: '資料不存在' })
            return c.json({
                success: true,
                updatedId: updated.map(d => d.destinationId)
            })
        } catch (e: any) {
            if (e instanceof HTTPException) throw e
            else throw new HTTPException(500, { message: '資料庫錯誤', cause: e.message })
        }
    }
)

/*
xh localhost:3000/api/user/login account=john_doe password=password123
*/