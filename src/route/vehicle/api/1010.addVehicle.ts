import { factory } from "#factory";
import { requestCheck } from "#helpers/formatTypeboxCheckError.ts";
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from "#db";
import {
    AddVehicleRequestValidator,
    type AddVehicleRequest
} from '../dto/1010.addVehicle.dto.ts'

export const addVehicle = factory.createHandlers(async (c) => {
    const req = await c.req.json() as unknown;

    const data = requestCheck(req, AddVehicleRequestValidator);
    try {
        const jwtPayload = c.get('jwtPayload');

        const result = await drizzleORM
            .insert(schema.vehicle)
            .values({
                user_id: jwtPayload?.id ?? 144, // TODO 使用 middleware 取得 user_id
                vehicle_number: data.vehicleNumber,
                vehicle_type: data.vehicleType,
                capacity: data.capacity,
                max_distance: data.maxDistance,
                depot_id: data.depotId
            })
            .returning()

        return c.json({
            message: '建立成功',
            data: result[0]?.id
        }, 201);
    } catch (e: any) {
        console.log('/api/vehicle/addVehicle 錯誤：', e )
        throw new HTTPException(403, { message: '資料庫錯誤', cause: e.message })
    }
})