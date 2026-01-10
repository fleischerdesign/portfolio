
import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { projectCreateSchema, type ProjectCreate } from '~~/shared/schemas/project.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readBody(event);
  const validation = projectCreateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: ProjectCreate = validation.data;

  const result = await db.transaction(async (tx) => {
    // 1. Get or create Category
    let categoryId = data.categoryId;
    if (!categoryId && data.categoryName) {
      const slug = data.categoryName.toLowerCase().replace(/\s+/g, '-');
      const existing = await tx.query.categories.findFirst({ where: eq(categories.slug, slug) });
      if (existing) {
        categoryId = existing.id;
      } else {
        const [inserted] = await tx.insert(categories).values({ name: data.categoryName, slug }).returning();
        categoryId = inserted.id;
      }
    }

    const { 
      categoryName, tags: tagNames, techstack: techNames, // Relations
      locale, slug, title, subtitle, body: contentBody, features, learned, challenges, // Translation
      translationKey, // ID
      ...entityData // status, publishedAt, coverImage...
    } = data;

    // 2. Get or Create Entity
    let project = await tx.query.projects.findFirst({ 
      where: eq(projects.translationKey, translationKey) 
    });

    if (!project) {
      [project] = await tx.insert(projects).values({
        translationKey,
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : null,
        categoryId,
        authorId: event.context.user?.id
      }).returning();
    } else {
      await tx.update(projects).set({
        ...entityData,
        publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : project.publishedAt,
        categoryId: categoryId || project.categoryId,
      }).where(eq(projects.id, project.id));
    }

    // 3. Create or Update Translation
    await tx.insert(projectTranslations).values({
      projectId: project.id,
      locale,
      slug,
      title,
      subtitle,
      body: contentBody,
      features,
      learned,
      challenges
    }).onConflictDoUpdate({
      target: [projectTranslations.projectId, projectTranslations.locale],
      set: {
        slug,
        title,
        subtitle,
        body: contentBody,
        features,
        learned,
        challenges,
        updatedAt: new Date()
      }
    });

    // 4. Sync Tags
    if (tagNames) {
      await tx.delete(projectsToTags).where(eq(projectsToTags.projectId, project.id));
      for (const tagName of tagNames) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
        let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
        if (!tag) {
          [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
        }
        await tx.insert(projectsToTags).values({ projectId: project.id, tagId: tag.id }).onConflictDoNothing();
      }
    }

    // 5. Sync Techstack
    if (techNames) {
      await tx.delete(projectsToTechnologies).where(eq(projectsToTechnologies.projectId, project.id));
      for (const techName of techNames) {
        const techSlug = techName.toLowerCase().replace(/\s+/g, '-');
        let tech = await tx.query.technologies.findFirst({ where: eq(technologies.slug, techSlug) });
        if (!tech) {
          [tech] = await tx.insert(technologies).values({ name: techName, slug: techSlug }).returning();
        }
        await tx.insert(projectsToTechnologies).values({ projectId: project.id, technologyId: tech.id }).onConflictDoNothing();
      }
    }

    return project;
  });

  return { result };
});
