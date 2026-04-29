import { Hono } from 'hono'
import { cors } from 'hono/cors'
import usersRouter from './routes/users'
import postsRouter from './routes/posts'
import commentsRouter from './routes/comments'

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
  return c.json({ message: 'Hono REST API' })
})

app.route('/users', usersRouter)
app.route('/posts', postsRouter)
app.route('/comments', commentsRouter)

export default app