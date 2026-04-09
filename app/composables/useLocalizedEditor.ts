import { useEditor } from './useEditor';
import { LOCALES, type AppLocale, DEFAULT_LOCALE } from '~~/shared/utils/locales';

/**
 * @interface EditorState
 * @description Shared state for localized entities in the editor.
 */
export interface EditorState<TCommon, TLocalized> {
  common: TCommon;
  de: TLocalized;
  en: TLocalized;
  [key: string]: TCommon | TLocalized | AppLocale; // Allow dynamic access via currentLocale
}

/**
 * @utility editorHelpers
 * @description Standardized mapping functions for the localized editor.
 */
export const editorHelpers = {
  /**
   * Maps translations from a raw array to a localized state object.
   */
  mapTranslations: <TLocalized extends object>(translations: unknown[], defaults: TLocalized): { de: TLocalized, en: TLocalized } => {
    const de = { ...defaults };
    const en = { ...defaults };

    (translations as Array<TLocalized & { locale: string }>).forEach((t) => {
      if (t.locale === 'de') Object.assign(de, t);
      else if (t.locale === 'en') Object.assign(en, t);
    });

    return { de, en };
  },

  /**
   * Safely formats a date for use in datetime-local inputs.
   */
  formatDate: (date: string | Date | null | undefined): string | null => {
    if (!date) return null;
    const dateVal = new Date(date);
    return !isNaN(dateVal.getTime()) ? dateVal.toISOString().slice(0, 16) : null;
  },

  /**
   * Cleans up common fields and ensures dates are proper objects or undefined.
   */
  preparePayload: <TCommon, TLocalized>(common: TCommon, localized: TLocalized, locale: AppLocale): TCommon & TLocalized & { locale: AppLocale } => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload = { ...common, ...localized, locale } as any;
    
    // Auto-convert common fields
    if (payload.publishedAt) {
      const dateVal = new Date(payload.publishedAt as string);
      payload.publishedAt = !isNaN(dateVal.getTime()) ? dateVal : undefined;
    }

    return payload;
  }
};

/**
 * @composable useLocalizedEditor
 * @description A generic composable for managing multi-locale entity editing.
 */
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
        transformers.toPayload(state.common, state[locale] as TLocalized, locale)
      );
    },
    onSave: async (payloads) => {
      await Promise.all(payloads.map(payload => 
        $fetch(endpointFactory(id), {
          method: 'PUT',
          body: payload as Record<string, unknown>
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
