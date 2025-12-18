import { Type, type Static } from "@sinclair/typebox";

import { AccountSchema, PasswordSchema, ErrorSchema } from "./shared_type.ts";

export const LoginRequestSchema = Type.Object({
    account: AccountSchema,
    password: PasswordSchema,
})

export const LoginResponseSchema = Type.Object({
    message: Type.String({ examples: ['使用者登入成功'] }),
    data: Type.Object({
        token: Type.String({ description: 'JWT token' })
    })
})

export const loginOpenApiPath = {
    '/api/user/login': {
        post: {
            tags: ['User'],
            summary: '登入',
            description: '使用者登入並取得 JWT token',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: LoginRequestSchema
                    }
                }
            },
            responses: {
                '200': {
                    description: '登入成功',
                    content: {
                        'application/json': {
                            schema: LoginResponseSchema
                        }
                    }
                },
                '401': {
                    description: '帳號或密碼錯誤',
                    content: {
                        'application/json': {
                            schema: ErrorSchema
                        }
                    }
                }
            }
        }
    }
}

export type LoginRequest = Static<typeof LoginRequestSchema>
export type LoginResponse = Static<typeof LoginResponseSchema>
export type LoginError = Static<typeof ErrorSchema>
