import { Hono } from "hono";

import { addVehicle } from "./api/101.addVehicle.ts";

export const vehicleRoute = new Hono()
    .route('/add', addVehicle)
