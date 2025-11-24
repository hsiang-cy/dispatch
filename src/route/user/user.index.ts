import { Hono } from "hono";
import { registerHandlers } from "./api/0010.register.ts";
import { loginHandlers } from "./api/0020.login.ts";
import { changePasswordHandlers } from "./api/0030.change-password.ts";

export const userRoute = new Hono()
    .post('/register', ...registerHandlers)
    .post('/login', ...loginHandlers)
    .put('/change-password', ...changePasswordHandlers)


export { registerOpenApiPath } from './dto/0010.register.dto.ts'
export { loginOpenApiPath } from './dto/0020.login.dto.ts'
export { changePasswordOpenApiPath } from './dto/0030.change-password.dto.ts'
