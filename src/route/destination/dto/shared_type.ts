import Type from 'typebox'

export const idSchema = Type.Integer({
    minimum: 0,
    description: '地點 ID',
    examples: [666]
})



export const TimeWindowSchema = Type.Array(
    Type.Object({
        start: Type.Integer({ minimum: 0, maximum: 1440, description: '開始時間（分鐘）', examples: [480] }),
        end: Type.Integer({ minimum: 0, maximum: 1440, description: '結束時間（分鐘）', examples: [720] })
    }),
    {
        description: '時間窗口，以分鐘記錄',
        examples: [[{ start: 480, end: 720 }]]
    }
)

export const LocationSchema = Type.Object({
    lat: Type.Number({ description: '緯度', examples: [25.0330] }),
    lng: Type.Number({ description: '經度', examples: [121.5654] }),
    geohash: Type.Optional(Type.String({ description: 'Geohash', examples: ['wsqqs'] }))
})

export const nameSchema = Type.String({
    minLength: 1,
    maxLength: 100,
    description: '地點名稱',
    examples: ['台北車站']
})
export const AddressSchema = Type.String({
    minLength: 1,
    maxLength: 500,
    description: '詳細地址',
    examples: ['台北市中正區北平西路3號']
})
export const CommentSchema = Type.Optional(Type.String({
    maxLength: 500,
    description: '備註'
}))
export const OperationTimeSchema = Type.Integer({
    minimum: 0,
    default: 0,
    description: '服務時間, 裝卸貨時間(min)',
    examples: [30]
})
export const DemandSchema = Type.Integer({
    minimum: 0,
    default: 0,
    description: '需求量',
    examples: [5]
})
export const PrioritySchema = Type.Integer({
    minimum: 0,
    default: 0,
    description: '優先順序(越小 -> 優先度大)',
    examples: [1]
})
export const IsDepotSchema = Type.Boolean({
    default: false,
    description: '是否為倉庫',
    examples: [true]
})


export type TimeWindow = Type.Static<typeof TimeWindowSchema>
export type Location = Type.Static<typeof LocationSchema>
