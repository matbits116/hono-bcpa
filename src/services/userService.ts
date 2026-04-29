import { db } from '../db'
import { users, type NewUser, type User } from '../db/schema'
import { eq } from 'drizzle-orm'

export const userService = {
  async getAllUsers(): Promise<User[]> {
    return db.select().from(users)
  },

  async getUserById(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id))
    return result[0]
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email))
    return result[0]
  },

  async createUser(data: NewUser): Promise<User> {
    const result = await db.insert(users).values(data).returning()
    return result[0]
  },
}