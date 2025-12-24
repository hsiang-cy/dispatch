import { factory } from '#factory'
import { requestCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { jwtAuth } from '#middleware'
import { eq, and, count } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { keyof, length, success, z } from 'zod'
import {
    UpdateDestinationPathSchema,
    UpdateDestinationRequestSchema,
    type UpdateDestinationResponse
} from '../dto/2030.updateDestination.dto.ts'

export const updateDestinationHandlers = factory.createHandlers(
    zValidator('param', UpdateDestinationPathSchema),
    zValidator('json', UpdateDestinationRequestSchema),
    jwtAuth,
    async (c) => {
        try {
            const { destinationId } = (c.req.valid('param'))
            const [exist] = await drizzleORM
                .select({ count: count() })
                .from(schema.destination)
                .where(
                    and(
                        eq(schema.destination.id, Number(destinationId)),
                        eq(schema.destination.user_id, c.get('jwtPayload').id)
                    )
                )
            if (exist?.count !== 1) { throw new HTTPException(400, { message: '該資料不存在' }) }

            const data = c.req.valid('json')
            if (!((Object.keys(data)).length > 0)) { throw new HTTPException(400, { message: '至少輸入一個屬性' }) }

            const original = await drizzleORM.select().from(schema.destination).where(
                and(
                    eq(schema.destination.id, Number(destinationId)),
                    eq(schema.destination.user_id, c.get('jwtPayload').id)
                )
            )

            const [updated] = await drizzleORM
                .update(schema.destination)
                .set(data)
                .where(
                    and(
                        eq(schema.destination.id, Number(destinationId)),
                        eq(schema.destination.user_id, c.get('jwtPayload').id),
                        eq(schema.destination.status, 'active')
                    )
                )
                .returning({
                    destinationId: schema.destination.id,
                    name: schema.destination.name,
                    isDepot: schema.destination.is_depot,
                    comment: schema.destination.comment,
                    timeWindow: schema.destination.time_window,
                    address: schema.destination.address,
                    location: schema.destination.location,
                    operationTime: schema.destination.operation_time,
                    demand: schema.destination.demand,
                    priority: schema.destination.priority,
                    info: schema.destination.info,
                })
            
            return c.json({ success: true, newData: updated })
        } catch (e: any) {
            if (e instanceof HTTPException) throw e
            else throw new HTTPException(500, { message: '哈哈', cause: e.message })
        }
    }
)

/*
xh localhost:3000/api/user/login account=john_doe password=password123
*/