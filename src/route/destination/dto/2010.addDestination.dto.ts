import Type from 'typebox'
import { Compile } from 'typebox/compile'
import {
    DestinationNameSchema,
    AddressSchema,
    LocationSchema,
    TimeWindowSchema,
    CommentSchema,
    OperationTimeSchema,
    DemandSchema,
    PrioritySchema,
    IsDepotSchema,
    DestinationDataSchema,
    ErrorSchema
} from './shared_type.ts'

export const AddDestinationRequestSchema = Type.Object({
    name: DestinationNameSchema,
    address: AddressSchema,
    location: LocationSchema,
    timeWindow: TimeWindowSchema,
    isDepot: Type.Optional(IsDepotSchema),
    comment: CommentSchema,
    operationTime: Type.Optional(OperationTimeSchema),
    demand: Type.Optional(DemandSchema),
    priority: Type.Optional(PrioritySchema)
}, { $id: 'AddDestinationRequest', title: 'Add Destination Request' })

export const AddDestinationResponseSchema = Type.Object({
    message: Type.String({ examples: ['地點新增成功'] }),
    data: DestinationDataSchema
}, { $id: 'AddDestinationResponse', title: 'Add Destination Response' })

export type AddDestinationRequest = Type.Static<typeof AddDestinationRequestSchema>
export const AddDestinationRequestValidator = Compile(AddDestinationRequestSchema)

export const addDestinationOpenApiPath = {
    '/api/destination/add': {
        post: {
            tags: ['Destination'],
            summary: '新增地點',
            security: [{ bearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: AddDestinationRequestSchema } } },
            responses: {
                '201': { description: '新增成功', content: { 'application/json': { schema: AddDestinationResponseSchema } } },
                '400': { description: '請求格式錯誤', content: { 'application/json': { schema: ErrorSchema } } },
                '401': { description: 'JWT 認證失敗', content: { 'application/json': { schema: ErrorSchema } } }
            }
        }
    }
}
