import { Hono } from 'hono'
import { userService } from '../services/userService'

const usersRouter = new Hono()

usersRouter.get('/', async (c) => {
  const users = await userService.getAllUsers()
  return c.json(users)
})

usersRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const user = await userService.getUserById(id)
  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }
  return c.json(user)
})

usersRouter.post('/', async (c) => {
  const body = await c.req.json<{ name: string; email: string; password: string }>()
  const { name, email, password } = body

  const existingUser = await userService.getUserByEmail(email)
  if (existingUser) {
    return c.json({ error: 'Email already exists' }, 400)
  }

  const id = crypto.randomUUID()
  const newUser = await userService.createUser({ id, name, email, password })
  return c.json({ id: newUser.id, name: newUser.name, email: newUser.email }, 201)
})

usersRouter.post('/signup', async (c) => {
  const body = await c.req.json<{ name: string; email: string; password: string }>()
  const { name, email, password } = body

  const existingUser = await userService.getUserByEmail(email)
  if (existingUser) {
    return c.json({ error: 'Email already exists' }, 400)
  }

  const id = crypto.randomUUID()
  const newUser = await userService.createUser({ id, name, email, password })
  return c.json({ id: newUser.id, name: newUser.name, email: newUser.email }, 201)
})

usersRouter.post('/signin', async (c) => {
  const body = await c.req.json<{ email: string; password: string }>()
  const { email, password } = body

  const user = await userService.getUserByEmail(email)
  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (user.password !== password) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  return c.json({ id: user.id, name: user.name, email: user.email })
})

export default usersRouter