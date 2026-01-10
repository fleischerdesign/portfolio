
<script setup lang="ts">
import { useBlogEditor } from '~/composables/useBlogEditor';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin,
  layout: 'default' // or admin if we had one, but we use contextual nav
});

const route = useRoute();
const { render } = useMarkdown();
const { t } = useI18n();

const postId = parseInt(route.params.id as string);
const { data, refresh } = await useFetch(`/api/studio/blog/${postId}`);

const { state, currentLocale, activeTranslation, save, isLoading } = useBlogEditor(postId, data);

const showPreview = ref(true);

const renderedBody = computed(() => render(activeTranslation.value.body));
</script>

<template>
  <div class="container mx-auto max-w-screen-2xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    
    <!-- HEADER TOOLBAR -->
    <div class="sticky top-24 z-40 mb-8 -mx-4 px-4 py-4 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
       <div class="flex items-center gap-4">
          <UiBackButton :to="$localePath('/studio/blog')" />
          <h1 class="text-xl font-bold truncate">Edit: {{ activeTranslation.title || 'Untitled' }}</h1>
       </div>

       <div class="flex items-center gap-4">
          <!-- Locale Switcher -->
          <div class="flex bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
             <button 
                v-for="lang in ['de', 'en']" 
                :key="lang"
                @click="currentLocale = lang"
                class="px-3 py-1 text-xs font-bold uppercase rounded-md transition-all"
                :class="currentLocale === lang ? 'bg-white dark:bg-neutral-800 shadow-sm text-secondary-600' : 'text-neutral-500 hover:text-neutral-900'"
             >
                {{ lang }}
             </button>
          </div>

          <UiButton :is-loading="isLoading" @click="save">
             <Icon name="heroicons:check" class="mr-2" /> Save
          </UiButton>
       </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
       
       <!-- MAIN EDITOR -->
       <div class="lg:col-span-2 space-y-6">
          
          <UiCard>
             <UiCardContainer class="space-y-4 p-6">
                <UiInput label="Title" v-model="activeTranslation.title" class="text-lg font-bold" />
                <UiInput label="Slug" v-model="activeTranslation.slug" class="font-mono text-sm text-neutral-500" />
                <UiInput label="Excerpt" v-model="activeTranslation.excerpt" as="textarea" rows="3" />
             </UiCardContainer>
          </UiCard>

          <UiCard class="overflow-hidden flex flex-col min-h-[600px]">
             <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-2 bg-neutral-50 dark:bg-neutral-900/50">
                <span class="text-xs font-bold uppercase tracking-widest text-neutral-500">Content</span>
                <button @click="showPreview = !showPreview" class="text-xs font-medium text-secondary-600 hover:underline">
                   {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
                </button>
             </div>
             
             <div class="flex flex-1 h-full">
                <!-- Editor Input -->
                <div class="flex-1 h-full relative">
                   <textarea 
                      v-model="activeTranslation.body" 
                      class="w-full h-full p-6 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed"
                      placeholder="# Write your story..."
                   ></textarea>
                </div>

                <!-- Live Preview -->
                <div v-if="showPreview" class="flex-1 h-full border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30 overflow-y-auto max-h-[800px] p-6">
                   <div class="prose prose-sm dark:prose-invert max-w-none" v-html="renderedBody"></div>
                </div>
             </div>
          </UiCard>

       </div>

       <!-- SIDEBAR SETTINGS -->
       <div class="space-y-6">
          <UiCard>
             <UiCardContainer class="p-6 space-y-6">
                <h3 class="text-sm font-black uppercase tracking-widest text-neutral-500">Settings</h3>
                
                <UiSelect 
                   label="Status" 
                   v-model="state.common.status" 
                   :options="['draft', 'published', 'archived']"
                />

                <UiInput label="Translation Key" v-model="state.common.translationKey" disabled class="opacity-50 cursor-not-allowed" />

                <UiInput label="Publish Date" v-model="state.common.publishedAt" type="datetime-local" />
             </UiCardContainer>
          </UiCard>

          <UiCard>
             <UiCardContainer class="p-6 space-y-6">
                <h3 class="text-sm font-black uppercase tracking-widest text-neutral-500">Media</h3>
                <UiInput label="Cover Image URL" v-model="state.common.coverImage" />
                <img v-if="state.common.coverImage" :src="state.common.coverImage" class="w-full h-32 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700" />
                <UiInput label="Alt Text" v-model="state.common.coverImageAlt" />
             </UiCardContainer>
          </UiCard>

          <UiCard>
             <UiCardContainer class="p-6 space-y-6">
                <h3 class="text-sm font-black uppercase tracking-widest text-neutral-500">Taxonomy</h3>
                <UiInput label="Category" v-model="state.common.categoryName" />
                
                <!-- Simple Tag Input (Comma separated) -->
                <div>
                   <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tags</label>
                   <input 
                      :value="state.common.tags.join(', ')"
                      @input="e => state.common.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)"
                      class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent"
                      placeholder="vue, nuxt, tutorial"
                   />
                   <div class="mt-2 flex flex-wrap gap-2">
                      <UiChip v-for="tag in state.common.tags" :key="tag" size="xs">{{ tag }}</UiChip>
                   </div>
                </div>
             </UiCardContainer>
          </UiCard>
       </div>

    </div>
  </div>
</template>
