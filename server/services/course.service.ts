import { courses } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type {
  CourseCreate,
  CourseUpdate,
} from "~~/shared/schemas/course.schema";
import { createLogger } from "../utils/logger";
import { createEntityService, type EntityDescriptor } from "../utils/db.engine";

const logger = createLogger("course");

const courseDescriptor: EntityDescriptor<typeof courses> = {
  mainTable: courses,
};

const engine = createEntityService(courseDescriptor);

export const courseService = {
  ...engine,

  async getAll(userId: number) {
    logger.info("getAll", `Fetching courses for user: ${userId}`);
    return await db.query.courses.findMany({
      where: eq(courses.userId, userId),
      orderBy: [desc(courses.startedAt)],
    });
  },

  async getById(userId: number, id: number) {
    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, id), eq(courses.userId, userId)),
    });
    if (!course)
      throw createError({ statusCode: 404, statusMessage: "Course not found" });
    return course;
  },

  async create(userId: number, data: CourseCreate) {
    return await db.transaction(async (tx) => {
      return await engine.create(tx, { ...data, userId });
    });
  },

  async update(userId: number, id: number, data: CourseUpdate) {
    return await db.transaction(async (tx) => {
      const course = await tx.query.courses.findFirst({
        where: and(eq(courses.id, id), eq(courses.userId, userId)),
      });
      if (!course)
        throw createError({
          statusCode: 404,
          statusMessage: "Course not found",
        });
      return await engine.update(tx, id, data);
    });
  },

  async delete(userId: number, id: number) {
    const [deleted] = await db
      .delete(courses)
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning();
    if (!deleted)
      throw createError({ statusCode: 404, statusMessage: "Course not found" });
    return deleted;
  },
};
