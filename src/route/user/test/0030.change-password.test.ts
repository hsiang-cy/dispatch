import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { HTTPException } from 'hono/http-exception'

import { userRoute } from '../user.index.ts'
import { type LoginResponse } from '../dto/0020.login.dto.ts'
import { type ChangePasswordResponse } from '../dto/0030.change-password.dto.ts'

// Helper to generate random user data
const generateRandomUserData = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    return {
        account: `test_${randomSuffix}`,
        password: 'oldPassword123',
        email: `test_${randomSuffix}@example.com`,
        name: `User ${randomSuffix}`,
    };
};

describe('PUT /user/change-password 修改密碼', () => {
    const app = new Hono().route('/user', userRoute);
    let testUser: ReturnType<typeof generateRandomUserData>;
    let authToken: string;

    beforeEach(async () => {
        // Clear DB
        await drizzleORM.delete(schema.user).execute();

        // Create a new user for each test
        testUser = generateRandomUserData();
        await app.request('/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser),
        });

        // Log in to get a token
        const loginRes = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: testUser.account, password: testUser.password }),
        });
        const loginBody = await loginRes.json() as LoginResponse;
        authToken = loginBody.data?.token as string;
    });

    app.onError((err, c) => {
        if (err instanceof HTTPException) {
            return c.json({ message: err.message }, err.status)
        }
        console.error('Test server error:', err);
        return c.json({ message: 'Internal Server Error' }, 500)
    });

    process.env.JWT_SECRET = 'a-secure-secret-for-testing';

    it('修改密碼成功: 應該回傳 200', async () => {
        const newPassword = 'newPassword456';
        const res = await app.request('/user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                oldPassword: testUser.password,
                newPassword: newPassword,
            }),
        });

        expect(res.status).toBe(200);
        const body = await res.json() as ChangePasswordResponse;
        expect(body.message).toBe('密碼已成功更新');

        const loginRes = await app.request('/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ account: testUser.account, password: newPassword }),
        });
        expect(loginRes.status).toBe(200);
    });

    it('修改密碼失敗: 舊密碼錯誤, 應該回傳 400', async () => {
        const res = await app.request('/user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                oldPassword: 'wrong-old-password',
                newPassword: 'a-new-password',
            }),
        });

        expect(res.status).toBe(400);
        const body = await res.json() as any;
        expect(body.message).toBe('舊密碼不正確');
    });

    it('修改密碼失敗: 未提供 token, 應該回傳 401', async () => {
        const res = await app.request('/user/change-password', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                oldPassword: testUser.password,
                newPassword: 'a-new-password',
            }),
        });

        expect(res.status).toBe(401);
    });

    it('修改密碼失敗: 提供無效 token, 應該回傳 401', async () => {
        const res = await app.request('/user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer invalid-token',
            },
            body: JSON.stringify({
                oldPassword: testUser.password,
                newPassword: 'a-new-password',
            }),
        });

        expect(res.status).toBe(401);
    });

    it('修改密碼失敗: 缺少 newPassword, 應該回傳 400', async () => {
        const res = await app.request('/user/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({ oldPassword: testUser.password }),
        });

        expect(res.status).toBe(400);
    });
});