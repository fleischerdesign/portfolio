
<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const { locale, t } = useI18n();
const { data, refresh } = await useFetch('/api/studio/blog');

const posts = computed(() => data.value?.posts || []);

// Filter & Search
const searchTerm = ref('');
const statusFilter = ref('all');

const filteredPosts = computed(() => {
  let result = [...posts.value];

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(post => {
      // Search in all translations
      return post.translations.some(trans => 
        trans.title.toLowerCase().includes(term) || 
        trans.slug.toLowerCase().includes(term)
      );
    });
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(post => post.status === statusFilter.value);
  }

  return result;
});

function getTitle(post: any) {
  const trans = post.translations.find((t: any) => t.locale === locale.value) 
             || post.translations.find((t: any) => t.locale === 'en')
             || post.translations[0];
  return trans?.title || 'Untitled';
}

function getSlug(post: any) {
    // For navigation, we preferably use the ID in studio, but if we need a slug
    // we use the translationKey or ID.
    // The detail page will be /studio/blog/[id] to be stable across slug changes.
    return post.id;
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-24 space-y-8">
      <UiSectionHeader :level="1" symbol="mage:edit" :title="$t('navigation.blog_editor')" subtitle="Manage and write articles." />

      <UiCard class="mt-8">
        <UiCardContainer class="flex flex-col gap-4 md:flex-row md:items-end">
          <UiInput id="search-posts" v-model="searchTerm" placeholder="Search posts..." label="Search" class="w-full md:flex-grow" />
          <div class="flex flex-col gap-4 md:flex-shrink-0 md:flex-row md:items-end">
            <UiSelect id="filter-status" v-model="statusFilter" :options="['all', 'published', 'draft', 'archived']" label="Status" class="w-full md:w-48">
                <template #display="{ option }">
                    <span class="capitalize">{{ option }}</span>
                </template>
                <template #option="{ option }">
                    <span class="capitalize">{{ option }}</span>
                </template>
            </UiSelect>
            <NuxtLink :to="$localePath('/studio/blog/new')" class="w-full md:w-auto">
              <UiButton variant="secondary" class="w-full justify-center">
                <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
                New Post
              </UiButton>
            </NuxtLink>
          </div>
        </UiCardContainer>
      </UiCard>

      <div class="grid grid-cols-1 gap-4">
        <UiCard v-for="post in filteredPosts" :key="post.id" hover class="group transition-all">
            <NuxtLink :to="$localePath(`/studio/blog/${post.id}`)">
                <UiCardContainer class="flex items-center justify-between p-6">
                    <div class="flex items-center gap-4">
                        <!-- Status Indicator -->
                        <div class="h-3 w-3 rounded-full" :class="{
                            'bg-emerald-500': post.status === 'published',
                            'bg-amber-500': post.status === 'draft',
                            'bg-neutral-400': post.status === 'archived'
                        }"></div>
                        
                        <div>
                            <h3 class="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-secondary-600 transition-colors">
                                {{ getTitle(post) }}
                            </h3>
                            <div class="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                                <span>Key: {{ post.translationKey }}</span>
                                <span>•</span>
                                <span>{{ formatDate(post.createdAt) }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <!-- Language Badges -->
                        <span v-for="trans in post.translations" :key="trans.locale" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
                            {{ trans.locale }}
                        </span>
                        <Icon name="heroicons:chevron-right" class="ml-4 text-neutral-400 group-hover:text-secondary-500" />
                    </div>
                </UiCardContainer>
            </NuxtLink>
        </UiCard>
      </div>
      
      <div v-if="filteredPosts.length === 0" class="text-center text-neutral-500 py-12">
          No posts found.
      </div>

    </div>
  </div>
</template>
