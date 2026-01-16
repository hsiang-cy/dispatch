import { HTTPException } from 'hono/http-exception'
import { success, z } from 'zod'


const formatZodError = (errorIssues: any[]) => {
    return errorIssues.map((e) => {
        return {
            path: e.path[0],
            errorMessage: e.message
        }
    })
}

export const requestCheck = <T extends z.ZodType>(
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
    success: z.boolean().default(false),
    message: z.string().describe('錯誤摘要'),
    error: z.any().optional()
})

export type ErrorResponse_400 = z.infer<typeof ErrorSchema_400>

export const _400 = {
    '400': {
        description: '請求格式錯誤',
        content: {
            'application/json': {
                schema: ErrorSchema_400
            }
        }
    },
}