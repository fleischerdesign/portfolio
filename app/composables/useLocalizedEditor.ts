import { useEditor } from './useEditor';
import { LOCALES, type AppLocale, DEFAULT_LOCALE } from '~~/shared/utils/locales';

export interface EditorState<TCommon, TLocalized> {
  common: TCommon;
  de: TLocalized;
  en: TLocalized;
}

export function useLocalizedEditor<
  TRawData,
  TEntity, 
  TCommon, 
  TLocalized, 
  TPayload 
>(
  id: number,
  initialData: Ref<TRawData | null | undefined>,
  extractor: (data: TRawData) => TEntity | null | undefined,
  refresh: () => Promise<void>,
  endpointFactory: (id: number) => string,
  transformers: {
    toEditor: (entity: TEntity) => EditorState<TCommon, TLocalized>;
    toPayload: (common: TCommon, localized: TLocalized, locale: AppLocale) => TPayload;
  }
) {
  const currentLocale = ref<AppLocale>(DEFAULT_LOCALE);
  
  const { 
    isEditing, 
    isLoading, 
    editableData, 
    startEditing, 
    cancelEditing, 
    save 
  } = useEditor<TRawData, EditorState<TCommon, TLocalized>, TPayload[]>({
    initialData,
    refresh,
    toState: (raw) => {
      const entity = extractor(raw);
      if (!entity) throw new Error("Entity not found in initial data");
      return transformers.toEditor(entity);
    },
    toPayload: (state) => {
      return LOCALES.map(locale => 
        transformers.toPayload(state.common, state[locale], locale)
      );
    },
    onSave: async (payloads) => {
      await Promise.all(payloads.map(payload => 
        $fetch(endpointFactory(id), {
          method: 'PUT',
          body: payload as any
        })
      ));
    }
  });

  return {
    isEditing,
    isLoading,
    currentLocale,
    editableData,
    startEditing,
    cancelEditing,
    save
  };
}
