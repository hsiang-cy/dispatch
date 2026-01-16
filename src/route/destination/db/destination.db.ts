import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { eq, and, count } from 'drizzle-orm'

export class Db {

    async update(userId: number, destinationId: number, data: object) {
        const updated = await drizzleORM
            .update(schema.destination)
            .set(data)
            .where(
                and(
                    eq(schema.destination.id, Number(destinationId)),
                    eq(schema.destination.user_id, userId),
                    eq(schema.destination.status, 'active')
                )
            )
            .returning({
                destinationId: schema.destination.id,
                // name: schema.destination.name,
                // isDepot: schema.destination.is_depot,
                // comment: schema.destination.comment,
                // timeWindow: schema.destination.time_window,
                // address: schema.destination.address,
                // location: schema.destination.location,
                // operationTime: schema.destination.operation_time,
                // demand: schema.destination.demand,
                // priority: schema.destination.priority,
                // info: schema.destination.info,
            })
        return updated
    }
}

export const db = new Db
