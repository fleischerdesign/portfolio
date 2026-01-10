
import { blogPosts } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const id = parseInt(getRouterParam(event, 'id') || '');

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' });

  const post = await db.query.blogPosts.findFirst({
    where: eq(blogPosts.id, id),
    with: {
      translations: true,
      category: true,
      tags: { with: { tag: true } },
      author: true
    }
  });

  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' });

  return { post };
});
