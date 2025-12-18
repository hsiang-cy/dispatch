import { Type } from "typebox";
import { Compile } from "typebox/compile";

export const AddVehicleRequestSchema = Type.Object({
    vehicleNumber: Type.String({
        minLength: 1,
        maxLength: 30,
        description: '車牌(或代號)',
        examples: ['ABC123'],
    }),
    vehicleType: Type.Union(
        (['truck', 'car', 'scooter', 'big_truck'] as const).map(x => Type.Literal(x)), {
        description: '車輛類型',
        examples: ['truck']
    }),
    capacity: Type.Integer({
        minimum: 0,
        description: '車輛容量',
        examples: [5],
    }),
    maxDistance: Type.Integer({
        minimum: 0,
        description: '車輛最大行駛距離',
        examples: [100],
    }),
    depotId: Type.Integer({
        minimum: 1,
        description: '預設出發位置',
        examples: [1],
    }),
    comment: Type.String({
        minLength: 0,
        maxLength: 500,
        description: '備註',
        examples: ['備註訊息...'],
    })
})

export const AddVehicleResponseSchema = Type.Object({
    success: Type.Boolean({ examples: [true] }),
    message: Type.String({ examples: ['車輛新增成功'] }),
    data: Type.Object({
        id: Type.Integer({ description: '車輛 ID' })
    })
})

export type AddVehicleRequest = Type.Static<typeof AddVehicleRequestSchema>
export type AddVehicleResponse = Type.Static<typeof AddVehicleResponseSchema>

export const AddVehicleRequestValidator = Compile(AddVehicleRequestSchema)
