<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()

useHead({
  title: `Error ${props.error.statusCode}`
})

const localePath = useLocalePath()
const handleError = () => clearError({ redirect: localePath('/') })
</script>

<template>
  <div class="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-neutral-100 px-4 dark:bg-neutral-950">
    
    <!-- Background Ambience (Hero Style) -->
    <div class="absolute inset-0 pointer-events-none">
        <!-- Main Emerald Glow -->
        <div class="absolute -right-[10%] -top-[10%] z-0 h-[800px] w-[800px] rounded-full bg-secondary-500/10 blur-[150px] dark:bg-secondary-500/10"></div>
        <!-- Secondary Glow -->
        <div class="absolute left-[10%] bottom-[10%] z-0 h-[500px] w-[500px] rounded-full bg-secondary-400/5 blur-[120px]"></div>
        
        <!-- Dot Grid Pattern -->
        <div class="absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]">
            <div class="h-full w-full bg-[radial-gradient(#80808066_1.5px,transparent_1.5px)] bg-[size:40px_40px] dark:bg-[radial-gradient(#ffffff15_1.5px,transparent_1.5px)]"></div>
        </div>
    </div>

    <div class="relative z-10 flex flex-col items-center text-center">
        
        <!-- Icon Container with Glow -->
        <div class="group relative mb-12">
            <!-- Glow behind icon -->
            <div class="absolute inset-0 animate-pulse rounded-full bg-secondary-500/20 blur-[40px]"></div>
            
            <div class="relative flex h-40 w-40 items-center justify-center rounded-[3rem] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-105 hover:rotate-3 dark:border-neutral-800/60 dark:bg-neutral-900/40">
                <Icon v-if="error.statusCode === 404" name="heroicons:magnifying-glass" size="80" class="text-secondary-600 dark:text-secondary-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                <Icon v-else name="heroicons:exclamation-triangle" size="80" class="text-secondary-600 dark:text-secondary-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>

            <!-- Floating Badge -->
            <div class="absolute -bottom-4 -right-4 rotate-[-6deg] rounded-xl border border-white/50 bg-white/80 px-4 py-2 font-black text-neutral-900 shadow-lg backdrop-blur-md dark:border-neutral-700/50 dark:bg-neutral-800/80 dark:text-white">
                {{ error.statusCode }}
            </div>
        </div>

        <!-- Headline -->
        <h1 class="max-w-4xl text-5xl font-black tracking-tight text-neutral-900 dark:text-white sm:text-7xl">
            <span class="bg-gradient-to-br from-neutral-900 to-neutral-600 bg-clip-text text-transparent dark:from-white dark:to-neutral-400">
                {{ error.statusCode === 404 ? t('error.404.heading') : t('error.generic.heading') }}
            </span>
        </h1>
        
        <!-- Accent Line -->
        <div class="mt-6 h-1.5 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent"></div>

        <!-- Message -->
        <p class="mt-8 max-w-xl text-xl font-medium leading-relaxed text-neutral-600 dark:text-neutral-400">
            {{ error.statusCode === 404 ? t('error.404.message') : (error.statusMessage || error.message || t('error.generic.message')) }}
        </p>

        <!-- Action Button (Emerald Style) -->
        <div class="mt-12">
            <button 
                @click="handleError"
                class="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-secondary-500 px-8 py-4 text-base font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-secondary-500/25 transition-all hover:scale-105 hover:bg-secondary-600 hover:shadow-xl hover:shadow-secondary-500/40 active:scale-95"
            >
                <div class="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                <Icon name="heroicons:arrow-left" size="20" class="transition-transform group-hover:-translate-x-1" />
                <span>{{ t('error.back_home') }}</span>
            </button>
        </div>

    </div>

  </div>
</template>
