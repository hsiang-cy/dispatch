import { Hono } from 'hono'
import { drizzleORM, schema } from '#db'
import { HTTPException } from 'hono/http-exception'

import app from '#root/index.ts'
import { sleep } from 'bun'

describe('addDestination', () => {

    let authToken: any

    it('獲取 token ', async () => {

        const res = await app.request('/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: "john_doe",
                password: "password123"
            }),
        })
        const json = await res.json() as any
        expect(json.message).toBe('使用者登入成功')
        authToken = json.data?.token as string;
        expect(authToken).toBeTypeOf('string')
        expect(res.status).toBe(200)
    })

    it('新增地點', async () => {
        const res = await app.request('/api/destination/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                name: "測試地點",
                address: "測試地址",
                location: {
                    lat: 25.3333,
                    lng: 121.5566,
                },
                timeWindow: [
                    {
                        start: 480,
                        end: 720
                    }
                ],
                isDepot: false,
                comment: "這是備註...",
                operationTime: 0,
                demand: 0,
                priority: 0
            })

        })
        const json = await res.json() as any
        expect(json.message).toBe('地點新增成功')
        expect(res.status).toBe(201)
    })

    it('新增地點 > 錯誤的 body schema', async () => {
        const res = await app.request('/api/destination/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                address: "測試地址",
                location: {
                    lat: 25.3333,
                    lng: 121.5566,
                },
                timeWindow: [
                    {
                        start: 480,
                        end: 720
                    }
                ],
                isDepot: false,
                comment: "這是備註...",
                operationTime: 0,
                demand: 0,
                priority: 0
            })
        })
        const json = await res.json() as any
        expect(json.message).toBe('請求格式錯誤')
        expect(res.status).toBe(400)
    })
})