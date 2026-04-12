import { db } from "~~/server/utils/db";
import { technologies, projectsToTechnologies } from "~~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const rows = await db
    .select({
      id: technologies.id,
      slug: technologies.slug,
      name: technologies.name,
      icon: technologies.icon,
      featured: technologies.featured,
      projectCount: sql<number>`COUNT(${projectsToTechnologies.projectId})`,
    })
    .from(technologies)
    .leftJoin(
      projectsToTechnologies,
      eq(technologies.id, projectsToTechnologies.technologyId),
    )
    .groupBy(technologies.id)
    .orderBy(technologies.name);

  return { technologies: rows };
});
