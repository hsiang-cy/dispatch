import { Hono } from "hono";
import { registerHandlers } from "./api/0010.register.ts";
import { loginHandlers } from "./api/0020.login.ts";
import { changePasswordHandlers } from "./api/0030.change-password.ts";
import { deleteAccountHandlers } from "./api/0040.delete-account.ts";

export const userRoute = new Hono()
    .post('/register', ...registerHandlers)
    .post('/login', ...loginHandlers)
    .put('/change-password', ...changePasswordHandlers)
    .delete('/', ...deleteAccountHandlers)


export { registerOpenApiPath } from './dto/010.register.dto.ts'
export { loginOpenApiPath } from './dto/020.login.dto.ts'
export { changePasswordOpenApiPath } from './dto/030.change-password.dto.ts'
