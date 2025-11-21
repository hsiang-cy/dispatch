import { Hono } from "hono";
import { registerHandlers } from "./api/0010.register.ts";
import { loginHandlers } from "./api/0020.login.ts";

export const userRoute = new Hono()
    .post('/register', ...registerHandlers)
    .post('/login', ...loginHandlers)