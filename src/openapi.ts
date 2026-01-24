import { createDocument } from 'zod-openapi'
import {
  registerOpenApiPath,
  loginOpenApiPath,
  changePasswordOpenApiPath,
  destinationRoute,
  destinationOpenApiPath,
  orderOpenApiPath
  // updateDestinationOpenApiPath,
  // deleteDestinationOpenApiPath
} from '#route/route.index.ts'

export const openApiDoc: ReturnType<typeof createDocument> = createDocument({
  openapi: '3.1.0',
  info: { title: 'Dispatch API 文檔', version: '1.0.0' },
  servers: [
    {
      url: 'http://localhost:3000',
      description: '開發環境'
    }
  ],
  paths: {
    // user
    // ...registerOpenApiPath,
    // ...loginOpenApiPath,
    // ...changePasswordOpenApiPath,

    // destination
    ...destinationOpenApiPath,

    // order
    ...orderOpenApiPath

  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
})

export const stoplight = `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <title>Elements API Docs</title>
            <style>
              body {
                margin: 0;
                font-family: 'Playfair Display', serif;
              }
            </style>
            <link rel="stylesheet" href="https://unpkg.com/@stoplight/elements/styles.min.css">
          </head>
          <body>
            <elements-api
              apiDescriptionUrl="/doc"
              router="hash"
              layout="sidebar"
            />
            <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
          </body>
        </html>
      `