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
  type ProjectCreate,
} from "~~/shared/schemas/project.schema";
import {
  createContentService,
  type EntityDescriptor,
} from "../utils/db.engine";

const projectDescriptor: EntityDescriptor<
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

export const projectService = createContentService({
  name: "project",
  entityName: "Project",
  descriptor: projectDescriptor,
  publicResponseSchema: projectResponseSchema,
  studioResponseSchema: projectStudioResponseSchema,
  queries: {
    async publishedList(locale, limit) {
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

    async publishedBySlug(slug, locale) {
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

    async studioList(limit) {
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

    async studioById(id) {
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

      return project ? projectStudioResponseSchema.parse(project) : null;
    },
  },
});
