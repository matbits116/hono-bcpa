import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/*', cors())

interface User {
  id: string
  name: string
  email: string
  password: string
}

const users: User[] = []

const generateId = () => Math.random().toString(36).substring(2, 15)

app.get('/users', (c) => {
  return c.json(users)
})

app.get('/users/:id', (c) => {
  const id = c.req.param('id')
  const user = users.find((u) => u.id === id)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json(user)
})

app.post('/signup', async (c) => {
  const body = await c.req.json<{ name: string; email: string; password: string }>()
  const { name, email, password } = body

  const existingUser = users.find((u) => u.email === email)
  if (existingUser) {
    return c.json({ error: 'Email already exists' }, 400)
  }

  const newUser: User = {
    id: generateId(),
    name,
    email,
    password,
  }
  users.push(newUser)
  return c.json({ id: newUser.id, name: newUser.name, email: newUser.email })
})

app.post('/signin', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()
  const { email, password } = body

  const user = users.find((u) => u.email === email)
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (user.password !== password) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  return c.json({ id: user.id, name: user.name, email: user.email })
})

export default app