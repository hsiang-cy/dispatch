import { HTTPException } from 'hono/http-exception'
import { type Validator, Compile } from 'typebox/compile';
import type { TSchema, Static } from 'typebox';


const formatTypeboxCheckError = (errors: any[]) => {
    return errors.map(e => ({
        instancePath: e.path,
        message: e.message,
        params: e.schema
    }));
}

export const requestParamsCheck = <T extends TSchema>(req: unknown, validator: Validator<{}, T>): Static<T> => {
    if (!validator.Check(req)) {
        const errors = [...validator.Errors(req)];
        throw new HTTPException(400, {
            message: '請求格式錯誤',
            cause: {
                errors: formatTypeboxCheckError(errors)
            }
        })
    }
    return req as Static<T>
} 