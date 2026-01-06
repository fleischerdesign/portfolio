<template>
    <UiCard interactive class="group relative flex h-full flex-col overflow-hidden border-neutral-200/50 bg-white/50 dark:border-neutral-800/50 dark:bg-neutral-900/50">
        <NuxtLink :to="$localePath(`/blog/${post?.slug}`)" class="flex h-full flex-col">
            
            <!-- 1. Image Section (Top) -->
            <div class="relative h-56 w-full overflow-hidden">
                <!-- Ambient Glow (Top Right) -->
                <div class="pointer-events-none absolute -right-12 -top-12 z-10 h-48 w-48 rounded-full bg-secondary-500/10 blur-[60px] transition-all duration-700 group-hover:bg-secondary-500/20 group-hover:blur-[80px]"></div>

                <!-- Post Image -->
                <NuxtImg
                    sizes="500px" 
                    :src="post?.image?.src"
                    class="h-full w-full object-cover transition duration-1000 group-hover:scale-110"
                    :alt="post?.image?.alt" 
                />
                
                <!-- Overlay Gradient -->
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950/20 to-transparent"></div>
            </div>

            <!-- 2. Content Section -->
            <UiCardContainer class="relative flex flex-1 flex-col p-6 lg:p-8">
                <!-- Subtle Decorative Background Glow (Bottom Left) -->
                <div class="pointer-events-none absolute -bottom-10 -left-10 -z-0 h-32 w-32 rounded-full bg-secondary-500/5 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"></div>

                <div class="relative z-10 flex h-full flex-col">
                    <!-- Technical Meta Info (New) -->
                    <div class="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                        <div class="flex items-center gap-1.5">
                            <Icon name="mage:calendar-2" size="14" class="text-secondary-500" />
                            <span>{{ formattedDate }}</span>
                        </div>
                        <span class="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700"></span>
                        <div class="flex items-center gap-1.5">
                        <Icon name="mage:clock" size="16" class="text-secondary-400" />
                        {{ post.readingTime }} {{ $t("blogPost.readingTimeSuffix") }}
                    </div>
                    </div>

                    <h3 class="text-2xl font-bold tracking-tight text-neutral-900 transition-colors duration-300 group-hover:text-secondary-600 dark:text-white dark:group-hover:text-secondary-400">
                        {{ post?.title }}
                    </h3>
                    
                    <p class="mt-3 line-clamp-3 flex-1 text-base text-neutral-600 transition-colors duration-300 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-200">
                        {{ post?.description }}
                    </p>

                    <!-- Interactive Footer -->
                    <div class="mt-6 flex items-center gap-3">
                        <div class="h-0.5 w-12 rounded-full bg-secondary-500/30 transition-all duration-500 group-hover:w-20 group-hover:bg-secondary-500"></div>
                        <span class="text-xs font-bold uppercase tracking-widest text-secondary-500 opacity-0 transition-all duration-500 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0">
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

const props = defineProps<{
    post: {
        title: string
        description?: string
        date: Date
        image?: { src: string, alt: string }
        slug: string
        readingTime?: number
    }
}>()

const formattedDate = computed(() => formatDate(props.post.date))
</script>
