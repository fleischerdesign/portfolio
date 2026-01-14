import { db } from '../server/utils/db.ts';
import { users, projects, projectTranslations, blogPosts, blogPostTranslations, categories, tags, blogPostsToTags, projectsToTags } from '../server/db/schema.ts';
import { slugify } from '../shared/utils/slugify.ts';

async function seed() {
  console.log('🌱 Seeding database...');

  // 1. User
  console.log('Creating User...');
  await db.insert(users).values({
    authProviderId: 'github:12345',
    email: 'test@example.com',
    name: 'Philipp Fleischer',
    role: 'admin',
    summary: 'Full Stack Developer & Designer',
    availabilityStatus: 'Open for projects',
    city: 'Berlin',
    country: { de: 'Deutschland', en: 'Germany' },
    zipcode: '10115',
    street: 'Tech Lane',
    houseNumber: '42'
  }).onConflictDoNothing();

  // 2. Categories
  console.log('Creating Categories...');
  const cats = ['Development', 'Design', 'Tutorial'];
  const catIds = [];
  for (const name of cats) {
    const [c] = await db.insert(categories).values({ name, slug: slugify(name) }).returning();
    catIds.push(c.id);
  }

  // 3. Tags
  console.log('Creating Tags...');
  const tagNames = ['Vue', 'Nuxt', 'TypeScript', 'Tailwind', 'Drizzle'];
  const tagIds = [];
  for (const name of tagNames) {
    const [t] = await db.insert(tags).values({ name, slug: slugify(name) }).returning();
    tagIds.push(t.id);
  }

  // 4. Projects
  console.log('Creating Projects...');
  for (let i = 1; i <= 3; i++) {
    const [p] = await db.insert(projects).values({
      translationKey: `project-${i}`,
      categoryId: catIds[0],
      status: 'published',
      publishedAt: new Date(),
      coverImage: '/img/grafana.jpg', // Placeholder
    }).returning();

    await db.insert(projectTranslations).values([
      {
        projectId: p.id,
        locale: 'de',
        slug: `projekt-${i}`,
        title: `Projekt ${i}`,
        subtitle: 'Eine kurze Beschreibung auf Deutsch.',
        body: '# Hallo Welt\nDies ist ein Testprojekt.',
        features: ['Feature A', 'Feature B'],
      },
      {
        projectId: p.id,
        locale: 'en',
        slug: `project-${i}`,
        title: `Project ${i}`,
        subtitle: 'A short description in English.',
        body: '# Hello World\nThis is a test project.',
        features: ['Feature A', 'Feature B'],
      }
    ]);
    
    // Link Tags
    await db.insert(projectsToTags).values({ projectId: p.id, tagId: tagIds[0] });
  }

  // 5. Blog Posts
  console.log('Creating Blog Posts...');
  for (let i = 1; i <= 3; i++) {
    const [b] = await db.insert(blogPosts).values({
      translationKey: `blog-${i}`,
      categoryId: catIds[1],
      status: 'published',
      publishedAt: new Date(),
      coverImage: '/img/grafana.jpg',
      readingTime: 5
    }).returning();

    await db.insert(blogPostTranslations).values([
      {
        blogPostId: b.id,
        locale: 'de',
        slug: `artikel-${i}`,
        title: `Blog Artikel ${i}`,
        excerpt: 'Ein kurzer Auszug des Artikels.',
        body: '## Inhalt\nHier steht viel Text.',
      },
      {
        blogPostId: b.id,
        locale: 'en',
        slug: `article-${i}`,
        title: `Blog Article ${i}`,
        excerpt: 'A short excerpt of the article.',
        body: '## Content\nHere is a lot of text.',
      }
    ]);

    await db.insert(blogPostsToTags).values({ blogPostId: b.id, tagId: tagIds[1] });
  }

  console.log('✅ Seeding complete!');
}

seed().catch(console.error);
