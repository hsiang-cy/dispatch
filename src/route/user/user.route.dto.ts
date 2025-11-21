import { Type, type Static } from '@sinclair/typebox'

//  通用 Schema
const AccountSchema = Type.String({
    minLength: 3,
    maxLength: 20,
    pattern: '^[a-zA-Z0-9_]+$',
    description: '使用者帳號',
    examples: ['john_doe'],
    errorMessage: {
        minLength: '帳號至少需要 3 個字',
        maxLength: '帳號最多 20 個字',
        pattern: '帳號只能包含英文、數字和底線'
    }
})

const PasswordSchema = Type.String({
    minLength: 6,
    maxLength: 50,
    description: '使用者密碼',
    examples: ['password123'],
    errorMessage: {
        minLength: '密碼至少需要 6 個字',
        maxLength: '密碼最多 50 個字'
    }
})

const EmailSchema = Type.String({
    format: 'email',
    description: '使用者電子郵件',
    examples: ['john@example.com'],
    errorMessage: '無效的 email 格式'
})

const NameSchema = Type.String({
    minLength: 1,
    maxLength: 50,
    description: '使用者名稱',
    examples: ['John Doe'],
    errorMessage: {
        minLength: '名稱不能為空',
        maxLength: '名稱最多 50 個字'
    }
})

// 響應值 schema
const resDataSchema = Type.Object({
    account: Type.String({ examples: ['john_doe'] }),
    email: Type.String({ examples: ['john@example.com'] }),
    name: Type.String({ examples: ['John Doe'] })
})

// Login 
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


//  Register
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

// ========== Error ==========
export const UserErrorSchema = Type.Object({
    message: Type.String({
        examples: ['帳號或電子郵件已存在', '帳號或密碼錯誤']
    })
}, {
    $id: 'UserError',
    title: 'User Error'
})


export type LoginRequest = Static<typeof LoginRequestSchema>
export type LoginResponse = Static<typeof LoginResponseSchema>
export type RegisterRequest = Static<typeof RegisterRequestSchema>
export type RegisterResponse = Static<typeof RegisterResponseSchema>
export type UserError = Static<typeof UserErrorSchema>