import {
  projects,
  projectTranslations,
  categories,
  tags,
  technologies,
  projectsToTags,
  projectsToTechnologies,
} from "~~/server/db/schema";
import { desc, eq } from "drizzle-orm";
import {
  projectResponseSchema,
  projectStudioResponseSchema,
  type ProjectResponse,
  type ProjectUpdate,
  type ProjectCreate,
} from "~~/shared/schemas/project.schema";
import { createLogger } from "../utils/logger";
import {
  createTranslatableEntityService,
  type TranslatableEntityDescriptor,
} from "../utils/db.engine";

const logger = createLogger("project");

const projectDescriptor: TranslatableEntityDescriptor<
  typeof projects,
  typeof projectTranslations,
  ProjectCreate
> = {
  mainTable: projects,
  translationTable: projectTranslations,
  parentColumnName: "projectId",
  categoriesTable: categories,
  relations: {
    tags: {
      junctionTable: projectsToTags,
      lookupTable: tags,
      parentColumn: projectsToTags.projectId,
      lookupColumn: projectsToTags.tagId,
    },
    techstack: {
      junctionTable: projectsToTechnologies,
      lookupTable: technologies,
      parentColumn: projectsToTechnologies.projectId,
      lookupColumn: projectsToTechnologies.technologyId,
    },
  },
};

const engine = createTranslatableEntityService(projectDescriptor);

export const projectService = {
  ...engine,

  async getPublicAll(
    locale: AppLocale,
    limit?: number,
  ): Promise<ProjectResponse[]> {
    logger.info("getPublicAll", `Fetching projects for locale: ${locale}`, {
      limit,
    });

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

    return allProjects
      .filter((p) => p.translations[0])
      .map((p) => {
        const translation = p.translations[0]!;
        return projectResponseSchema.parse({ ...p, ...translation });
      });
  },

  async getPublicBySlug(
    slug: string,
    locale: AppLocale,
  ): Promise<ProjectResponse | null> {
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

    if (!translation?.project || translation.project.status !== "published")
      return null;

    return projectResponseSchema.parse({
      ...translation.project,
      ...translation,
    });
  },

  async getStudioAll(limit?: number) {
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

    return allProjects.map((p) => projectStudioResponseSchema.parse(p));
  },

  async getStudioById(id: number) {
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
      throw createError({
        statusCode: 404,
        statusMessage: "Project not found",
      });
    }

    return projectStudioResponseSchema.parse(project);
  },

  async create(data: ProjectCreate, authorId?: number) {
    logger.info("create", "Creating new project", { authorId });
    return await db.transaction(async (tx) => {
      return await engine.create(tx, data, authorId);
    });
  },

  async update(id: number, data: ProjectUpdate) {
    logger.info("update", `Updating project with id: ${id}`);
    return await db.transaction(async (tx) => {
      return await engine.update(tx, id, data);
    });
  },
};
