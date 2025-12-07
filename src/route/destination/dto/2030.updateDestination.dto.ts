import { Type } from 'typebox'
import { Compile } from 'typebox/compile'
import { DestinationNameSchema, AddressSchema, LocationSchema, TimeWindowSchema, CommentSchema, OperationTimeSchema, DemandSchema, PrioritySchema, IsDepotSchema, DestinationDataSchema, ErrorSchema } from './shared_type.ts'

export const UpdateDestinationRequestSchema = Type.Object({
    name: Type.Optional(DestinationNameSchema),
    address: Type.Optional(AddressSchema),
    location: Type.Optional(LocationSchema),
    timeWindow: Type.Optional(TimeWindowSchema),
    isDepot: Type.Optional(IsDepotSchema),
    comment: CommentSchema,
    operationTime: Type.Optional(OperationTimeSchema),
    demand: Type.Optional(DemandSchema),
    priority: Type.Optional(PrioritySchema)
}, { $id: 'UpdateDestinationRequest', title: 'Update Destination Request' })

export const UpdateDestinationResponseSchema = Type.Object({
    message: Type.String({ examples: ['更新成功'] }),
    data: DestinationDataSchema
}, { $id: 'UpdateDestinationResponse', title: 'Update Destination Response' })

export type UpdateDestinationRequest = Type.Static<typeof UpdateDestinationRequestSchema>
export const UpdateDestinationRequestValidator = Compile(UpdateDestinationRequestSchema)

export const updateDestinationOpenApiPath = {
    '/api/destination/{id}': {
        put: {
            tags: ['Destination'],
            summary: '更新地點',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            requestBody: { required: true, content: { 'application/json': { schema: UpdateDestinationRequestSchema } } },
            responses: {
                '200': { description: '更新成功', content: { 'application/json': { schema: UpdateDestinationResponseSchema } } },
                '404': { description: '地點不存在', content: { 'application/json': { schema: ErrorSchema } } }
            }
        }
    }
}
