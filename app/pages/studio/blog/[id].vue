<script setup lang="ts">
import { useBlogEditor } from '~/composables/useBlogEditor';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin,
  layout: 'default'
});

const route = useRoute();
const { render } = useMarkdown();
const { t } = useI18n();

const postId = parseInt(route.params.id as string);
const { data, refresh } = await useFetch(`/api/studio/blog/${postId}`);

const { isEditing, isLoading, currentLocale, editablePost, startEditing, cancelEditing, save } = useBlogEditor(postId, data, refresh);

const post = computed(() => data.value?.post);

const viewTranslation = computed(() => {
  if (!post.value) return null;
  return post.value.translations.find((t: any) => t.locale === currentLocale.value) 
      || post.value.translations.find((t: any) => t.locale === 'en')
      || post.value.translations[0];
});

const renderedBody = computed(() => {
    if (isEditing.value && editablePost.value) {
        return render(editablePost.value[currentLocale.value].body);
    }
    return viewTranslation.value ? render(viewTranslation.value.body) : '';
});

const viewFormattedDate = computed(() => post.value?.publishedAt ? formatDate(post.value.publishedAt) : '');

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
            <UiBackButton :to="$localePath('/studio/blog')" />
            
            <div class="flex items-center gap-4">
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

                <UiButton v-if="!isEditing" variant="secondary" @click="startEditing">
                    <Icon name="heroicons:pencil-square" class="mr-2" /> Edit
                </UiButton>
                
                <template v-else>
                    <UiButton variant="ghost" @click="cancelEditing">Cancel</UiButton>
                    <UiButton :is-loading="isLoading" @click="save">Save Changes</UiButton>
                </template>
            </div>
        </div>

        <UiSectionHeader 
            v-if="post && viewTranslation && !isEditing"
            :level="1" 
            :title="viewTranslation.title" 
            :subtitle="viewTranslation.excerpt || ''" 
            symbol="mage:edit" 
        />
        <UiSectionHeader 
            v-else-if="isEditing && editablePost"
            :level="1" 
            :title="editablePost[currentLocale].title || 'Editing Post'" 
            subtitle="Compose and refine your story." 
            symbol="mage:edit" 
        />
    </div>

    <UiCard v-if="post && !isEditing" class="mb-12 border-secondary-500/10 shadow-xl shadow-secondary-500/5">
        <UiCardContainer class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8 px-8 py-6">
            <div class="flex items-center gap-5 w-full lg:w-auto">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:signal" size="28" />
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Status</p>
                    <div class="mt-1">
                        <span class="px-3 py-0.5 text-xs font-bold rounded-lg border shadow-sm capitalize" :class="getStatusColor(post.status)">
                            {{ post.status }}
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-5 w-full lg:flex-1 lg:min-w-0 border-t border-neutral-100 pt-6 lg:border-t-0 lg:pt-0 lg:border-l dark:border-neutral-800 lg:pl-8">
                <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:language" size="28" />
                </div>
                <div class="min-w-0 flex-1">
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Translations</p>
                    <div class="flex gap-2 mt-1">
                        <span v-for="lang in ['de', 'en']" :key="lang" class="flex items-center gap-1.5">
                            <span class="h-2 w-2 rounded-full" :class="post.translations.some((t: any) => t.locale === lang) ? 'bg-emerald-500' : 'bg-neutral-300'"></span>
                            <span class="text-sm font-bold uppercase text-neutral-700 dark:text-neutral-300">{{ lang }}</span>
                        </span>
                    </div>
                </div>
            </div>

            <div class="flex items-center gap-5 w-full lg:w-auto border-t border-neutral-100 pt-6 lg:border-t-0 lg:pt-0 lg:border-l dark:border-neutral-800 lg:pl-8">
                <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400">
                    <Icon name="heroicons:clock" size="28" />
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Published</p>
                    <p class="mt-0.5 text-xl font-bold text-neutral-900 dark:text-white">{{ viewFormattedDate || 'Not published' }}</p>
                    <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                        {{ viewTranslation?.readingTime || 0 }} min read
                    </p>
                </div>
            </div>

            <div v-if="post.status === 'published' && viewTranslation" class="w-full lg:w-auto lg:ml-auto border-t border-neutral-100 pt-6 lg:border-t-0 lg:pt-0 dark:border-neutral-800">
                <a :href="`/${currentLocale}/blog/${viewTranslation.slug}`" target="_blank" rel="noopener noreferrer" class="block w-full">
                    <UiButton variant="glass" class="w-full">
                        <Icon name="heroicons:arrow-top-right-on-square" class="mr-2" /> View Live
                    </UiButton>
                </a>
            </div>
        </UiCardContainer>
    </UiCard>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        <div class="lg:col-span-3 space-y-12">
            
            <div v-if="!isEditing && post && viewTranslation" class="flex flex-col items-start">
                <div class="mb-10 w-full">
                    <div class="flex flex-wrap items-center gap-4 mb-6">
                        <div class="flex gap-2">
                            <UiTag v-for="tag in post.tags" :key="tag.id" variant="glow" size="sm">{{ tag.name }}</UiTag>
                        </div>
                    </div>
                </div>

                <div v-if="post.coverImage" class="group relative mb-16 w-full aspect-[21/9] overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-100 shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900">
                    <NuxtImg :src="post.coverImage" class="w-full h-full object-cover" />
                </div>

                <div class="w-full prose prose-lg prose-neutral max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline prose-img:rounded-3xl prose-img:shadow-2xl" v-html="renderedBody"></div>
            </div>

            <div v-else-if="isEditing && editablePost" class="space-y-8">
                <UiCard>
                    <UiCardContainer class="p-8 space-y-6">
                        <UiInput id="post-title" label="Title" v-model="editablePost[currentLocale].title" class="text-xl font-bold" />
                        <UiInput id="post-slug" label="Slug" v-model="editablePost[currentLocale].slug" class="font-mono text-sm" />
                        <UiInput id="post-excerpt" label="Excerpt" v-model="editablePost[currentLocale].excerpt" as="textarea" rows="3" />
                    </UiCardContainer>
                </UiCard>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
                    <UiCard class="flex flex-col h-full overflow-hidden">
                        <div class="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Markdown</div>
                        <textarea 
                            v-model="editablePost[currentLocale].body" 
                            class="flex-1 w-full p-4 bg-transparent border-none resize-none focus:ring-0 font-mono text-sm leading-relaxed"
                        ></textarea>
                    </UiCard>
                    <UiCard class="flex flex-col h-full overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30">
                        <div class="bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">Preview</div>
                        <div class="flex-1 overflow-y-auto p-4 prose prose-sm dark:prose-invert max-w-none" v-html="renderedBody"></div>
                    </UiCard>
                </div>
            </div>

        </div>

        <aside class="space-y-6 sticky top-24">
            
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
                                <Icon name="heroicons:pencil-square" class="mr-2" /> Edit Post
                            </UiButton>
                            
                            <a v-if="post?.status === 'published' && viewTranslation" :href="`/${currentLocale}/blog/${viewTranslation.slug}`" target="_blank" rel="noopener noreferrer" class="block w-full">
                                <UiButton variant="glass" class="w-full">
                                    <Icon name="heroicons:arrow-top-right-on-square" class="mr-2" /> View Live
                                </UiButton>
                            </a>
                        </template>
                        
                        <template v-else>
                            <UiButton class="w-full" :is-loading="isLoading" @click="save">Save Changes</UiButton>
                            <UiButton class="w-full" variant="ghost" @click="cancelEditing">Cancel</UiButton>
                        </template>
                    </div>
                </UiCardContainer>
            </UiCard>

            <UiCard v-if="!isEditing && post && viewTranslation" class="p-6">
                <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500 mb-4">Meta Data</h3>
                <div class="space-y-4 text-sm">
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Status</span>
                        <div class="flex">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border shadow-sm capitalize" :class="getStatusColor(post.status)">
                                {{ post.status }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Published</span>
                        <span class="font-bold">{{ viewFormattedDate || '-' }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Category</span>
                        <span class="font-bold">{{ post.category?.name || '-' }}</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <span class="text-neutral-500 text-xs">Key</span>
                        <span class="font-mono text-xs bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{{ post.translationKey }}</span>
                    </div>
                </div>
            </UiCard>

            <template v-else-if="isEditing && editablePost">
                <UiCard>
                    <UiCardContainer class="p-6 space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500">Settings</h3>
                        
                        <UiSelect id="post-status" label="Status" v-model="editablePost.common.status" :options="['draft', 'published', 'archived']" />
                        <UiInput id="post-date" label="Publish Date" v-model="editablePost.common.publishedAt" type="datetime-local" />
                        
                        <UiInput id="post-category" label="Category" v-model="editablePost.common.categoryName" />
                        
                        <div>
                            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">Tags</label>
                            <input 
                                :value="editablePost.common.tags.join(', ')"
                                @input="e => editablePost!.common.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(Boolean)"
                                class="w-full rounded-lg border-neutral-300 dark:border-neutral-700 bg-transparent text-sm"
                                placeholder="vue, nuxt"
                            />
                            <div class="mt-2 flex flex-wrap gap-2">
                                <UiChip v-for="tag in editablePost.common.tags" :key="tag" size="xs">{{ tag }}</UiChip>
                            </div>
                        </div>
                    </UiCardContainer>
                </UiCard>

                <UiCard>
                    <UiCardContainer class="p-6 space-y-6">
                        <h3 class="text-xs font-bold uppercase tracking-widest text-secondary-500">Media</h3>
                        <UiInput id="post-image" label="Cover Image URL" v-model="editablePost.common.coverImage" />
                        <div v-if="editablePost.common.coverImage" class="rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                            <img :src="editablePost.common.coverImage" class="w-full h-32 object-cover" />
                        </div>
                        <UiInput id="post-image-alt" label="Alt Text" v-model="editablePost.common.coverImageAlt" />
                    </UiCardContainer>
                </UiCard>
            </template>

        </aside>

    </div>
  </div>
</template>