import { Type } from 'typebox'
import { DestinationDataSchema, ErrorSchema } from './shared_type.ts'

export const GetDestinationResponseSchema = Type.Object({
    message: Type.String({ examples: ['查詢成功'] }),
    data: DestinationDataSchema
}, { $id: 'GetDestinationResponse', title: 'Get Destination Response' })

export const ListDestinationQuerySchema = Type.Object({
    page: Type.Optional(Type.String({ default: '1' })),
    limit: Type.Optional(Type.String({ default: '20' })),
    isDepot: Type.Optional(Type.String()),
    search: Type.Optional(Type.String())
})

export const ListDestinationResponseSchema = Type.Object({
    message: Type.String({ examples: ['查詢成功'] }),
    data: Type.Array(DestinationDataSchema),
    pagination: Type.Object({
        page: Type.Integer(),
        limit: Type.Integer(),
        total: Type.Integer(),
        totalPages: Type.Integer()
    })
}, { $id: 'ListDestinationResponse', title: 'List Destination Response' })

export type ListDestinationQuery = Type.Static<typeof ListDestinationQuerySchema>

export const getDestinationOpenApiPath = {
    '/api/destination/{id}': {
        get: {
            tags: ['Destination'],
            summary: '查詢單一地點',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: {
                '200': { description: '查詢成功', content: { 'application/json': { schema: GetDestinationResponseSchema } } },
                '404': { description: '地點不存在', content: { 'application/json': { schema: ErrorSchema } } }
            }
        }
    },
    '/api/destination/list': {
        get: {
            tags: ['Destination'],
            summary: '查詢地點列表',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                { name: 'isDepot', in: 'query', schema: { type: 'boolean' } },
                { name: 'search', in: 'query', schema: { type: 'string' } }
            ],
            responses: { '200': { description: '查詢成功', content: { 'application/json': { schema: ListDestinationResponseSchema } } } }
        }
    }
}
