import { Hono } from "hono";
import { drizzleORM, schema } from "#db";

export const addVehicle = new Hono()
    // .post('/', async (c) => {
    //     const data = await c.req.json();
    //     // const add = await drizzleORM.insert(schema.vehicle).values({
            
    //     // })

    //     return c.json({ message: 'Vehicle created', data: body }, 201);
    // });