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

export type GetDestinationsRequest = Type.Static<typeof GetDestinationsRequestSchema>
export const GetDestinationsRequestValidator = Compile(GetDestinationsRequestSchema) 