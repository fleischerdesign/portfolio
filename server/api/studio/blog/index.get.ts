
import { blogPosts } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const posts = await db.query.blogPosts.findMany({
    with: {
      translations: true,
      category: true,
      author: true
    },
    orderBy: [desc(blogPosts.createdAt)]
  });

  // Wir geben die rohen Daten zurück, das Frontend kümmert sich um die Darstellung (welche Sprache primär ist etc.)
  return { posts };
});
