import { db } from '../db'
import { comments, type NewComment, type Comment } from '../db/schema'
import { eq } from 'drizzle-orm'

export const commentService = {
  async getAllComments(): Promise<Comment[]> {
    return db.select().from(comments)
  },

  async getCommentById(id: string): Promise<Comment | undefined> {
    const result = await db.select().from(comments).where(eq(comments.id, id))
    return result[0]
  },

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return db.select().from(comments).where(eq(comments.postId, postId))
  },

  async createComment(data: NewComment): Promise<Comment> {
    const result = await db.insert(comments).values(data).returning()
    return result[0]
  },
}