import {
    registerOpenApiPath
} from '#route/route.index.ts'

export const openApiDoc = {
    openapi: '3.0.0',
    info: { title: 'Dispatch API 文檔', version: '1.0.0' },
    servers: [
        {
            url: 'http://localhost:3040',
            description: '開發環境'
        }
    ],
    paths: {
        ...registerOpenApiPath
    }
}