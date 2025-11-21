import { Type, type Static } from "@sinclair/typebox";
import { AccountSchema, PasswordSchema, resDataSchema, ErrorSchema } from "./shared_type.ts";

export const LoginRequestSchema = Type.Object({
    account: AccountSchema,
    password: PasswordSchema
}, {
    $id: 'LoginRequest',
    title: 'Login Request'
})

export const LoginResponseSchema = Type.Object({
    message: Type.String({ examples: ['使用者登入成功'] }),
    data: resDataSchema,
    token: Type.String({
        description: 'JWT Token',
        examples: ['eyJhbGciOiJkpXVCJ9...']
    })
}, {
    $id: 'LoginResponse',
    title: 'Login Response'
})
export type LoginRequest = Static<typeof LoginRequestSchema>
export type LoginResponse = Static<typeof LoginResponseSchema>
export type LoginError = Static<typeof ErrorSchema>
