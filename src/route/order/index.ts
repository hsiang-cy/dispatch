import { Hono } from 'hono'
import { addOrderHandlers } from './api/3010.addOrder.api.ts'

export const orderRoute = new Hono()
    .post('/add', ...addOrderHandlers)


import { addOrderOpenApiPath } from './dto/3010.addOrder.dto.ts'

export const orderOpenApiPath = {
    ...addOrderOpenApiPath
}
