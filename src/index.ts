import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
import userRoute from '#route/user/user.route.ts'

console.log('App haha.')
const app = new Hono()

// middleware
// app.use('*', prettyJSON())


// routes
app.route('/api/user', userRoute)
    .get('/', (c) => c.json({ message: 'Hello from /api' }))

export default app

