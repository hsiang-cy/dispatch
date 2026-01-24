import { z } from 'zod'

import { _400 } from '#helpers/formatTypeboxCheckError.ts'

export const AddOrderRequestSchema = z.object({
    orderNumber: z.string().min(1).meta({
        description: '訂單編號',
        examples: ['order-123']
    }),
    scheduledTime: z.string().meta({
        description: '預定時間 (ISO 格式)',
        examples: ['2026-01-25T09:00:00Z']
    }),
    destinationIds: z.array(z.number().int().positive()).min(1).meta({
        description: '地點 ID 陣列',
        examples: [[1, 2, 3]]
    }),
    vehicleIds: z.array(z.number().int().positive()).min(1).meta({
        description: '車輛 ID 陣列',
        examples: [[1, 2]]
    })
})

export const AddOrderResponseSchema = z.object({
    message: z.string().meta({
        description: '回應訊息',
        examples: ['訂單新增成功']
    }),
    data: z.object({
        id: z.number().meta({
            description: '訂單 ID',
            examples: [666]
        })
    })
})

export type AddOrderRequest = z.infer<typeof AddOrderRequestSchema>
export type AddOrderResponse = z.infer<typeof AddOrderResponseSchema>

export const addOrderOpenApiPath = {
    '/api/order/add': {
        post: {
            tags: ['Order'],
            summary: '新增訂單',
            security: [{ bearerAuth: [] }],
            requestBody: { required: true, content: { 'application/json': { schema: AddOrderRequestSchema } } },
            responses: {
                '201': {
                    description: '新增成功',
                    content: { 'application/json': { schema: AddOrderResponseSchema } }
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
