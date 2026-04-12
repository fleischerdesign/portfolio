<template>
    <UiCard interactive class="group relative flex h-full flex-col overflow-hidden border-primary-200/50 bg-white/50 dark:border-primary-800/50 dark:bg-primary-900/50">
        <NuxtLink :to="$localePath(`/blog/${post?.slug}`)" class="flex h-full flex-col">
            
            <!-- 1. Image Section (Top) -->
            <div class="relative h-56 w-full overflow-hidden">
                <!-- Ambient Glow (Top Right) -->
                <div class="pointer-events-none absolute -right-12 -top-12 z-10 h-48 w-48 rounded-full bg-secondary-500/10 blur-[60px] transition-all duration-700 group-hover:bg-secondary-500/20 group-hover:blur-[80px]"></div>

                <!-- Post Image -->
                <NuxtImg
                    v-if="post?.coverImage"
                    sizes="500px" 
                    :src="post.coverImage"
                    class="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                    :alt="post?.coverImageAlt || post?.title" 
                />
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent"></div>
            </div>

            <!-- 2. Content Section -->
            <UiCardContainer class="relative flex flex-1 flex-col p-6 lg:p-8">
                <!-- Subtle Decorative Background Glow (Bottom Left) -->
                <div class="pointer-events-none absolute -bottom-10 -left-10 -z-0 h-32 w-32 rounded-full bg-secondary-500/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>

                <div class="relative z-10 flex h-full flex-col">
                    <!-- Technical Meta Info -->
                    <div class="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-primary-500 dark:text-primary-400">
                        <div v-if="post.publishedAt" class="flex items-center gap-1.5">
                            <Icon name="mage:calendar-2" size="14" class="text-secondary-500" />
                            <span>{{ formattedDate }}</span>
                        </div>
                        <span v-if="post.publishedAt && post.readingTime" class="h-1 w-1 rounded-full bg-primary-300 dark:bg-primary-700"></span>
                        <div v-if="post.readingTime" class="flex items-center gap-1.5">
                        <Icon name="mage:clock" size="16" class="text-secondary-400" />
                        {{ post.readingTime }} {{ $t("blogPost.readingTimeSuffix") }}
                    </div>
                    </div>

                    <h3 class="text-2xl font-bold tracking-tight text-primary-900 transition-colors duration-300 group-hover:text-secondary-600 dark:text-white dark:group-hover:text-secondary-400">
                        {{ post?.title }}
                    </h3>
                    
                    <p class="mt-3 line-clamp-3 flex-1 text-base text-primary-600 transition-colors duration-300 group-hover:text-primary-900 dark:text-primary-400 dark:group-hover:text-primary-200">
                        {{ post?.excerpt }}
                    </p>

                    <!-- Interactive Footer -->
                    <div class="mt-6 flex items-center gap-3">
                        <div class="h-0.5 w-12 rounded-full bg-secondary-500/30 transition-all duration-500 group-hover:w-20 group-hover:bg-secondary-500"></div>
                        <span class="-translate-x-2 text-xs font-bold uppercase tracking-widest text-secondary-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                            {{ $t("blog.read_article") }}
                        </span>
                    </div>
                </div>
            </UiCardContainer>
        </NuxtLink>
    </UiCard >
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BlogPostResponse } from '~~/shared/schemas/blog.schema';

const props = defineProps<{
    post: Omit<BlogPostResponse, 'publishedAt'> & { publishedAt: string | Date | null }
}>()

const formattedDate = computed(() => props.post.publishedAt ? formatDate(props.post.publishedAt) : '')
</script>