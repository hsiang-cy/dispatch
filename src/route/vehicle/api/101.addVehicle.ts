import { factory } from "../../../utils/factory.ts";
import { drizzleORM, schema } from "#db";

export const addVehicle = factory.createApp()
//     .post('/', async (c) => {
//         const data = await c.req.json();
//         const jwtPayload = c.get('jwtPayload');


//         return c.json({
//             message: 'Vehicle created',
//             user: `${jwtPayload.account}`
//         }, 201);
//     });