import {
  projects,
  projectTranslations,
  categories,
  tags,
  technologies,
  projectsToTags,
  projectsToTechnologies,
} from "~~/server/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import {
  projectResponseSchema,
  projectStudioResponseSchema,
  type ProjectResponse,
  type ProjectUpdate,
  type ProjectCreate,
} from "~~/shared/schemas/project.schema";
import { slugify } from "~~/shared/utils/slugify";
import { createLogger } from "../utils/logger";

const logger = createLogger("project");

export const projectService = {
  async getPublicAll(
    locale: AppLocale,
    limit?: number,
  ): Promise<ProjectResponse[]> {
    logger.info(
      "getPublicAll",
      `Fetching published projects for locale: ${locale}`,
      { limit },
    );

    const allProjects = await db.query.projects.findMany({
      where: (p, { eq }) => eq(p.status, "published"),
      limit,
      with: {
        translations: { where: (trans, { eq }) => eq(trans.locale, locale) },
        category: true,
        tags: { with: { tag: true } },
        techstack: { with: { technology: true } },
        author: true,
      },
      orderBy: [desc(projects.publishedAt)],
    });

    logger.info(
      "getPublicAll",
      `Found ${allProjects.length} published projects`,
    );

    return allProjects
      .filter((p) => p.translations[0])
      .map((p) => {
        const translation = p.translations[0]!;
        return projectResponseSchema.parse({
          ...p,
          ...translation,
        });
      });
  },

  async getPublicBySlug(
    slug: string,
    locale: AppLocale,
  ): Promise<ProjectResponse | null> {
    logger.info("getPublicBySlug", `Fetching project with slug: ${slug}`, {
      locale,
    });

    const translation = await db.query.projectTranslations.findFirst({
      where: (t, { eq, and }) => and(eq(t.slug, slug), eq(t.locale, locale)),
      with: {
        project: {
          with: {
            category: true,
            tags: { with: { tag: true } },
            techstack: { with: { technology: true } },
            author: true,
          },
        },
      },
    });

    if (!translation?.project || translation.project.status !== "published") {
      logger.warn(
        "getPublicBySlug",
        `Project not found or not published: ${slug}`,
      );
      return null;
    }

    logger.info("getPublicBySlug", `Found project: ${slug}`);

    return projectResponseSchema.parse({
      ...translation.project,
      ...translation,
    });
  },

  async getStudioAll(limit?: number) {
    logger.info("getStudioAll", "Fetching all projects for studio", { limit });

    const allProjects = await db.query.projects.findMany({
      limit,
      with: {
        translations: true,
        category: true,
        author: true,
        tags: { with: { tag: true } },
        techstack: { with: { technology: true } },
      },
      orderBy: [desc(projects.createdAt)],
    });

    logger.info("getStudioAll", `Found ${allProjects.length} projects`);

    return allProjects.map((p) => projectStudioResponseSchema.parse(p));
  },

  async getStudioById(id: number) {
    logger.info("getStudioById", `Fetching project with id: ${id}`);

    const project = await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        translations: true,
        category: true,
        tags: { with: { tag: true } },
        techstack: { with: { technology: true } },
        author: true,
      },
    });

    if (!project) {
      logger.warn("getStudioById", `Project not found: ${id}`);
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    logger.info("getStudioById", `Found project: ${id}`);
    return projectStudioResponseSchema.parse(project);
  },

  async create(data: ProjectCreate, authorId?: number) {
    logger.info("create", "Creating new project", { authorId });

    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (data.categoryName) {
        const slug = slugify(data.categoryName);
        const [category] = await tx
          .insert(categories)
          .values({ slug, name: data.categoryName })
          .onConflictDoUpdate({
            target: categories.slug,
            set: { name: data.categoryName },
          })
          .returning({ id: categories.id });
        categoryId = category?.id;
      }

      const {
        categoryName,
        tags: tagNames,
        techstack: techNames,
        locale,
        slug,
        title,
        subtitle,
        body,
        features,
        learned,
        challenges,
        translationKey,
        ...entityData
      } = data;

      let project = await tx.query.projects.findFirst({
        where: eq(projects.translationKey, translationKey),
      });

      if (!project) {
        [project] = await tx
          .insert(projects)
          .values({
            translationKey,
            ...entityData,
            publishedAt: entityData.publishedAt
              ? new Date(entityData.publishedAt)
              : null,
            categoryId,
            authorId,
          })
          .returning();
      } else {
        await tx
          .update(projects)
          .set({
            ...entityData,
            publishedAt: entityData.publishedAt
              ? new Date(entityData.publishedAt)
              : project.publishedAt,
            categoryId: categoryId || project.categoryId,
          })
          .where(eq(projects.id, project.id));
      }

      await tx
        .insert(projectTranslations)
        .values({
          projectId: project!.id,
          locale,
          slug,
          title,
          subtitle,
          body,
          features,
          learned,
          challenges,
        })
        .onConflictDoUpdate({
          target: [projectTranslations.projectId, projectTranslations.locale],
          set: {
            slug,
            title,
            subtitle,
            body,
            features,
            learned,
            challenges,
            updatedAt: new Date(),
          },
        });

      if (tagNames && tagNames.length > 0) {
        const tagData = tagNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTags = await tx
          .insert(tags)
          .values(tagData)
          .onConflictDoUpdate({
            target: tags.slug,
            set: { name: tags.name },
          })
          .returning({ id: tags.id, slug: tags.slug });

        const existingTags = await tx
          .select({ id: tags.id, slug: tags.slug })
          .from(tags)
          .where(
            inArray(
              tags.slug,
              tagData.map((t) => t.slug),
            ),
          );

        const allTags = newTags.concat(
          existingTags.filter((e) => !newTags.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(projectsToTags)
          .values(allTags.map((t) => ({ projectId: project!.id, tagId: t.id })))
          .onConflictDoNothing({
            target: [projectsToTags.projectId, projectsToTags.tagId],
          });
      }

      if (techNames && techNames.length > 0) {
        const techData = techNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTechs = await tx
          .insert(technologies)
          .values(techData)
          .onConflictDoUpdate({
            target: technologies.slug,
            set: { name: technologies.name },
          })
          .returning({ id: technologies.id, slug: technologies.slug });

        const existingTechs = await tx
          .select({ id: technologies.id, slug: technologies.slug })
          .from(technologies)
          .where(
            inArray(
              technologies.slug,
              techData.map((t) => t.slug),
            ),
          );

        const allTechs = newTechs.concat(
          existingTechs.filter((e) => !newTechs.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(projectsToTechnologies)
          .values(
            allTechs.map((t) => ({
              projectId: project!.id,
              technologyId: t.id,
            })),
          )
          .onConflictDoNothing({
            target: [
              projectsToTechnologies.projectId,
              projectsToTechnologies.technologyId,
            ],
          });
      }

      logger.info("create", `Created project with id: ${project!.id}`);
      return project;
    });
  },

  async update(id: number, data: ProjectUpdate) {
    logger.info("update", `Updating project with id: ${id}`);

    return await db.transaction(async (tx) => {
      let categoryId = data.categoryId;
      if (data.categoryName) {
        const slug = slugify(data.categoryName);
        const [category] = await tx
          .insert(categories)
          .values({ slug, name: data.categoryName })
          .onConflictDoUpdate({
            target: categories.slug,
            set: { name: data.categoryName },
          })
          .returning({ id: categories.id });
        categoryId = category?.id;
      }

      const {
        categoryName,
        tags: tagNames,
        techstack: techNames,
        locale,
        slug,
        title,
        subtitle,
        body,
        features,
        learned,
        challenges,
        translationKey,
        ...entityData
      } = data;

      await tx
        .update(projects)
        .set({
          ...entityData,
          publishedAt: entityData.publishedAt
            ? new Date(entityData.publishedAt)
            : undefined,
          categoryId,
        })
        .where(eq(projects.id, id));

      if (locale && slug && title && body) {
        await tx
          .insert(projectTranslations)
          .values({
            projectId: id,
            locale,
            slug,
            title,
            subtitle,
            body,
            features,
            learned,
            challenges,
          })
          .onConflictDoUpdate({
            target: [projectTranslations.projectId, projectTranslations.locale],
            set: {
              slug,
              title,
              subtitle,
              body,
              features,
              learned,
              challenges,
              updatedAt: new Date(),
            },
          });
      }

      if (tagNames && tagNames.length > 0) {
        const tagData = tagNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTags = await tx
          .insert(tags)
          .values(tagData)
          .onConflictDoUpdate({
            target: tags.slug,
            set: { name: tags.name },
          })
          .returning({ id: tags.id, slug: tags.slug });

        const existingTags = await tx
          .select({ id: tags.id, slug: tags.slug })
          .from(tags)
          .where(
            inArray(
              tags.slug,
              tagData.map((t) => t.slug),
            ),
          );

        const allTags = newTags.concat(
          existingTags.filter((e) => !newTags.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(projectsToTags)
          .values(allTags.map((t) => ({ projectId: id, tagId: t.id })))
          .onConflictDoNothing({
            target: [projectsToTags.projectId, projectsToTags.tagId],
          });
      }

      if (techNames && techNames.length > 0) {
        const techData = techNames.map((name) => ({
          slug: slugify(name),
          name,
        }));

        const newTechs = await tx
          .insert(technologies)
          .values(techData)
          .onConflictDoUpdate({
            target: technologies.slug,
            set: { name: technologies.name },
          })
          .returning({ id: technologies.id, slug: technologies.slug });

        const existingTechs = await tx
          .select({ id: technologies.id, slug: technologies.slug })
          .from(technologies)
          .where(
            inArray(
              technologies.slug,
              techData.map((t) => t.slug),
            ),
          );

        const allTechs = newTechs.concat(
          existingTechs.filter((e) => !newTechs.find((n) => n.slug === e.slug)),
        );

        await tx
          .insert(projectsToTechnologies)
          .values(allTechs.map((t) => ({ projectId: id, technologyId: t.id })))
          .onConflictDoNothing({
            target: [
              projectsToTechnologies.projectId,
              projectsToTechnologies.technologyId,
            ],
          });
      }

      logger.info("update", `Updated project with id: ${id}`);

      return await tx.query.projects.findFirst({ where: eq(projects.id, id) });
    });
  },
};
