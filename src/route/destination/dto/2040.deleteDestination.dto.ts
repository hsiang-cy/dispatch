import { Type } from 'typebox'
import { ErrorSchema } from './shared_type.ts'

export const DeleteDestinationResponseSchema = Type.Object({
    message: Type.String({ examples: ['刪除成功'] })
}, { $id: 'DeleteDestinationResponse', title: 'Delete Destination Response' })

export const deleteDestinationOpenApiPath = {
    '/api/destination/{id}': {
        delete: {
            tags: ['Destination'],
            summary: '刪除地點',
            description: '軟刪除地點（將狀態設為 deleted）',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
            responses: {
                '200': { description: '刪除成功', content: { 'application/json': { schema: DeleteDestinationResponseSchema } } },
                '404': { description: '地點不存在', content: { 'application/json': { schema: ErrorSchema } } }
            }
        }
    }
}
