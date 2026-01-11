
import { blogPosts } from '~~/server/db/schema';
import { desc } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const query = getQuery(event);
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  const posts = await db.query.blogPosts.findMany({
    limit,
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
