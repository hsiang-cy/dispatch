import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { HTTPException } from 'hono/http-exception'

import { userRoute } from '../user.index.ts'
import { type LoginResponse } from '../dto/0020.login.dto.ts'

const generateRandomUserData = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return {
        account: `testuser_${randomSuffix}`,
        password: 'password123',
        email: `test_${randomSuffix}@example.com`,
        name: `Test User ${randomSuffix}`,
    };
};

describe('POST /user/login 登入', () => {
    const app = new Hono().route('/user', userRoute);

    beforeEach(async () => {
        // Clear the user table before each test to ensure test isolation
        await drizzleORM.delete(schema.user).execute();
    });

    app.onError((err, c) => {
        if (err instanceof HTTPException) {
            return c.json({
                message: err.message
            }, err.status)
        }
        console.error('Test server error:', err);
        return c.json({ message: 'Internal Server Error' }, 500)
    })

    process.env.JWT_SECRET = 'a-secure-secret-for-testing';

    it('登入成功: 應該回傳 200 和 token', async () => {
        const userData = generateRandomUserData();
        
        await app.request('/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        const res = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account,
                password: userData.password,
            }),
        })

        expect(res.status).toBe(200)
        const body = await res.json() as LoginResponse;
        expect(body.message).toBe('使用者登入成功')
        expect(body.data?.token).toBeString()
    })

    it('登入失敗: 密碼錯誤, 應該回傳 401', async () => {
        const userData = generateRandomUserData();

        await app.request('/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        const res = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account,
                password: 'wrongpassword',
            }),
        })

        expect(res.status).toBe(401)
        const body = await res.json() as any;
        expect(body.message).toBe('帳號或密碼錯誤')
    })

    it('登入失敗: 帳號不存在, 應該回傳 401', async () => {
        const res = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: 'nonexistentuser',
                password: 'password123',
            }),
        })

        expect(res.status).toBe(401)
        const body = await res.json() as any;
        expect(body.message).toBe('帳號或密碼錯誤')
    })

    it('登入失敗: 缺少 account, 應該回傳 400', async () => {
        const res = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: 'password123',
            }),
        })

        expect(res.status).toBe(400)
    })

    it('登入失敗: 缺少 password, 應該回傳 400', async () => {
        const res = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: 'testuser',
            }),
        })

        expect(res.status).toBe(400)
    })
})