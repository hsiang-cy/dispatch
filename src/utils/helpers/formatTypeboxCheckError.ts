import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'


const formatZodError = (errorIssues: any[]) => {
    return errorIssues.map((e) => {
        return{
            path:e.path[0],
            errorMessage:e.message
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

export const _400ErrorSchema = z.object({
    message:z.string(),
})