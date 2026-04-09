import type { BlogPostUpdate, BlogPostStudioResponse } from '~~/shared/schemas/blog.schema';
import { useLocalizedEditor, editorHelpers } from './useLocalizedEditor';

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

/**
 * @composable useBlogEditor
 * @description Composable for managing blog post editing in the studio.
 */
export function useBlogEditor(postId: number, initialData: Ref<any>, refreshPost: () => Promise<void>) {
  return useLocalizedEditor<any, BlogPostStudioResponse, BlogCommon, BlogLocalized, BlogPostUpdate>(
    postId,
    initialData,
    (data) => data?.post,
    refreshPost,
    (id) => `/api/studio/blog/${id}`,
    {
      toEditor: (p) => ({
        common: {
          status: p.status,
          publishedAt: editorHelpers.formatDate(p.publishedAt),
          coverImage: p.coverImage,
          coverImageAlt: p.coverImageAlt,
          categoryName: p.category?.name || null,
          tags: p.tags.map((t: any) => t.name).filter(Boolean),
          translationKey: p.translationKey
        },
        ...editorHelpers.mapTranslations(p.translations, { title: '', body: '', slug: '', excerpt: '' })
      }),
      toPayload: (common, localized, locale) => editorHelpers.preparePayload(common, localized, locale)
    }
  );
}
