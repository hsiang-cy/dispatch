import { z } from 'zod'
import * as shared from './shared_type.ts'
import { ErrorSchema_400,_400 } from '#helpers/formatTypeboxCheckError.ts'

export const GetDestinationsRequestSchema = z.object({
    id: shared.idSchema.optional(),
    name: shared.nameSchema.optional(),
    isDepot: shared.IsDepotSchema.optional(),
    address: shared.AddressSchema.optional(),
    limit: shared.LimitSchema.optional(),
    policy: shared.PolicySchema
})

export const GetDestinationsResponseSchema = z.array(
    z.object({
        id: shared.idSchema,
        name: shared.nameSchema,
        is_depot: shared.IsDepotSchema,
        comment: shared.CommentSchema,
        time_window: shared.TimeWindowSchema.optional(),
        address: shared.AddressSchema,
        location: shared.LocationSchema.optional(),
        operation_time: shared.OperationTimeSchema.optional(),
        demand: shared.DemandSchema.optional(),
        priority: shared.PrioritySchema.optional(),
        info: z.any().optional()
    })
)

export type GetDestinationsRequest = z.infer<typeof GetDestinationsRequestSchema>
export type GetDestinationsResponse = z.infer<typeof GetDestinationsResponseSchema>

export const getDestinationsOpenApiPath = {
    '/api/destination/getDestinations': {
        get: {
            tags: ['Destination'],
            summary: '查詢地點列表',
            security: [{ bearerAuth: [] }],
            requestParams: {
                query: GetDestinationsRequestSchema
            },
            responses: {
                '200': {
                    description: '查詢成功',
                    content: {
                        'application/json': {
                            schema: GetDestinationsResponseSchema
                        }
                    }
                },
                ..._400,
                '401': {
                    description: 'JWT 認證失敗'
                }
            }
        }
    }
}