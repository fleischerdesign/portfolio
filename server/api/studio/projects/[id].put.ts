import { projects, projectTranslations, categories, tags, technologies, projectsToTags, projectsToTechnologies } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { projectUpdateSchema, type ProjectUpdate } from '~~/shared/schemas/project.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const body = await readBody(event);
  const validation = projectUpdateSchema.safeParse(body);

  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: validation.error.format(),
    });
  }

  const data: ProjectUpdate = validation.data;

  const result = await db.transaction(async (tx) => {
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
      categoryName, tags: tagNames, techstack: techNames,
      locale, slug, title, subtitle, body: contentBody, features, learned, challenges,
      translationKey,
      ...entityData
    } = data;

    await tx.update(projects).set({
      ...entityData,
      publishedAt: entityData.publishedAt ? new Date(entityData.publishedAt) : undefined,
      categoryId: categoryId,
    }).where(eq(projects.id, id));

    if (locale && slug && title && contentBody) {
        await tx.insert(projectTranslations).values({
            projectId: id,
            locale: locale!,
            slug: slug!,
            title: title!,
            subtitle,
            body: contentBody!,
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
    }

    if (tagNames) {
      await tx.delete(projectsToTags).where(eq(projectsToTags.projectId, id));
      for (const tagName of tagNames) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
        let tag = await tx.query.tags.findFirst({ where: eq(tags.slug, tagSlug) });
        if (!tag) {
          [tag] = await tx.insert(tags).values({ name: tagName, slug: tagSlug }).returning();
        }
        await tx.insert(projectsToTags).values({ projectId: id, tagId: tag.id }).onConflictDoNothing();
      }
    }

    if (techNames) {
      await tx.delete(projectsToTechnologies).where(eq(projectsToTechnologies.projectId, id));
      for (const techName of techNames) {
        const techSlug = techName.toLowerCase().replace(/\s+/g, '-');
        let tech = await tx.query.technologies.findFirst({ where: eq(technologies.slug, techSlug) });
        if (!tech) {
          [tech] = await tx.insert(technologies).values({ name: techName, slug: techSlug }).returning();
        }
        await tx.insert(projectsToTechnologies).values({ projectId: id, technologyId: tech.id }).onConflictDoNothing();
      }
    }

    return await tx.query.projects.findFirst({ where: eq(projects.id, id) });
  });

  return { result };
});