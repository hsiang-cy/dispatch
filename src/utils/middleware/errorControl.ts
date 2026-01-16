import { type Context } from 'hono'
import { ZodError } from 'zod'
import { HTTPException } from 'hono/http-exception'

export const errorControl = (err: Error, c: Context) => {
  console.log('全局錯誤:')
  console.log(err)

  if (err instanceof ZodError) {
    return c.json({
      success: false,
      message: '請求格式錯誤',
      error: err.cause ?? null
    }, 400)
  }

  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      message: err.message,
      error: err.cause ?? null
    }, err.status)
  }

  return c.json({
    success: false,
    message: '伺服器內部錯誤'
  }, 500)
}
