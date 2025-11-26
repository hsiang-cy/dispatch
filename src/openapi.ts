import {
    registerOpenApiPath,
    loginOpenApiPath,
    changePasswordOpenApiPath
} from '#route/route.index.ts'

export const openApiDoc = {
    openapi: '3.1.0',
    info: { title: 'Dispatch API 文檔', version: '1.0.0' },
    servers: [
        {
            url: 'http://localhost:3000',
            description: '開發環境'
        }
    ],
    paths: {
        ...registerOpenApiPath,
        ...loginOpenApiPath,
        ...changePasswordOpenApiPath
    },
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
}