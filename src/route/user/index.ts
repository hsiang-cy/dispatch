import { Hono } from "hono";
import { register } from "./api/001.register.ts";
import { login } from "./api/002.login.ts";

export const userRoute = new Hono()
    .route('/register', register)
    .route('/login', login)