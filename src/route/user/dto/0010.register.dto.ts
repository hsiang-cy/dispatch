import { Type } from 'typebox'
// TypeCompiler

import { AccountSchema, PasswordSchema, EmailSchema, NameSchema, resDataSchema, ErrorSchema } from "./shared_type.ts";

export const RegisterRequestSchema = Type.Object({
    account: AccountSchema,
    password: PasswordSchema,
    email: EmailSchema,
    name: NameSchema
}, {
    $id: 'RegisterRequest',
    title: 'Register Request'
})

export const RegisterResponseSchema = Type.Object({
    message: Type.String({ examples: ['使用者註冊成功'] }),
    data: resDataSchema
}, {
    $id: 'RegisterResponse',
    title: 'Register Response'
})

export type RegisterRequest = Type.Static<typeof RegisterRequestSchema>
export type RegisterResponse = Type.Static<typeof RegisterResponseSchema>
export type RegisterError = Type.Static<typeof ErrorSchema>

export const registerOpenApiPath = {
    '/api/user/register': {
        post: {
            tags: ['User'],
            summary: '註冊',
            description: '建立的使用者帳號',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: RegisterRequestSchema
                    }
                }
            },
            responses: {
                '201': {
                    description: '註冊成功',
                    content: {
                        'application/json': {
                            schema: RegisterResponseSchema
                        }
                    }
                },
                '400': {
                    description: '帳號或電子郵件已存在',
                    content: {
                        'application/json': {
                            // schema: { $ref: '#/components/schemas/Error' }
                            schema: ErrorSchema
                        }
                    }
                }
            }
        }
    }
}

