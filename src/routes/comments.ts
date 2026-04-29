import { Hono } from 'hono'
import { commentService } from '../services/commentService'

const commentsRouter = new Hono()

commentsRouter.get('/', async (c) => {
  const comments = await commentService.getAllComments()
  return c.json(comments)
})

commentsRouter.get('/:id', async (c) => {
  const id = c.req.param('id')
  const comment = await commentService.getCommentById(id)
  if (!comment) {
    return c.json({ error: 'Comment not found' }, 404)
  }
  return c.json(comment)
})

commentsRouter.get('/post/:postId', async (c) => {
  const postId = c.req.param('postId')
  const comments = await commentService.getCommentsByPostId(postId)
  return c.json(comments)
})

commentsRouter.post('/', async (c) => {
  const body = await c.req.json<{ postId: string; content: string }>()
  const { postId, content } = body

  const id = crypto.randomUUID()
  const newComment = await commentService.createComment({ id, postId, content })
  return c.json(newComment, 201)
})

export default commentsRouter