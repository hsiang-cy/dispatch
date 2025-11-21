import { Type, type Static } from "@sinclair/typebox";
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

export type RegisterRequest = Static<typeof RegisterRequestSchema>
export type RegisterResponse = Static<typeof RegisterResponseSchema>
export type RegisterError = Static<typeof ErrorSchema>