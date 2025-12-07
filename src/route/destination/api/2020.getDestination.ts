import { factory } from '#factory'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { and, eq, or, ilike, count } from 'drizzle-orm'
import { jwtAuth } from '#middleware'
import type { ListDestinationQuery } from '../dto/2020.getDestination.dto.ts'

export const getDestinationHandlers = factory.createHandlers(jwtAuth, async (c) => {
    try {
        const { id: userId } = c.get('jwtPayload')
        const destinationId = parseInt(c.req.param('id'), 10)
        if (isNaN(destinationId)) throw new HTTPException(400, { message: '無效的地點 ID' })

        const [result] = await drizzleORM.select().from(schema.destination)
            .where(and(eq(schema.destination.id, destinationId), eq(schema.destination.user_id, userId), eq(schema.destination.status, 'active'))).limit(1)

        if (!result) throw new HTTPException(404, { message: '地點不存在' })
        return c.json({
            message: '查詢成功',
            data: { id: result.id, name: result.name, is_depot: result.is_depot, comment: result.comment, time_window: result.time_window, address: result.address, location: result.location, operation_time: result.operation_time, demand: result.demand, priority: result.priority, created_at: result.created_at, updated_at: result.updated_at }
        })
    } catch (e) {
        if (e instanceof HTTPException) throw e
        throw new HTTPException(500, { message: '查詢時發生錯誤' })
    }
})

export const listDestinationHandlers = factory.createHandlers(jwtAuth, async (c) => {
    try {
        const { id: userId } = c.get('jwtPayload')
        const query = c.req.query() as ListDestinationQuery
        const page = Math.max(1, parseInt(query.page ?? '1', 10))
        const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10)))
        const offset = (page - 1) * limit

        const conditions: any[] = [eq(schema.destination.user_id, userId), eq(schema.destination.status, 'active')]
        if (query.isDepot !== undefined) conditions.push(eq(schema.destination.is_depot, query.isDepot === 'true'))
        if (query.search) conditions.push(or(ilike(schema.destination.name, `%${query.search}%`), ilike(schema.destination.address, `%${query.search}%`))!)

        const [{ total }] = await drizzleORM.select({ total: count() }).from(schema.destination).where(and(...conditions))
        const results = await drizzleORM.select().from(schema.destination).where(and(...conditions)).orderBy(schema.destination.created_at).limit(limit).offset(offset)

        return c.json({
            message: '查詢成功',
            data: results.map(r => ({ id: r.id, name: r.name, is_depot: r.is_depot, comment: r.comment, time_window: r.time_window, address: r.address, location: r.location, operation_time: r.operation_time, demand: r.demand, priority: r.priority, created_at: r.created_at, updated_at: r.updated_at })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        })
    } catch (e) {
        if (e instanceof HTTPException) throw e
        throw new HTTPException(500, { message: '查詢時發生錯誤' })
    }
})
