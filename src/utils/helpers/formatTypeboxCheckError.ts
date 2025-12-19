import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'


const formatZodError = (errorIssues: any[]) => {
    return errorIssues.map((e) => {
        return {
            path: e.path[0],
            errorMessage: e.message
        }
    })
}

export const requestParamsCheck = <T extends z.ZodType>(
    req: unknown,
    schema: T
): z.infer<T> => {
    const result = schema.safeParse(req)

    if (!result.success) {
        throw new HTTPException(400, {
            message: '請求格式錯誤',
            cause: {
                errors: formatZodError(result.error.issues)
                // errors: result.error.issues
            }
        })
    }

    return result.data
}

export const ErrorSchema_400 = z.object({
    message: z.string().describe('錯誤摘要').default('請求格式錯誤'),
    error: z.object({
        errors: z.array(
            z.object({
                path: z.string().describe('錯誤的參數'),
                errorMessage: z.string().describe('錯誤訊息')
            })
        ).describe('詳細錯誤列表')
    })
}) as any

export type ErrorResponse_400 = z.infer<typeof ErrorSchema_400>

export const _400 = {
    '400': {
        description: '格式錯誤',
        content: {
            'application/json': {
                schema: ErrorSchema_400
            }
        }
    },
}