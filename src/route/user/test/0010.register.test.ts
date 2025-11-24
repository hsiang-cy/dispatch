import { describe, it, expect, beforeEach } from 'bun:test'
import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { HTTPException } from 'hono/http-exception'

import { registerHandlers } from '../api/0010.register.ts'
import { type RegisterResponse } from '../dto/0010.register.dto.ts'

// Helper function to generate random user data
const generateRandomUserData = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 15);
    return {
        account: `testuser_${randomSuffix}`,
        password: 'password123',
        email: `test_${randomSuffix}@example.com`,
        name: `Test User ${randomSuffix}`,
    };
};

describe('POST /register 註冊', () => {
    const app = new Hono()

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
        return c.json({ message: 'Internal Server Error' }, 500)
    })

    app.post('/register', ...registerHandlers)


    it('註冊成功：應該回傳 201 和使用者資料', async () => {
        const userData = generateRandomUserData();
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        expect(res.status).toBe(201)

        const body = await res.json() as RegisterResponse

        expect(body.message).toBe('使用者註冊成功')
        expect(body.data?.account).toBe(userData.account)

        // 真的去查資料庫，確認資料有寫入
        const users = await drizzleORM.select().from(schema.user)
        expect(users.length).toBe(1)
        expect(users[0]?.account).toBe(userData.account)
    })

    it('重複註冊 account, 應該回傳 400', async () => {
        const userData = generateRandomUserData();

        // First registration
        await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        // Second registration with duplicate account
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account, // Duplicate account
                password: userData.password,
                email: generateRandomUserData().email, // Different email
                name: userData.name,
            }),
        })

        expect(res.status).toBe(400)

        const body = await res.json() as any

        expect(body.message).toBe('帳號或電子郵件已存在')
    })

    it('重複註冊 email, 應該回傳 400', async () => {
        const userData = generateRandomUserData();

        // First registration
        await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        })

        // Second registration with duplicate email
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: generateRandomUserData().account, // Different account
                password: userData.password,
                email: userData.email, // Duplicate email
                name: userData.name,
            }),
        })

        expect(res.status).toBe(400)

        const body = await res.json() as any

        expect(body.message).toBe('帳號或電子郵件已存在')
    })

    it('缺少 password, 應該回傳 400', async () => {
        const userData = generateRandomUserData();
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account,
                email: userData.email,
                name: userData.name,
            }),
        })

        expect(res.status).toBe(400)
    })

    it('缺少 account, 應該回傳 400', async () => {
        const userData = generateRandomUserData();
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                password: userData.password,
                email: userData.email,
                name: userData.name,
            }),
        })

        expect(res.status).toBe(400)
    })

    it('缺少 email, 應該回傳 400', async () => {
        const userData = generateRandomUserData();
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account,
                password: userData.password,
                name: userData.name,
            }),
        })

        expect(res.status).toBe(400)
    })

    it('缺少 name, 應該回傳 400', async () => {
        const userData = generateRandomUserData();
        const res = await app.request('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: userData.account,
                password: userData.password,
                email: userData.email,
            }),
        })

        expect(res.status).toBe(400)
    })
})