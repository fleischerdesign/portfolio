
import type { BlogPostDetailResponse, BlogPostUpdate } from '~~/shared/schemas/blog.schema';

export const useBlogEditor = (postId: number, initialData: Ref<any>) => {
  const { showToast } = useToast();
  const router = useRouter();
  const localePath = useLocalePath();
  
  const isLoading = ref(false);
  const currentLocale = ref<'de' | 'en'>('de');

  // Internal state to hold data for ALL languages
  const state = ref<{
    common: {
      status: 'draft' | 'published' | 'archived';
      publishedAt: string | null;
      coverImage: string | null;
      coverImageAlt: string | null;
      categoryName: string | null;
      tags: string[];
      translationKey: string;
    };
    de: { title: string; subtitle: string; body: string; slug: string; excerpt: string };
    en: { title: string; subtitle: string; body: string; slug: string; excerpt: string };
  }>({
    common: {
      status: 'draft',
      publishedAt: null,
      coverImage: null,
      coverImageAlt: null,
      categoryName: null,
      tags: [],
      translationKey: ''
    },
    de: { title: '', subtitle: '', body: '', slug: '', excerpt: '' },
    en: { title: '', subtitle: '', body: '', slug: '', excerpt: '' }
  });

  // Initialize state from API data
  watch(initialData, (data) => {
    if (!data?.post) return;
    const p = data.post;

    state.value.common = {
      status: p.status,
      publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : null,
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt,
      categoryName: p.category?.name || null,
      tags: p.tags.map((t: any) => t.name),
      translationKey: p.translationKey
    };

    // Map translations
    p.translations.forEach((t: any) => {
      if (t.locale === 'de' || t.locale === 'en') {
        state.value[t.locale as 'de' | 'en'] = {
          title: t.title,
          subtitle: '', // Blog has no subtitle in schema, but maybe we want it? using excerpt instead
          excerpt: t.excerpt || '',
          body: t.body,
          slug: t.slug
        };
      }
    });
  }, { immediate: true });

  const activeTranslation = computed(() => state.value[currentLocale.value]);

  async function save() {
    isLoading.value = true;
    try {
      // Construct payload for the CURRENT language tab (or we could save all?)
      // Our API expects one locale at a time for the translation part.
      // Strategy: Save the currently active locale translation AND the common data.
      
      const payload: BlogPostUpdate = {
        ...state.value.common,
        // Translation data for current locale
        locale: currentLocale.value,
        title: activeTranslation.value.title,
        excerpt: activeTranslation.value.excerpt,
        body: activeTranslation.value.body,
        slug: activeTranslation.value.slug,
      };

      await $fetch(`/api/studio/blog/${postId}`, {
        method: 'PUT',
        body: payload
      });

      showToast('Post saved successfully', { type: 'success' });
    } catch (error) {
      console.error(error);
      showToast('Failed to save post', { type: 'error' });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    state,
    currentLocale,
    activeTranslation,
    save,
    isLoading
  };
};
