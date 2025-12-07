import { factory } from '#factory'
import { requestParamsCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { and, eq } from 'drizzle-orm'
import { jwtAuth } from '#middleware'
import { UpdateDestinationRequestValidator } from '../dto/2030.updateDestination.dto.ts'

export const updateDestinationHandlers = factory.createHandlers(jwtAuth, async (c) => {
    const req = await c.req.json() as unknown
    const data = requestParamsCheck(req, UpdateDestinationRequestValidator)

    try {
        const { id: userId } = c.get('jwtPayload')
        const destinationId = parseInt(c.req.param('id'), 10)
        if (isNaN(destinationId)) throw new HTTPException(400, { message: '無效的地點 ID' })

        const [existing] = await drizzleORM.select({ id: schema.destination.id }).from(schema.destination)
            .where(and(eq(schema.destination.id, destinationId), eq(schema.destination.user_id, userId), eq(schema.destination.status, 'active'))).limit(1)
        if (!existing) throw new HTTPException(404, { message: '地點不存在' })

        const updateData: Record<string, any> = { updated_at: new Date() }
        if (data.name !== undefined) updateData.name = data.name
        if (data.address !== undefined) updateData.address = data.address
        if (data.location !== undefined) updateData.location = data.location
        if (data.timeWindow !== undefined) updateData.time_window = data.timeWindow
        if (data.isDepot !== undefined) updateData.is_depot = data.isDepot
        if (data.comment !== undefined) updateData.comment = data.comment
        if (data.operationTime !== undefined) updateData.operation_time = data.operationTime
        if (data.demand !== undefined) updateData.demand = data.demand
        if (data.priority !== undefined) updateData.priority = data.priority

        const [result] = await drizzleORM.update(schema.destination).set(updateData).where(eq(schema.destination.id, destinationId)).returning()
        return c.json({
            message: '更新成功',
            data: { id: result.id }
        })
    } catch (e) {
        if (e instanceof HTTPException) throw e
        throw new HTTPException(500, { message: '更新時發生錯誤' })
    }
})
