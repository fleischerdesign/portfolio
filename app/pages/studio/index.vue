
<script setup lang="ts">
definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
})
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-12">
        <UiSectionHeader :level="1" :title="$t('navigation.dashboard')" subtitle="Welcome to your creative control center." symbol="mage:dashboard" />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Applications -->
        <NuxtLink :to="$localePath('/studio/applications')">
            <UiCard interactive class="h-full">
                <UiCardContainer class="flex items-center gap-4 p-6">
                    <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                        <Icon name="mage:users" size="28" />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-neutral-900 dark:text-white">{{ $t('navigation.applications') }}</h3>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400">Manage job applications</p>
                    </div>
                </UiCardContainer>
            </UiCard>
        </NuxtLink>

        <!-- Blog -->
        <NuxtLink :to="$localePath('/studio/blog')">
            <UiCard interactive class="h-full">
                <UiCardContainer class="flex items-center gap-4 p-6">
                    <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                        <Icon name="mage:edit" size="28" />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-neutral-900 dark:text-white">{{ $t('navigation.blog_editor') }}</h3>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400">Write and edit articles</p>
                    </div>
                </UiCardContainer>
            </UiCard>
        </NuxtLink>

        <!-- Projects -->
        <NuxtLink :to="$localePath('/studio/projects')">
            <UiCard interactive class="h-full">
                <UiCardContainer class="flex items-center gap-4 p-6">
                    <div class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400">
                        <Icon name="mage:folder" size="28" />
                    </div>
                    <div>
                        <h3 class="font-bold text-lg text-neutral-900 dark:text-white">{{ $t('navigation.project_editor') }}</h3>
                        <p class="text-sm text-neutral-500 dark:text-neutral-400">Showcase your work</p>
                    </div>
                </UiCardContainer>
            </UiCard>
        </NuxtLink>
    </div>
  </div>
</template>
