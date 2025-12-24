import { z } from 'zod'


export const idSchema = z.number().int().min(0).meta({
    description: '地點 ID',
    examples: [666]
})

export const nameSchema = z.string().min(1).max(100).meta({
    description: '地點名稱',
    examples: ['台北車站']
})

export const AddressSchema = z.string().min(1).max(500).meta({
    description: '詳細地址',
    examples: ['台北市中正區北平西路3號']
})

export const CommentSchema = z.string().max(500).meta({
    description: '備註'
}).optional()

export const OperationTimeSchema = z.number().int().min(0).meta({
    description: '服務時間, 裝卸貨時間(min)',
    examples: [30]
})

export const DemandSchema = z.number().int().min(0).meta({
    description: '需求量',
    examples: [5]
})

export const PrioritySchema = z.number().int().min(0).meta({
    description: '優先順序(越小 -> 優先度大)',
    examples: [1]
})

export const IsDepotSchema = z.boolean().meta({
    description: '是否為倉庫',
    examples: [true]
})




export const TimeWindowSchema = z.array(
    z.object({
        start: z.number().int().min(0).max(1440).meta({
            description: '開始時間（分鐘）',
            examples: [480]
        }),
        end: z.number().int().min(0).max(1440).meta({
            description: '結束時間（分鐘）',
            examples: [720]
        })
    })
).meta({
    description: '時間窗口，以分鐘記錄',
    examples: [[{ start: 480, end: 720 }]]
})

export const LocationSchema = z.object({
    lat: z.number().meta({
        description: '緯度',
        examples: [25.0330]
    }),
    lng: z.number().meta({
        description: '經度',
        examples: [121.5654]
    }),
    geohash: z.string().meta({
        description: 'Geohash',
        examples: ['wsqqs']
    }).optional()
})



// 查詢用到的 

export const LimitSchema = z.number().int().min(1).max(200).default(10).meta({
    description: '獲取資料的筆數上限',
    examples: [20]
})

export const PolicySchema = z.enum(['or', 'and']).meta({
    description: '查詢策略',
    examples: ['and']
})


export type TimeWindow = z.infer<typeof TimeWindowSchema>
export type Location = z.infer<typeof LocationSchema>