import type { BlogPostUpdate, BlogPostStudioResponse } from '~~/shared/schemas/blog.schema';

export function useBlogEditor(postId: number, initialData: Ref<{ post: BlogPostStudioResponse } | null | undefined>, refreshPost: () => Promise<void>) {
  const { showToast } = useToast();
  const isLoading = ref(false);
  const isEditing = ref(false);
  const currentLocale = ref<'de' | 'en'>('de');

  const editablePost = ref<{
    common: {
      status: 'draft' | 'published' | 'archived';
      publishedAt: string | null;
      coverImage: string | null;
      coverImageAlt: string | null;
      categoryName: string | null;
      tags: string[];
      translationKey: string;
    };
    de: { title: string; body: string; slug: string; excerpt: string };
    en: { title: string; body: string; slug: string; excerpt: string };
  } | null>(null);

  function parseData(data: { post: BlogPostStudioResponse }) {
    if (!data?.post) return null;
    const p = data.post;

    const newState = {
      common: {
        status: p.status,
        publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : null,
        coverImage: p.coverImage,
        coverImageAlt: p.coverImageAlt,
        categoryName: p.category?.name || null,
        tags: p.tags.map((t) => t.name).filter((t): t is string => !!t),
        translationKey: p.translationKey
      },
      de: { title: '', body: '', slug: '', excerpt: '' },
      en: { title: '', body: '', slug: '', excerpt: '' }
    };

    p.translations.forEach((t) => {
      if (t.locale === 'de' || t.locale === 'en') {
        newState[t.locale] = {
          title: t.title,
          excerpt: t.excerpt || '',
          body: t.body,
          slug: t.slug
        };
      }
    });
    
    return newState;
  }

  function startEditing() {
    if (!initialData.value) return;
    editablePost.value = parseData(toRaw(initialData.value));
    isEditing.value = true;
  }

  function cancelEditing() {
    isEditing.value = false;
    editablePost.value = null;
  }

  async function save() {
    if (!editablePost.value) return;
    isLoading.value = true;
    try {
      const activeTranslation = editablePost.value[currentLocale.value];
      
      let pubDate = undefined;
      if (editablePost.value.common.publishedAt) {
          const dateVal = new Date(editablePost.value.common.publishedAt);
          if (!isNaN(dateVal.getTime())) {
              pubDate = dateVal.toISOString();
          }
      }

      const payload: BlogPostUpdate = {
        ...editablePost.value.common,
        coverImage: editablePost.value.common.coverImage || null,
        coverImageAlt: editablePost.value.common.coverImageAlt || null,
        categoryName: editablePost.value.common.categoryName || null,
        publishedAt: pubDate,

        locale: currentLocale.value,
        title: activeTranslation.title,
        excerpt: activeTranslation.excerpt || null,
        body: activeTranslation.body,
        slug: activeTranslation.slug,
      };

      await $fetch(`/api/studio/blog/${postId}`, {
        method: 'PUT',
        body: payload
      });

      await refreshPost();
      isEditing.value = false;
      showToast('Post saved successfully', { type: 'success' });
    } catch (error) {
      console.error(error);
      showToast('Failed to save post', { type: 'error' });
    } finally {
      isLoading.value = false;
    }
  }

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
