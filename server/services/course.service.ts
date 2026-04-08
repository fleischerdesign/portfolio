import { db } from "../utils/db";
import { courses } from "../db/schema";
import { eq, desc, and } from "drizzle-orm";
import type {
  CourseCreate,
  CourseUpdate,
} from "~~/shared/schemas/course.schema";
import { createLogger } from "../utils/logger";

const logger = createLogger("course");

export const courseService = {
  async getAll(userId: number) {
    logger.info("getAll", `Fetching courses for user: ${userId}`);

    const result = await db.query.courses.findMany({
      where: eq(courses.userId, userId),
      orderBy: [desc(courses.startedAt)],
    });

    logger.info("getAll", `Found ${result.length} courses`);
    return result;
  },

  async getById(userId: number, id: number) {
    logger.info("getById", `Fetching course: ${id}`);

    const course = await db.query.courses.findFirst({
      where: and(eq(courses.id, id), eq(courses.userId, userId)),
    });

    if (!course) {
      logger.warn("getById", `Course not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Course not found",
      });
    }

    logger.info("getById", `Found course: ${id}`);
    return course;
  },

  async create(userId: number, data: CourseCreate) {
    logger.info("create", "Creating new course", { userId });

    const [created] = await db
      .insert(courses)
      .values({
        ...data,
        userId,
      })
      .returning();

    logger.info("create", `Created course with id: ${created?.id}`);
    return created;
  },

  async update(userId: number, id: number, data: CourseUpdate) {
    logger.info("update", `Updating course: ${id}`);

    const [updated] = await db
      .update(courses)
      .set(data)
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning();

    if (!updated) {
      logger.warn("update", `Course not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Course not found",
      });
    }

    logger.info("update", `Updated course: ${id}`);
    return updated;
  },

  async delete(userId: number, id: number) {
    logger.info("delete", `Deleting course: ${id}`);

    const [deleted] = await db
      .delete(courses)
      .where(and(eq(courses.id, id), eq(courses.userId, userId)))
      .returning();

    if (!deleted) {
      logger.warn("delete", `Course not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Course not found",
      });
    }

    logger.info("delete", `Deleted course: ${id}`);
    return deleted;
  },
};
