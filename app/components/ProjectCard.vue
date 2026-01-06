<template>
    <NuxtLink :to="$localePath(`/projects/${project?.slug}`)" class="group block h-full">
        <UiCard interactive class="relative h-[400px] w-full overflow-hidden border-neutral-200/50 bg-neutral-100/50 dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <!-- 1. Background Image -->
            <div class="absolute inset-0 h-full w-full">
                <NuxtImg
                    :src="project.image?.src" 
                    :alt="project.image?.alt || project.title" 
                    sizes="800px"
                    class="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent transition-opacity duration-500 group-hover:opacity-100 opacity-90"></div>
            </div>

            <!-- 2. Ambient Accent Glow (Static & Dynamic) -->
            <div class="pointer-events-none absolute -right-16 -top-16 z-10 h-64 w-64 rounded-full bg-secondary-500/15 blur-[80px] transition-all duration-700 group-hover:bg-secondary-500/25 group-hover:blur-[100px]"></div>

            <!-- 3. Content Area -->
            <div class="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                
                <!-- Category Label -->
                <div class="mb-4 flex translate-y-4 items-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span class="h-1.5 w-1.5 rounded-full bg-secondary-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                    <span class="text-xs font-bold uppercase tracking-[0.2em] text-secondary-400">{{ $t("project.case_study") }}</span>
                </div>

                <div class="flex items-center gap-6">
                    
                    <!-- GLASS ANCHOR ICON -->
                    <div v-if="project.icon" class="relative shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md transition-all duration-500 group-hover:border-secondary-500/60 group-hover:bg-secondary-500/15">
                        <div class="absolute inset-0 bg-gradient-to-br from-secondary-400/10 to-transparent opacity-50 transition-opacity group-hover:opacity-100"></div>
                        
                        <Icon 
                            :name="project.icon" 
                            mode="svg"
                            class="relative z-10 h-10 w-10 fill-white text-white drop-shadow-md transition-all duration-500 [&>g]:fill-white group-hover:fill-secondary-400 group-hover:text-secondary-400 group-hover:[&>g]:fill-secondary-400 group-hover:scale-110" 
                        />
                    </div>

                    <!-- TEXT CONTENT -->
                    <div class="flex flex-col gap-2">
                        <h3 :class="[
                            'font-bold leading-tight tracking-tight text-white transition-colors duration-500 group-hover:text-secondary-400',
                            compact ? 'text-2xl' : 'text-3xl sm:text-4xl'
                        ]">
                            {{ project.title }}
                        </h3>
                        
                        <p class="line-clamp-2 text-base font-medium text-neutral-300 transition-colors duration-500 group-hover:text-neutral-100">
                            {{ project.subtitle }}
                        </p>
                    </div>
                </div>

                <!-- Interactive Bottom Bar -->
                <div class="mt-8 flex items-center gap-4">
                    <div class="h-1 w-12 rounded-full bg-secondary-500/30 transition-all duration-700 group-hover:w-24 group-hover:bg-secondary-500 shadow-[0_0_10px_rgba(16,185,129,0.2)] group-hover:shadow-secondary-500/40"></div>
                    <span class="text-xs font-bold uppercase tracking-widest text-white opacity-0 transition-all duration-500 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
                        {{ $t("project.details") }}
                    </span>
                </div>

            </div>
        </UiCard >
    </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
    project: {
        title: string
        subtitle?: string
        date: string
        image?: { src: string, alt?: string }
        slug: string
        icon?: string
    },
    compact?: boolean
}>()
</script>