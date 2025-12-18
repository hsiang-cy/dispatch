import { factory } from '#factory'
import { requestParamsCheck } from '#helpers/formatTypeboxCheckError.ts'
import { HTTPException } from 'hono/http-exception'
import { drizzleORM, schema } from '#db'
import { jwtAuth } from '#middleware'
import { type GetDestinationsRequest, GetDestinationsRequestValidator } from '../dto/2020.getDestinations.dto.ts'
import { or, and, eq, ilike } from 'drizzle-orm'

export const getDestinationHandlers = factory.createHandlers(
    jwtAuth,
    async (c) => {
        const req = c.req.query() as any
        const query: GetDestinationsRequest = {
            ...(req.id && { id: parseInt(req.id) }),
            ...(req.limit && { limit: parseInt(req.limit) }),
            ...(req.isDepot && { isDepot: req.isDepot === 'false' ? false : (req.isDepot === 'true' ? true : undefined) }),
            ...(req.policy && { policy: req.policy }),
            ...(req.name && { name: req.name }),
            ...(req.address && { address: req.address }),
        }
        // console.log(JSON.stringify(query))

        const data = requestParamsCheck(query, GetDestinationsRequestValidator)
        // console.log(Object.keys(data).length);
        if (Object.keys(data).length === 0) return c.json({ message: '無須更新' })

        let result
        if (data.policy && data.policy === 'and') {
            result = await drizzleORM.select().from(schema.destination).where(
                and(
                    data?.id ? eq(schema.destination.id, data.id) : undefined,
                    data?.isDepot !== undefined ? eq(schema.destination.is_depot, data.isDepot) : undefined,
                    data?.name ? ilike(schema.destination.name, `%${data.name}%`) : undefined,
                    data?.address ? ilike(schema.destination.address, `%${data.address}%`) : undefined,
                )
            ).limit(data?.limit || 10);

            return c.json(result);


        } else if (data.policy && data.policy === 'or') {
            result = await drizzleORM.select().from(schema.destination).where(
                or(
                    data?.id ? eq(schema.destination.id, data.id) : undefined,
                    data?.isDepot !== undefined ? eq(schema.destination.is_depot, data.isDepot) : undefined,
                    data?.name ? ilike(schema.destination.name, `%${data.name}%`) : undefined,
                    data?.address ? ilike(schema.destination.address, `%${data.address}%`) : undefined,
                )
            ).limit(data?.limit || 10);

            return c.json(result);
        }

        // return c.json({ data: result })

    })

/*
xh localhost:3000/api/user/login account=john_doe password=password123
xh localhost:3000/api/destination/getDestinations name=haha id=3 isDepot=true address=台中市 limit=5 Authorization:"Bearer token" Content-Type:"applictation/json"
*/