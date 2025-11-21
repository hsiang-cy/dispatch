import { Hono } from "hono";

import { addVehicle } from "./api/1010.addVehicle.ts";

export const vehicleRoute = new Hono()
    .route('/add', addVehicle)
