
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const API_BASE = process.argv[2] || 'http://localhost:3000/api';
const API_KEY = process.argv[3]; // Optional master key

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 180;
  const wordCount = text.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

async function migrate() {
  console.log(`🚀 Starting content migration to ${API_BASE}...`);

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (API_KEY) headers['X-Api-Key'] = API_KEY;

  const locales = ['de', 'en'];
  const collections = ['blog', 'projects'];

  for (const locale of locales) {
    for (const collection of collections) {
      const dirPath = path.join(CONTENT_DIR, locale, collection);

      let files: string[];
      try {
        files = fs.readdirSync(dirPath);
      } catch {
        console.warn(`⚠️  Skipping ${locale}/${collection} (not found)`);
        continue;
      }

      for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(dirPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const translationKey = file.replace('.md', '');
        const slug = data.slug || translationKey;

        console.log(`📄 Processing ${locale}/${collection}/${slug}...`);

        let endpoint = '';
        let payload: Record<string, unknown> = {};

        if (collection === 'blog') {
          endpoint = `${API_BASE}/blog`;

          payload = {
            translationKey,
            locale,
            slug,
            title: data.title,
            excerpt: data.description || null,
            body: content,
            status: (data.published ?? true) ? 'published' : 'draft',
            publishedAt: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
            coverImage: data.image?.src || null,
            coverImageAlt: data.image?.alt || null,
            readingTime: data.readingTime || calculateReadingTime(content),
            categoryName: data.category || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
          };

        } else if (collection === 'projects') {
          endpoint = `${API_BASE}/projects`;

          payload = {
            translationKey,
            locale,
            slug,
            title: data.title,
            subtitle: data.subtitle || null,
            body: content,
            status: (data.published ?? true) ? 'published' : 'draft',
            publishedAt: data.date ? new Date(data.date).toISOString() : null,
            coverImage: data.image?.src || null,
            coverImageAlt: data.image?.alt || null,
            repoUrl: data.url?.repository || null,
            projectUrl: data.url?.project || null,
            features: Array.isArray(data.features) ? data.features : [],
            learned: Array.isArray(data.learned) ? data.learned : [],
            challenges: Array.isArray(data.challenges) ? data.challenges : [],
            categoryName: data.category || null,
            tags: Array.isArray(data.tags) ? data.tags : [],
            techstack: Array.isArray(data.techstack) ? data.techstack : [],
          };
        }

        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const err = await res.json();
            console.error(`❌ Failed: ${JSON.stringify(err, null, 2)}`);
          } else {
            console.log(`✅ Synced: ${slug}`);
          }
        } catch (error) {
          console.error(`❌ Network error: ${error.message}`);
        }
      }
    }
  }

  console.log('Migration finished.');
}

migrate().catch(console.error);
