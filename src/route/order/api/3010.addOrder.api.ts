import { factory } from '#factory'
import { requestCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { jwtAuth } from '#middleware'
import { eq, and, count, inArray } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { keyof, length, number, success, z } from 'zod'
import {
    AddOrderRequestSchema,
    AddOrderResponseSchema
} from '../dto/3010.addOrder.dto.ts'

export const addOrderHandlers = factory.createHandlers(
    // zValidator('param', AddOrderRequestSchema),
    zValidator('json', AddOrderRequestSchema),
    // jwtAuth,
    async (c) => {
        try {
            const data = c.req.valid('json')
            console.log('haha');

            // 先查詢地點在不在
            const destination = await drizzleORM.select({
                id: schema.destination.id,
                name: schema.destination.name,
                isDepot: schema.destination.is_depot,
                comment: schema.destination.comment,
                timeWindow: schema.destination.time_window,
                address: schema.destination.address,
                location: schema.destination.location,
                operationTime: schema.destination.operation_time,
                demand: schema.destination.demand,
                priority: schema.destination.priority,
            })
                .from(schema.destination)
                .where(inArray(schema.destination.id, data.destinationIds))

            console.log(destination);
            console.log(JSON.stringify(destination));

            if (destination.length !== data.destinationIds.length) throw new HTTPException(400, { message: '某些不存在' })

            // 再查詢車輛在不在
            const vehicles = await drizzleORM.select({
                id: schema.vehicle.id,
                vehicleNumber: schema.vehicle.vehicle_number,
                vehicleType: schema.vehicle.vehicle_type,
                comment: schema.vehicle.comment,
                capacity: schema.vehicle.capacity,
                maxDistance: schema.vehicle.max_distance,
                maxWorkingTime: schema.vehicle.max_working_time,
                depotId: schema.vehicle.depot_id,
            })
                .from(schema.vehicle)
                .where(inArray(schema.vehicle.id, data.vehicleIds))

            if (vehicles.length !== data.vehicleIds.length) throw new HTTPException(400, { message: '某些車輛不存在' })



            // const { id: userId } = c.get('jwtPayload')
            // const insertData = {
            //     user_id: userId,
            //     order_number: data.orderNumber,
            //     scheduled_time: data.scheduledTime,
            //     destination_snapshot: {},
            //     vehicle_snapshot: {}
            // }

            // const [result] = await drizzleORM.insert(schema.orders).values(insertData).returning()
            return c.json({ message: 'haha' })
        } catch (e: any) {
            console.log('haha');

        }
    }
)

/*
xh localhost:3000/api/user/login account=john_doe password=password123
*/

type Location = {
    lat: number,
    lng: number
}[]
type Waypoint = {
    waypoint: {
        location: {
            latLng: { latitude: number, longitude: number }
        }
    }
}

const generateRouteApiBody = (locations: Location, type: string = 'DRIVE') => {
    const waypoints: Waypoint[] = locations.map(location => ({
        waypoint: {
            location: {
                latLng: {
                    latitude: location.lat,
                    longitude: location.lng
                }
            }
        }
    }))

    return {
        origins: waypoints,
        destinations: waypoints,
        travelMode: type
    }
}