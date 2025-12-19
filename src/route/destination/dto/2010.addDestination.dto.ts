import { z } from 'zod'
import * as shared from './shared_type.ts'

import { _400 } from '#helpers/formatTypeboxCheckError.ts'

export const AddDestinationRequestSchema = z.object({
    name: shared.nameSchema,
    address: shared.AddressSchema,
    location: shared.LocationSchema,
    timeWindow: shared.TimeWindowSchema,
    isDepot: shared.IsDepotSchema.optional(),
    comment: shared.CommentSchema,
    operationTime: shared.OperationTimeSchema.optional(),
    demand: shared.DemandSchema.optional(),
    priority: shared.PrioritySchema.optional()
})

export const AddDestinationResponseSchema = z.object({
    message: z.string().meta({
        description: '地點名稱',
        examples: ['地點新增成功'] 
    }),
    data: z.object({
        id: z.number().meta({ examples: [666] })
    })
})

export type AddDestinationRequest = z.infer<typeof AddDestinationRequestSchema>
export type AddDestinationResponse = z.infer<typeof AddDestinationResponseSchema>

export const addDestinationOpenApiPath = {
    '/api/destination/add': {
        post: {
            tags: ['Destination'],
            summary: '新增地點',
            security: [{ bearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: AddDestinationRequestSchema } } },
            responses: {
                '201': {
                    description: '新增成功',
                    content: { 'application/json': { schema: AddDestinationResponseSchema } }
                },
                ..._400,
                '401': {
                    description: 'JWT 認證失敗',
                    content: { 'application/json': {} }
                }
            }
        }
    }
}
