import type { ProjectUpdate, ProjectStudioResponse } from '~~/shared/schemas/project.schema';
import { useLocalizedEditor, editorHelpers } from './useLocalizedEditor';

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

/**
 * @composable useProjectEditor
 * @description Composable for managing project editing in the studio.
 */
export function useProjectEditor(projectId: number, initialData: Ref<any>, refreshProject: () => Promise<void>) {
  return useLocalizedEditor<any, ProjectStudioResponse, ProjectCommon, ProjectLocalized, ProjectUpdate>(
    projectId,
    initialData,
    (data) => data?.project,
    refreshProject,
    (id) => `/api/studio/projects/${id}`,
    {
      toEditor: (p) => ({
        common: {
          status: p.status,
          publishedAt: editorHelpers.formatDate(p.publishedAt),
          coverImage: p.coverImage,
          coverImageAlt: p.coverImageAlt || null,
          icon: p.icon || null,
          repoUrl: p.repoUrl || null,
          projectUrl: p.projectUrl || null,
          categoryName: p.category?.name || null,
          tags: p.tags.map((t: any) => t.name).filter(Boolean),
          techstack: p.techstack.map((t: any) => t.name).filter(Boolean),
          translationKey: p.translationKey
        },
        ...editorHelpers.mapTranslations(p.translations, { 
          title: '', subtitle: '', body: '', slug: '', features: [], learned: [], challenges: [] 
        })
      }),
      toPayload: (common, localized, locale) => editorHelpers.preparePayload(common, localized, locale)
    }
  );
}
