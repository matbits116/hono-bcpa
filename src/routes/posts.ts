import { Hono } from 'hono'
import { postService } from '../services/postService'

const postsRouter = new Hono()

postsRouter.get('/', async (c) => {
  const posts = await postService.getAllPosts()
  return c.json(posts)
})

postsRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const post = await postService.getPostById(id)
  if (!post) {
    return c.json({ error: 'Post not found' }, 404)
  }
  return c.json(post)
})

postsRouter.get('/user/:userId', async (c) => {
  const userId = c.req.param('userId')
  const posts = await postService.getPostsByUserId(userId)
  return c.json(posts)
})

postsRouter.post('/', async (c) => {
  const body = await c.req.json<{ userId: string; title: string; content: string }>()
  const { userId, title, content } = body

  const id = crypto.randomUUID()
  const newPost = await postService.createPost({ id, userId, title, content })
  return c.json(newPost, 201)
})

export default postsRouter