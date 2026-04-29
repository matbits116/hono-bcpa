import { db } from '../db'
import { posts, type NewPost, type Post } from '../db/schema'
import { eq } from 'drizzle-orm'

export const postService = {
  async getAllPosts(): Promise<Post[]> {
    return db.select().from(posts)
  },

  async getPostById(id: string): Promise<Post | undefined> {
    const result = await db.select().from(posts).where(eq(posts.id, id))
    return result[0]
  },

  async getPostsByUserId(userId: string): Promise<Post[]> {
    return db.select().from(posts).where(eq(posts.userId, userId))
  },

  async createPost(data: NewPost): Promise<Post> {
    const result = await db.insert(posts).values(data).returning()
    return result[0]
  },
}