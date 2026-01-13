import { db } from '../utils/db';
import { courses } from '../db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { CreateCourse, UpdateCourse } from '~~/shared/schemas/course.schema';

export const courseService = {
  async getAll(userId: number) {
    return await db.select()
      .from(courses)
      .where(eq(courses.userId, userId))
      .orderBy(desc(courses.startedAt));
  },

  async create(userId: number, data: CreateCourse) {
    const [created] = await db.insert(courses).values({
      ...data,
      userId,
    }).returning();
    return created;
  },

  async update(userId: number, id: number, data: UpdateCourse) {
    const [updated] = await db.update(courses)
      .set(data)
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning();
    return updated;
  },

  async delete(userId: number, id: number) {
    const [deleted] = await db.delete(courses)
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning();
    return deleted;
  }
};
