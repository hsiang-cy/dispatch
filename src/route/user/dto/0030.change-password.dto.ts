import { Type, type Static } from "@sinclair/typebox";
import { PasswordSchema, ErrorSchema } from "./shared_type.ts";

export const ChangePasswordRequestSchema = Type.Object({
    oldPassword: PasswordSchema,
    newPassword: PasswordSchema
}, {
    $id: 'ChangePasswordRequest',
    title: 'Change Password Request'
})

export const ChangePasswordResponseSchema = Type.Object({
    message: Type.String({ examples: ['密碼更新成功'] })
}, {
    $id: 'ChangePasswordResponse',
    title: 'Change Password Response'
})

export const changePasswordOpenApiPath = {
    '/api/user/change-password': {
        put: {
            tags: ['User'],
            summary: '變更密碼',
            description: '更新使用者密碼，需要 JWT 認證',
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: ChangePasswordRequestSchema
                    }
                }
            },
            responses: {
                '200': {
                    description: '密碼更新成功',
                    content: {
                        'application/json': {
                            schema: ChangePasswordResponseSchema
                        }
                    }
                },
                '400': {
                    description: '舊密碼不正確',
                    content: {
                        'application/json': {
                            schema: ErrorSchema
                        }
                    }
                },
                '401': {
                    description: 'JWT 認證失敗',
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

export type ChangePasswordRequest = Static<typeof ChangePasswordRequestSchema>
export type ChangePasswordResponse = Static<typeof ChangePasswordResponseSchema>
