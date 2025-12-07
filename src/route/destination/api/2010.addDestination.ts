import { factory } from '#factory'
import { requestParamsCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { jwtAuth } from '#middleware'
import { AddDestinationRequestValidator, type AddDestinationRequest } from '../dto/2010.addDestination.dto.ts'

export const addDestinationHandlers = factory.createHandlers(jwtAuth, async (c) => {
    const req = await c.req.json() as unknown
    const data = requestParamsCheck(req, AddDestinationRequestValidator)

    try {
        const { id: userId } = c.get('jwtPayload')

        const insertData: typeof schema.destination.$inferInsert = {
            user_id: userId,
            name: data.name,
            address: data.address,
            location: data.location,
            time_window: data.timeWindow,
            is_depot: data.isDepot ?? false,
            comment: data.comment,
            operation_time: data.operationTime ?? 0,
            demand: data.demand ?? 0,
            priority: data.priority ?? 0
        }

        // 然後用這個 insert
        const [result] = await drizzleORM.insert(schema.destination).values(insertData).returning()

        return c.json({
            message: '地點新增成功',
            data: { id: userId }
        }, 201)
    } catch (e: any) {
        console.error('/api/destination/add 錯誤：', e)
        throw new HTTPException(500, { message: '資料庫錯誤', cause: e.message })
    }
})
