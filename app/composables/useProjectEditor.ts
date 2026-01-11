import type { ProjectUpdate, ProjectStudioResponse } from '~~/shared/schemas/project.schema';

interface RawProjectData {
  project: ProjectStudioResponse;
}

export function useProjectEditor(projectId: number, initialData: Ref<RawProjectData | null | undefined>, refreshProject: () => Promise<void>) {
  const { showToast } = useToast();
  const isLoading = ref(false);
  const isEditing = ref(false);
  const currentLocale = ref<'de' | 'en'>('de');

  const editableProject = ref<{
    common: {
      status: 'draft' | 'published' | 'archived';
      publishedAt: string | null;
      coverImage: string | null;
      coverImageAlt: string | null;
      icon: string | null;
      repoUrl: string | null;
      projectUrl: string | null;
      categoryName: string | null;
      tags: string[];
      techstack: string[];
      translationKey: string;
    };
    de: { title: string; subtitle: string; body: string; slug: string; features: string[]; learned: string[]; challenges: string[] };
    en: { title: string; subtitle: string; body: string; slug: string; features: string[]; learned: string[]; challenges: string[] };
  } | null>(null);

  function parseData(data: RawProjectData | null) {
    if (!data?.project) return null;
    const p = data.project;

    const newState = {
      common: {
        status: p.status,
        publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : null,
        coverImage: p.coverImage,
        coverImageAlt: p.coverImageAlt || null,
        icon: p.icon || null,
        repoUrl: p.repoUrl || null,
        projectUrl: p.projectUrl || null,
        categoryName: p.category?.name || null,
        tags: p.tags.map((t) => t.name).filter((t: string) => t !== ''),
        techstack: p.techstack.map((t) => t.name).filter((t: string) => t !== ''),
        translationKey: p.translationKey
      },
      de: { title: '', subtitle: '', body: '', slug: '', features: [] as string[], learned: [] as string[], challenges: [] as string[] },
      en: { title: '', subtitle: '', body: '', slug: '', features: [] as string[], learned: [] as string[], challenges: [] as string[] }
    };

    p.translations.forEach((t) => {
      if (t.locale === 'de' || t.locale === 'en') {
        newState[t.locale as 'de' | 'en'] = {
          title: t.title,
          subtitle: t.subtitle || '',
          body: t.body,
          slug: t.slug,
          features: t.features || [],
          learned: t.learned || [],
          challenges: t.challenges || []
        };
      }
    });
    
    return newState;
  }

  function startEditing() {
    if (!initialData.value) return;
    editableProject.value = parseData(toRaw(initialData.value));
    isEditing.value = true;
  }

  function cancelEditing() {
    isEditing.value = false;
    editableProject.value = null;
  }

  async function save() {
    if (!editableProject.value) return;
    isLoading.value = true;
    try {
      const activeTranslation = editableProject.value[currentLocale.value];
      
      let pubDate = undefined;
      if (editableProject.value.common.publishedAt) {
          const dateVal = new Date(editableProject.value.common.publishedAt);
          if (!isNaN(dateVal.getTime())) {
              pubDate = dateVal.toISOString();
          }
      }

      const payload: ProjectUpdate = {
        ...editableProject.value.common,
        coverImage: editableProject.value.common.coverImage || null,
        coverImageAlt: editableProject.value.common.coverImageAlt || null,
        icon: editableProject.value.common.icon || null,
        repoUrl: editableProject.value.common.repoUrl || null,
        projectUrl: editableProject.value.common.projectUrl || null,
        categoryName: editableProject.value.common.categoryName || null,
        publishedAt: pubDate,

        locale: currentLocale.value,
        title: activeTranslation.title,
        subtitle: activeTranslation.subtitle || null,
        body: activeTranslation.body,
        slug: activeTranslation.slug,
        features: activeTranslation.features,
        learned: activeTranslation.learned,
        challenges: activeTranslation.challenges
      };

      await $fetch(`/api/studio/projects/${projectId}`, {
        method: 'PUT',
        body: payload
      });

      await refreshProject();
      isEditing.value = false;
      showToast('Project saved successfully', { type: 'success' });
    } catch (error) {
      console.error(error);
      showToast('Failed to save project', { type: 'error' });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isEditing,
    isLoading,
    currentLocale,
    editableProject,
    startEditing,
    cancelEditing,
    save
  };
}
