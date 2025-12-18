import Type from 'typebox'
import { Compile } from 'typebox/compile'

import * as shared from './shared_type.ts'


export const GetDestinationsRequestSchema = Type.Object({
    id: Type.Optional(shared.idSchema),
    name: Type.Optional(shared.nameSchema),
    isDepot: Type.Optional(shared.IsDepotSchema),
    address: Type.Optional(shared.AddressSchema),
    limit: Type.Optional(Type.Integer({
        minimum: 1,
        maximum: 200,
        description: '獲取資料的筆數上限',
        examples: (20),
        default: 10
    })),
    policy: Type.Union([
        Type.Literal('or'),
        Type.Literal('and'),
    ], {
        description: '查詢策略',
        examples: 'and'
    })

})

export const GetDestinationsResponseSchema = Type.Array(
    Type.Object({
        id: shared.idSchema,
        name: shared.nameSchema,
        is_depot: shared.IsDepotSchema,
        comment: Type.Optional(shared.CommentSchema),
        time_window: Type.Optional(shared.TimeWindowSchema),
        address: shared.AddressSchema,
        location: Type.Optional(shared.LocationSchema),
        operation_time: Type.Optional(shared.OperationTimeSchema),
        demand: Type.Optional(shared.DemandSchema),
        priority: Type.Optional(shared.PrioritySchema),
        info: Type.Optional(Type.Any),
    })
)

export type GetDestinationsRequest = Type.Static<typeof GetDestinationsRequestSchema>
export const GetDestinationsRequestValidator = Compile(GetDestinationsRequestSchema)

export const getDestinationsOpenApiPath = {
    '/api/destination/getDestinations': {
        get: {
            tags: ['Destination'],
            summary: '查詢地點',
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    name: 'id',
                    in: 'query',
                    required: false,
                    schema: shared.idSchema,
                    description: shared.idSchema.description,
                    examples: shared.idSchema.examples,
                },
                {
                    name: 'name',
                    in: 'query',
                    required: false,
                    schema: shared.nameSchema,
                    description: shared.nameSchema.description,
                    examples: shared.nameSchema.examples,
                },
                {
                    name: 'isDepot',
                    in: 'query',
                    required: false,
                    schema: shared.IsDepotSchema,
                    description: shared.IsDepotSchema.description,
                    examples: shared.IsDepotSchema.examples,
                },
                {
                    name: 'address',
                    in: 'query',
                    required: false,
                    schema: shared.AddressSchema,
                    description: shared.AddressSchema.description,
                    examples: shared.AddressSchema.examples,
                },
                {
                    name: 'limit',
                    in: 'query',
                    required: false,
                    schema: Type.Integer({
                        minimum: 1,
                        maximum: 200,
                        description: '獲取資料的筆數上限',
                        examples: [20],
                        default: 10
                    }),
                    description: '獲取資料的筆數上限',
                    examples: [20],
                },
                {
                    name: 'policy',
                    in: 'query',
                    required: false,
                    schema: Type.Union([
                        Type.Literal('or'),
                        Type.Literal('and'),
                    ], {
                        description: '查詢策略',
                        examples: ['and']
                    }),
                    description: '查詢策略',
                    examples: ['and'],
                }
            ],
            responses: {
                '200': { // Changed from 201 to 200
                    description: '查詢成功', // Changed from '新增成功'
                    content: { 'application/json': { schema: GetDestinationsResponseSchema } }
                },
                '400': {
                    description: '請求格式錯誤',
                    content: { 'application/json': { schema: shared.ErrorSchema } } // Use ErrorSchema for 400, 401
                },
                '401': {
                    description: 'JWT 認證失敗',
                    content: { 'application/json': { schema: shared.ErrorSchema } }
                }
            }
        }
    }
}