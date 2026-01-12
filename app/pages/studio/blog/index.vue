
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { BlogPostStudioResponse } from '#shared/schemas/blog.schema';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin,
  layout: 'default'
});

const { locale } = useI18n();
const { data } = await useFetch('/api/studio/blog');

const posts = computed(() => data.value?.posts || []);

const searchTerm = ref('');
const statusFilter = ref('all');

const filteredPosts = computed(() => {
  let result = (posts.value as unknown as BlogPostStudioResponse[]);

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(post => {
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

function getTitle(post: BlogPostStudioResponse) {
  const trans = post.translations.find(t => t.locale === locale.value) 
             || post.translations.find(t => t.locale === 'en')
             || post.translations[0];
  return trans?.title || 'Untitled';
}

function getStatusColor(status: string) {
    switch(status) {
        case 'published': return 'bg-emerald-500 text-white shadow-emerald-500/30';
        case 'draft': return 'bg-amber-500 text-white shadow-amber-500/30';
        case 'archived': return 'bg-neutral-500 text-white';
        default: return 'bg-neutral-500';
    }
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-24 space-y-8">
      <UiSectionHeader :level="1" symbol="mage:edit" :title="$t('navigation.blog_editor')" subtitle="Manage and write articles." />

      <UiCard class="mt-8 border-secondary-500/10 shadow-xl shadow-secondary-500/5">
        <UiCardContainer class="flex flex-col gap-4 p-6 md:flex-row md:items-end">
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

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UiCard v-for="post in filteredPosts" :key="post.id" interactive class="group flex h-full flex-col transition-all duration-300 hover:border-secondary-500/30 hover:shadow-lg">
            <NuxtLink :to="$localePath(`/studio/blog/${post.id}`)" class="flex h-full flex-col">
                <div v-if="post.coverImage" class="relative h-48 w-full overflow-hidden border-b border-neutral-100 dark:border-neutral-800">
                    <NuxtImg :src="post.coverImage" sizes="500px" class="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent"></div>
                    <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <span class="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md" :class="getStatusColor(post.status)">
                            {{ post.status }}
                        </span>
                    </div>
                </div>
                <div v-else class="h-2 bg-gradient-to-r from-secondary-500 to-emerald-400"></div>

                <UiCardContainer class="flex flex-1 flex-col p-6">
                    <div v-if="!post.coverImage" class="mb-4">
                        <span class="rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm" :class="getStatusColor(post.status)">
                            {{ post.status }}
                        </span>
                    </div>

                    <h3 class="mb-2 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-secondary-600 dark:text-white">
                        {{ getTitle(post) }}
                    </h3>
                    
                    <div class="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800">
                        <span>{{ formatDate(post.createdAt) }}</span>
                        
                        <div class="flex gap-1">
                            <span v-for="trans in post.translations" :key="trans.locale" class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase dark:bg-neutral-800">
                                {{ trans.locale }}
                            </span>
                        </div>
                    </div>
                </UiCardContainer>
            </NuxtLink>
        </UiCard>
      </div>
      
      <div v-if="filteredPosts.length === 0" class="flex flex-col items-center py-12 text-center text-neutral-500">
          <Icon name="heroicons:document-text" class="mb-4 h-12 w-12 opacity-20" />
          <p>No posts found matching your criteria.</p>
      </div>

    </div>
  </div>
</template>
