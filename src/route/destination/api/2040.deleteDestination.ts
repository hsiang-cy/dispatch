import { factory } from '#factory'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { and, eq } from 'drizzle-orm'
import { jwtAuth } from '#middleware'

export const deleteDestinationHandlers = factory.createHandlers(jwtAuth, async (c) => {
    try {
        const { id: userId } = c.get('jwtPayload')
        if (!c.req.param('id')) return c.json({ message: 'HAHA' })
        const destinationId = parseInt(c.req.param('id') as string, 10)
        // if (isNaN(destinationId)) throw new HTTPException(400, { message: '無效的地點 ID' })

        // const [existing] = await drizzleORM.select({ id: schema.destination.id }).from(schema.destination)
        // .where(and(eq(schema.destination.id, destinationId), eq(schema.destination.user_id, userId), eq(schema.destination.status, 'active'))).limit(1)
        // if (!existing) throw new HTTPException(404, { message: '地點不存在' })

        // await drizzleORM.update(schema.destination).set({ status: 'deleted', updated_at: new Date() }).where(eq(schema.destination.id, destinationId))
        return c.json({ message: '刪除成功', userId, destinationId })
    } catch (e) {
        if (e instanceof HTTPException) throw e
        throw new HTTPException(500, { message: '刪除時發生錯誤' })
    }
})
