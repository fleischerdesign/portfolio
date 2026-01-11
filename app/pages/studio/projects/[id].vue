<script setup lang="ts">
import { useProjectEditor } from '~/composables/useProjectEditor';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin,
  layout: 'default'
});

const route = useRoute();
const { render } = useMarkdown();
const { t } = useI18n();

const projectId = parseInt(route.params.id as string);
const { data, refresh } = await useFetch(`/api/studio/projects/${projectId}`);

const { isEditing, isLoading, currentLocale, editableProject, startEditing, cancelEditing, save } = useProjectEditor(projectId, data, refresh);

const project = computed(() => data.value?.project);

const viewTranslation = computed(() => {
  if (!project.value) return null;
  return project.value.translations.find((t: any) => t.locale === currentLocale.value) 
      || project.value.translations.find((t: any) => t.locale === 'en')
      || project.value.translations[0];
});

const renderedBody = computed(() => {
    if (isEditing.value && editableProject.value) {
        return render(editableProject.value[currentLocale.value].body);
    }
    return viewTranslation.value ? render(viewTranslation.value.body) : '';
});

const viewFormattedDate = computed(() => project.value?.publishedAt ? formatDate(project.value.publishedAt) : '');

function getStatusColor(status: string) {
    switch(status) {
        case 'published': return 'bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-400/50';
        case 'draft': return 'bg-amber-500 text-white shadow-amber-500/30 border-amber-400/50';
        case 'archived': return 'bg-neutral-500 text-white border-neutral-400/50';
        default: return 'bg-neutral-500';
    }
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    
    <div class="mb-12 flex flex-col gap-8">
        <div class="flex items-center justify-between">
            <UiBackButton :to="$localePath('/studio/projects')" />
        </div>

        <UiSectionHeader 
            v-if="project && viewTranslation && !isEditing"
            :level="1" 
            :title="viewTranslation.title" 
            :subtitle="viewTranslation.subtitle || ''" 
            symbol="mage:folder" 
        />
        <UiSectionHeader 
            v-else-if="isEditing && editableProject"
            :level="1" 
            :title="editableProject[currentLocale].title || 'Editing Project'" 
            subtitle="Showcase your work." 
            symbol="mage:folder" 
        />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        <div class="lg:col-span-3 space-y-12">
            <!-- View Mode Content -->
            <div v-if="!isEditing && project && viewTranslation" class="space-y-12">
                <div v-if="project.coverImage" class="group relative w-full aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-100 shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900">
                    <NuxtImg :src="project.coverImage" class="w-full h-full object-cover" />
                </div>
                
                <div class="prose prose-lg prose-neutral max-w-none dark:prose-invert" v-html="renderedBody"></div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UiCard v-if="viewTranslation.features?.length" class="p-6">
                        <h3 class="font-bold text-lg mb-4">Features</h3>
                        <ul class="list-disc pl-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <li v-for="item in viewTranslation.features" :key="item">{{ item }}</li>
                        </ul>
                    </UiCard>
                     <UiCard v-if="viewTranslation.learned?.length" class="p-6">
                        <h3 class="font-bold text-lg mb-4">Learned</h3>
                        <ul class="list-disc pl-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <li v-for="item in viewTranslation.learned" :key="item">{{ item }}</li>
                        </ul>
                    </UiCard>
                     <UiCard v-if="viewTranslation.challenges?.length" class="p-6">
                        <h3 class="font-bold text-lg mb-4">Challenges</h3>
                        <ul class="list-disc pl-4 space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                            <li v-for="item in viewTranslation.challenges" :key="item">{{ item }}</li>
                        </ul>
                    </UiCard>
                </div>
            </div>

            <!-- Edit Mode Content -->
            <div v-else-if="isEditing && editableProject" class="space-y-8">
                <UiCard>
                    <UiCardContainer class="p-8 space-y-6">
                        <UiInput id="project-title" label="Title" v-model="editableProject[currentLocale].title" class="text-xl font-bold" />
                        <UiInput id="project-slug" label="Slug" v-model="editableProject[currentLocale].slug" class="font-mono text-sm" />
                        <UiInput id="project-subtitle" label="Subtitle" v-model="editableProject[currentLocale].subtitle" as="textarea" rows="2" />
                        
                        <div class="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <UiImageUploader 
                                label="Cover Image" 
                                v-model="editableProject.common.coverImage" 
                                helper-text="Upload a representative cover image."
                            />
                            
                            <UiInput id="project-image-alt" label="Alt Text" v-model="editableProject.common.coverImageAlt" class="mt-4" />
                        </div>
                    </UiCardContainer>
                </UiCard>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                    <UiCard class="flex flex-col h-full overflow-hidden">
                        <div class="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Markdown</div>
                        <textarea 
                            v-model="editableProject[currentLocale].body" 
                            class="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed"
                        ></textarea>
                    </UiCard>
                    <UiCard class="flex flex-col h-full overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30">
                        <div class="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Preview</div>
                        <div class="flex-1 overflow-y-auto p-4 prose prose-sm dark:prose-invert max-w-none" v-html="renderedBody"></div>
                    </UiCard>
                </div>
                
                 <UiCard>
                    <UiCardContainer class="p-6 space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500">Details (Lists)</h3>
                        <div>
                             <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Features (one per line)</label>
                             <textarea 
                                :value="editableProject[currentLocale].features.join('\n')"
                                @input="e => editableProject![currentLocale].features = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                rows="5"
                             ></textarea>
                        </div>
                         <div>
                             <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Learned (one per line)</label>
                             <textarea 
                                :value="editableProject[currentLocale].learned.join('\n')"
                                @input="e => editableProject![currentLocale].learned = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                rows="5"
                             ></textarea>
                        </div>
                         <div>
                             <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Challenges (one per line)</label>
                             <textarea 
                                :value="editableProject[currentLocale].challenges.join('\n')"
                                @input="e => editableProject![currentLocale].challenges = (e.target as HTMLTextAreaElement).value.split('\n').filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                rows="5"
                             ></textarea>
                        </div>
                    </UiCardContainer>
                 </UiCard>
            </div>
        </div>

        <aside class="space-y-6 sticky top-24">
            <!-- Control Card -->
            <UiCard class="overflow-hidden border-secondary-500/10 shadow-lg shadow-secondary-500/5">
                <UiCardContainer class="p-6 space-y-6">
                    <div class="flex bg-neutral-100 dark:bg-neutral-900 rounded-lg p-1">
                        <button 
                            v-for="lang in ['de', 'en']" 
                            :key="lang"
                            @click="currentLocale = lang"
                            class="flex-1 px-3 py-2 text-xs font-bold uppercase rounded-md transition-all"
                            :class="currentLocale === lang ? 'bg-white dark:bg-neutral-800 shadow-sm text-secondary-600' : 'text-neutral-500 hover:text-neutral-900'"
                        >
                            {{ lang }}
                        </button>
                    </div>

                    <div class="flex flex-col gap-2">
                        <template v-if="!isEditing">
                            <UiButton class="w-full" variant="secondary" @click="startEditing">
                                <Icon name="heroicons:pencil-square" class="mr-2" /> Edit Project
                            </UiButton>
                        </template>
                        
                        <template v-else>
                            <UiButton class="w-full" :is-loading="isLoading" @click="save">Save Changes</UiButton>
                            <UiButton class="w-full" variant="ghost" @click="cancelEditing">Cancel</UiButton>
                        </template>
                    </div>
                </UiCardContainer>
            </UiCard>

            <UiCard v-if="!isEditing && project && viewTranslation" class="p-6">
                 <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-4">Meta Data</h3>
                 <div class="space-y-4 text-sm">
                      <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Status</span>
                        <div class="flex">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm capitalize" :class="getStatusColor(project.status)">
                                {{ project.status }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Icon</span>
                        <div class="flex items-center gap-2">
                            <Icon :name="project.icon || 'heroicons:question-mark-circle'" class="h-6 w-6" />
                            <span class="font-mono text-xs">{{ project.icon || 'No icon' }}</span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Repo URL</span>
                        <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="text-secondary-500 hover:underline truncate">{{ project.repoUrl }}</a>
                        <span v-else class="text-neutral-400">-</span>
                    </div>
                     <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Project URL</span>
                        <a v-if="project.projectUrl" :href="project.projectUrl" target="_blank" class="text-secondary-500 hover:underline truncate">{{ project.projectUrl }}</a>
                        <span v-else class="text-neutral-400">-</span>
                    </div>
                 </div>
            </UiCard>

            <template v-else-if="isEditing && editableProject">
                <UiCard>
                    <UiCardContainer class="p-6 space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500">Settings</h3>
                        
                        <UiSelect id="project-status" label="Status" v-model="editableProject.common.status" :options="['draft', 'published', 'archived']" />
                        <UiInput id="project-date" label="Publish Date" v-model="editableProject.common.publishedAt" type="datetime-local" />
                        
                        <UiInput id="project-category" label="Category" v-model="editableProject.common.categoryName" />
                        
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tags</label>
                            <input 
                                :value="editableProject.common.tags.join(', ')"
                                @input="e => editableProject!.common.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                placeholder="vue, nuxt"
                            />
                             <div class="mt-2 flex flex-wrap gap-2">
                                <UiChip v-for="tag in editableProject.common.tags" :key="tag" size="xs">{{ tag }}</UiChip>
                            </div>
                        </div>
                        
                         <div>
                            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Techstack</label>
                            <input 
                                :value="editableProject.common.techstack.join(', ')"
                                @input="e => editableProject!.common.techstack = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                placeholder="typescript, tailwind"
                            />
                             <div class="mt-2 flex flex-wrap gap-2">
                                <UiChip v-for="tech in editableProject.common.techstack" :key="tech" size="xs">{{ tech }}</UiChip>
                            </div>
                        </div>
                    </UiCardContainer>
                </UiCard>

                <UiCard>
                    <UiCardContainer class="p-6 space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500">Links & Icon</h3>
                        
                        <UiInput id="project-icon" label="Icon (e.g. mage:folder)" v-model="editableProject.common.icon" />
                         <div v-if="editableProject.common.icon" class="flex items-center gap-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded">
                            <Icon :name="editableProject.common.icon" class="w-6 h-6" />
                            <span class="text-xs">{{ editableProject.common.icon }}</span>
                        </div>

                        <UiInput id="project-repo" label="Repo URL" v-model="editableProject.common.repoUrl" />
                        <UiInput id="project-url" label="Project URL" v-model="editableProject.common.projectUrl" />
                    </UiCardContainer>
                </UiCard>
            </template>

        </aside>

    </div>
  </div>
</template>
