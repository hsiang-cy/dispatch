import { Hono } from 'hono'
import { addDestinationHandlers } from './api/2010.addDestination.ts'
import { getDestinationHandlers } from './api/2020.getDestinatioins.api.ts'
import { updateDestinationHandlers } from './api/2030.updateDestination.api.ts'

export const destinationRoute = new Hono()
    .post('/add', ...addDestinationHandlers)
    .get('/getDestinations', ...getDestinationHandlers)
    .put('/updateDestination/:destinationId', ...updateDestinationHandlers)



import { addDestinationOpenApiPath } from './dto/2010.addDestination.dto.ts'
import { getDestinationsOpenApiPath } from './dto/2020.getDestinations.dto.ts'
import { updateDestinationOpenApiPath } from './dto/2030.updateDestination.dto.ts'

export const destinationOpenApiPath = {
    ...addDestinationOpenApiPath,
    ...getDestinationsOpenApiPath,
    ...updateDestinationOpenApiPath
}


