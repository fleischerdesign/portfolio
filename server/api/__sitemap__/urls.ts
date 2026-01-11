
import { blogPosts, projects } from '~~/server/db/schema';
import { defineSitemapEventHandler } from '#imports';
import { eq } from 'drizzle-orm';

export default defineSitemapEventHandler(async () => {
  // Only include published posts in the sitemap
  const [allPosts, allProjects] = await Promise.all([
    db.query.blogPosts.findMany({
      where: eq(blogPosts.status, 'published'),
      with: { translations: true }
    }),
    db.query.projects.findMany({
      where: eq(projects.status, 'published'),
      with: { translations: true }
    })
  ]);

  const sitemapEntries: Array<{
    loc: string;
    lastmod: Date | string | undefined;
    _sitemap: string;
    alternatives: Array<{ hreflang: string; href: string }>;
  }> = [];

  const sitemapMap: Record<string, string> = {
    en: 'en-US',
    de: 'de-DE'
  };

  // Blog Posts
  for (const post of allPosts) {
    for (const trans of post.translations) {
      const alternatives = post.translations.map(t => ({
        hreflang: t.locale === 'en' ? 'en-US' : 'de-DE',
        href: `/${t.locale}/blog/${t.slug}`
      }));
      
      // Set x-default to English
      alternatives.push({
        hreflang: 'x-default',
        href: `/en/blog/${post.translations.find(t => t.locale === 'en')?.slug || trans.slug}`
      });

      sitemapEntries.push({
        loc: `/${trans.locale}/blog/${trans.slug}`,
        lastmod: (trans.updatedAt ? new Date(trans.updatedAt) : post.publishedAt) || undefined,
        _sitemap: sitemapMap[trans.locale],
        alternatives
      });
    }
  }

  // Projects
  for (const project of allProjects) {
    for (const trans of project.translations) {
      const alternatives = project.translations.map(t => ({
        hreflang: t.locale === 'en' ? 'en-US' : 'de-DE',
        href: `/${t.locale}/projects/${t.slug}`
      }));

      alternatives.push({
        hreflang: 'x-default',
        href: `/en/projects/${project.translations.find(t => t.locale === 'en')?.slug || trans.slug}`
      });

      sitemapEntries.push({
        loc: `/${trans.locale}/projects/${trans.slug}`,
        lastmod: (trans.updatedAt ? new Date(trans.updatedAt) : project.publishedAt) || undefined,
        _sitemap: sitemapMap[trans.locale],
        alternatives
      });
    }
  }

  return sitemapEntries;
});
