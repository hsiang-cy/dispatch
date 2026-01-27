import { factory } from '#factory'
import { requestCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { jwtAuth } from '#middleware'
import { eq, and, count, inArray } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { keyof, length, success, z } from 'zod'
import {
    AddOrderRequestSchema,
    AddOrderResponseSchema
} from '../dto/3010.addOrder.dto.ts'

export const addOrderHandlers = factory.createHandlers(
    zValidator('param', AddOrderRequestSchema),
    zValidator('json', AddOrderRequestSchema),
    // jwtAuth,
    async (c) => {
        try {
            const data = c.req.valid('json')

            // 先查詢地點再不在
            const destination = await drizzleORM.select().from(schema.destination).where(
                inArray(schema.destination.id, data.destinationIds)
            )
            console.log(destination);


            // const { id: userId } = c.get('jwtPayload')
            // const insertData = {
            //     user_id: userId,
            //     order_number: data.orderNumber,
            //     scheduled_time: data.scheduledTime,
            //     destination_snapshot: {},
            //     vehicle_snapshot: {}
            // }

            // const [result] = await drizzleORM.insert(schema.orders).values(insertData).returning()

        } catch (e: any) {
            console.log('haha');

        }
    }
)

/*
xh localhost:3000/api/user/login account=john_doe password=password123
*/