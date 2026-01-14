import type { ProjectUpdate, ProjectStudioResponse } from '~~/shared/schemas/project.schema';
import { useLocalizedEditor } from './useLocalizedEditor';

type SerializedProjectStudioResponse = Omit<ProjectStudioResponse, 'publishedAt' | 'createdAt'> & {
  publishedAt: string | null;
  createdAt: string | null;
};

interface RawProjectData {
  project: SerializedProjectStudioResponse | ProjectStudioResponse;
}

type ProjectCommon = {
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

type ProjectLocalized = {
  title: string; 
  subtitle: string; 
  body: string; 
  slug: string; 
  features: string[]; 
  learned: string[]; 
  challenges: string[];
};

export function useProjectEditor(projectId: number, initialData: Ref<RawProjectData | null | undefined>, refreshProject: () => Promise<void>) {
  
  const { isEditing, isLoading, currentLocale, editableData: editableProject, startEditing, cancelEditing, save } = useLocalizedEditor<any, any, ProjectCommon, ProjectLocalized, ProjectUpdate>(
    projectId,
    initialData,
    (data) => data?.project,
    refreshProject,
    (id) => `/api/studio/projects/${id}`,
    {
      toEditor: (p) => {
        const common: ProjectCommon = {
            status: p.status,
            publishedAt: p.publishedAt ? new Date(p.publishedAt).toISOString().slice(0, 16) : null,
            coverImage: p.coverImage,
            coverImageAlt: p.coverImageAlt || null,
            icon: p.icon || null,
            repoUrl: p.repoUrl || null,
            projectUrl: p.projectUrl || null,
            categoryName: p.category?.name || null,
            tags: p.tags.map((t: any) => t.name).filter((t: string) => t !== ''),
            techstack: p.techstack.map((t: any) => t.name).filter((t: string) => t !== ''),
            translationKey: p.translationKey
        };

        const de: ProjectLocalized = { title: '', subtitle: '', body: '', slug: '', features: [], learned: [], challenges: [] };
        const en: ProjectLocalized = { title: '', subtitle: '', body: '', slug: '', features: [], learned: [], challenges: [] };

        p.translations.forEach((t: any) => {
          if (t.locale === 'de') {
             de.title = t.title; de.subtitle = t.subtitle || ''; de.body = t.body; de.slug = t.slug; 
             de.features = t.features || []; de.learned = t.learned || []; de.challenges = t.challenges || [];
          } else if (t.locale === 'en') {
             en.title = t.title; en.subtitle = t.subtitle || ''; en.body = t.body; en.slug = t.slug;
             en.features = t.features || []; en.learned = t.learned || []; en.challenges = t.challenges || [];
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
          icon: common.icon || null,
          repoUrl: common.repoUrl || null,
          projectUrl: common.projectUrl || null,
          categoryName: common.categoryName || null,
          publishedAt: pubDate,

          locale,
          title: localized.title,
          subtitle: localized.subtitle || null,
          body: localized.body,
          slug: localized.slug,
          features: localized.features,
          learned: localized.learned,
          challenges: localized.challenges
        } satisfies ProjectUpdate;
      }
    }
  );

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
