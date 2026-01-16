import { z } from 'zod'
import * as shared from './shared_type.ts'
import { _400 } from '#helpers/formatTypeboxCheckError.ts'
import { Parameters } from 'typebox'

export const UpdateDestinationPathSchema = z.object({
    destinationId: z.string().regex(/^[1-9]\d*$/, '必須是數字').meta({
        description: '地點ID, 整數',
        examples: ['777']
    })
})

export const UpdateDestinationRequestSchema = z.object({
    name: shared.nameSchema.optional(),
    address: shared.AddressSchema.optional(),
    location: shared.LocationSchema.optional(),
    timeWindow: shared.TimeWindowSchema.optional(),
    isDepot: shared.IsDepotSchema.optional(),
    comment: shared.CommentSchema.optional(),
    operationTime: shared.OperationTimeSchema.optional(),
    demand: shared.DemandSchema.optional(),
    priority: shared.PrioritySchema.optional()
})

export const UpdateDestinationResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    updatedId: z.array(z.number()).optional()
})

export type UpdateDestinationParam = z.infer<typeof UpdateDestinationPathSchema>
export type UpdateDestinationRequest = z.infer<typeof UpdateDestinationRequestSchema>
export type UpdateDestinationResponse = z.infer<typeof UpdateDestinationResponseSchema>

export const updateDestinationOpenApiPath = {
    '/api/destination/updateDestination/{destinationId}': {
        put: {
            tags: ['Destination'],
            summary: '更新地點',
            security: [{ bearerAuth: [] }],
            requestParams: {
                path: UpdateDestinationPathSchema
            },
            requestBody: {
                required: true,
                content: {
                    'application/json': { schema: UpdateDestinationRequestSchema }
                }
            },
            responses: {
                '200': {
                    description: '更新成功',
                    content: { 'application/json': { schema: UpdateDestinationResponseSchema } }
                },
                ..._400,
                '401': {
                    description: 'JWT 認證失敗',
                    content: { 'application/json': {} }
                },
                '403': {
                    description: '無權限修改此地點',
                    content: { 'application/json': {} }
                },
                '404': {
                    description: '地點不存在',
                    content: { 'application/json': {} }
                }
            }
        }
    }
}