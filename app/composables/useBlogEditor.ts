import type { BlogPostUpdate, BlogPostStudioResponse } from '~~/shared/schemas/blog.schema';
import { useLocalizedEditor } from './useLocalizedEditor';

type SerializedBlogPostStudioResponse = Omit<BlogPostStudioResponse, 'publishedAt' | 'createdAt'> & {
  publishedAt: string | null;
  createdAt: string | null;
};

type BlogCommon = {
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  coverImage: string | null;
  coverImageAlt: string | null;
  categoryName: string | null;
  tags: string[];
  translationKey: string;
};

type BlogLocalized = { 
  title: string; 
  body: string; 
  slug: string; 
  excerpt: string 
};

export function useBlogEditor(postId: number, initialData: Ref<{ post: SerializedBlogPostStudioResponse | BlogPostStudioResponse } | null | undefined>, refreshPost: () => Promise<void>) {
  
  const { isEditing, isLoading, currentLocale, editableData: editablePost, startEditing, cancelEditing, save } = useLocalizedEditor(
    postId,
    initialData,
    (data) => data?.post,
    refreshPost,
    (id) => `/api/studio/blog/${id}`,
    {
      toEditor: (p) => {
        const common: BlogCommon = {
            status: p.status,
            publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : null,
            coverImage: p.coverImage,
            coverImageAlt: p.coverImageAlt,
            categoryName: p.category?.name || null,
            tags: p.tags.map((t) => t.name).filter((t): t is string => !!t),
            translationKey: p.translationKey
        };

        const de: BlogLocalized = { title: '', body: '', slug: '', excerpt: '' };
        const en: BlogLocalized = { title: '', body: '', slug: '', excerpt: '' };

        p.translations.forEach((t) => {
          if (t.locale === 'de') {
             de.title = t.title; de.body = t.body; de.slug = t.slug; de.excerpt = t.excerpt || '';
          } else if (t.locale === 'en') {
             en.title = t.title; en.body = t.body; en.slug = t.slug; en.excerpt = t.excerpt || '';
          }
        });

        return { common, de, en };
      },
      toPayload: (common, localized, locale) => {
        let pubDate = undefined;
        if (common.publishedAt) {
            const dateVal = new Date(common.publishedAt);
            if (!isNaN(dateVal.getTime())) {
                pubDate = dateVal;
            }
        }

        return {
          ...common,
          coverImage: common.coverImage || null,
          coverImageAlt: common.coverImageAlt || null,
          categoryName: common.categoryName || null,
          publishedAt: pubDate,

          locale,
          title: localized.title,
          excerpt: localized.excerpt || null,
          body: localized.body,
          slug: localized.slug,
        } satisfies BlogPostUpdate;
      }
    }
  );

  return {
    isEditing,
    isLoading,
    currentLocale,
    editablePost,
    startEditing,
    cancelEditing,
    save
  };
}
