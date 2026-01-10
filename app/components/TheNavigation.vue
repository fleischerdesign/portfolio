<template>
    <div class="print:hidden">
        <!-- MOBILE & TABLET NAVIGATION (Bottom Floating Bar) -->
        <div class="fixed bottom-0 z-50 my-4 flex w-full justify-center lg:hidden">
            <div class="flex items-center gap-3">
                <!-- Theme Toggle Button -->
                <button
                    class="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/50 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-secondary-50 dark:border-neutral-800/50 dark:bg-neutral-900/70 dark:hover:bg-secondary-900/20"
                    aria-label="Toggle Dark Mode"
                    @click="$toggleDarkMode()"
                >
                    <ClientOnly>
                        <div class="relative h-6 w-6">
                            <template v-if="colorMode.value === 'light'">
                                <Icon name="mage:moon" size="24" class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                                <Icon name="mage:moon-fill" size="24" class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                            </template>
                            <template v-else>
                                <Icon name="mage:sun" size="24" class="absolute inset-0 text-neutral-400 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                                <Icon name="mage:sun-fill" size="24" class="absolute inset-0 text-secondary-400 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                            </template>
                        </div>
                        <template #fallback>
                            <Icon name="mage:moon" size="24" class="text-neutral-500" />
                        </template>
                    </ClientOnly>
                </button>

                <!-- Studio Toggle Button (Mobile) -->
                <NuxtLink
                    v-if="user?.role === 'admin'"
                    :to="inStudio ? $localePath('/') : $localePath('/studio')"
                    class="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200/50 bg-white/70 shadow-lg backdrop-blur-xl transition-all duration-300 hover:bg-secondary-50 dark:border-neutral-800/50 dark:bg-neutral-900/70 dark:hover:bg-secondary-900/20"
                    :aria-label="inStudio ? 'Exit Studio' : 'Enter Studio'"
                >
                    <Icon :name="inStudio ? 'mage:multiply' : 'mage:dashboard'" size="24" class="text-neutral-500 transition-colors group-hover:text-secondary-600 dark:text-neutral-400 dark:group-hover:text-secondary-400" />
                </NuxtLink>

                <!-- Navigation Bar -->
                <nav class="flex items-center gap-1 rounded-2xl border border-neutral-200/50 bg-white/70 p-1.5 shadow-xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70">
                    <NuxtLink 
                        v-for="link in navLinks" 
                        :key="link.path"
                        :to="$localePath(link.path)" 
                        class="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 group-[.router-link-active]:bg-secondary-100 dark:group-[.router-link-active]:bg-secondary-900/40"
                    >
                        <div class="relative h-6 w-6 transition-transform duration-300 group-active:scale-95">
                            <!-- Outline Icon -->
                            <Icon
                                :name="link.icon" 
                                size="24"
                                class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90 group-[.router-link-active]:opacity-0 dark:text-neutral-400" 
                            />
                            
                            <!-- Filled Icon -->
                            <Icon
                                :name="link.activeIcon" 
                                size="24"
                                class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100 group-[.router-link-active]:opacity-100 group-[.router-link-active]:scale-100 dark:text-secondary-400" 
                            />
                        </div>
                    </NuxtLink>
                </nav>
            </div>
        </div>

        <!-- DESKTOP NAVIGATION (Top Floating Multi-Pill) -->
        <header class="fixed top-0 z-50 hidden w-full justify-center p-8 lg:flex">
            <div class="flex items-center gap-3">
                <!-- Brand Pill -->
                <NuxtLink :to="$localePath('/')" class="group flex h-12 items-center gap-3 rounded-2xl border border-neutral-200/50 bg-white/70 px-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-secondary-50 dark:border-neutral-800/50 dark:bg-neutral-900/70 dark:hover:bg-secondary-900/20">
                    <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400 shadow-sm transition-transform group-hover:rotate-12">
                        <Icon 
                            name="logo:fleischerdesign" 
                            size="20" 
                            mode="svg"
                            class="[&_*]:!fill-current"
                        />
                    </div>
                    <span class="text-sm font-black uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 transition-colors group-hover:!text-secondary-600 dark:group-hover:!text-secondary-400 group-[.router-link-active]:!text-secondary-600 dark:group-[.router-link-active]:!text-secondary-400">Fleischer</span>
                </NuxtLink>

                <!-- Navigation Bar (Mirrors Mobile Style) -->
                <nav class="flex items-center gap-1 rounded-2xl border border-neutral-200/50 bg-white/70 p-1.5 shadow-xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70">
                    <NuxtLink 
                        v-for="link in navLinks" 
                        :key="link.path"
                        :to="$localePath(link.path)" 
                        class="group relative flex h-11 items-center gap-3 rounded-xl px-5 transition-all duration-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 group-[.router-link-active]:bg-secondary-100 dark:group-[.router-link-active]:bg-secondary-900/40"
                    >
                        <div class="relative h-6 w-6 transition-transform duration-300 group-active:scale-95 group-hover:scale-110">
                            <Icon
                                :name="link.icon" 
                                size="24"
                                class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90 group-[.router-link-active]:opacity-0 dark:text-neutral-400" 
                            />
                            <Icon
                                :name="link.activeIcon" 
                                size="24"
                                class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100 group-[.router-link-active]:opacity-100 group-[.router-link-active]:scale-100 dark:text-secondary-400" 
                            />
                        </div>
                        <span class="text-xs font-black uppercase tracking-[0.2em] text-neutral-500 transition-colors group-hover:!text-secondary-600 dark:group-hover:!text-secondary-400 group-[.router-link-active]:!text-secondary-600 dark:group-[.router-link-active]:!text-secondary-400">
                            {{ $t(`navigation.${link.label}`) }}
                        </span>
                    </NuxtLink>
                </nav>

                <!-- Studio Toggle Button (Desktop) -->
                <NuxtLink
                    v-if="user?.role === 'admin'"
                    :to="inStudio ? $localePath('/') : $localePath('/studio')"
                    class="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/50 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-secondary-50 dark:border-neutral-800/50 dark:bg-neutral-900/70 dark:hover:bg-secondary-900/20"
                    :aria-label="inStudio ? 'Exit Studio' : 'Enter Studio'"
                >
                    <Icon :name="inStudio ? 'mage:multiply' : 'mage:dashboard'" size="24" class="text-neutral-500 transition-colors group-hover:text-secondary-600 dark:text-neutral-400 dark:group-hover:text-secondary-400" />
                </NuxtLink>

                <!-- Theme Toggle Button (Mirrors Mobile Style) -->
                <button
                    class="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-neutral-200/50 bg-white/70 shadow-xl backdrop-blur-xl transition-all duration-300 hover:bg-secondary-50 dark:border-neutral-800/50 dark:bg-neutral-900/70 dark:hover:bg-secondary-900/20"
                    aria-label="Toggle Dark Mode"
                    @click="$toggleDarkMode()"
                >
                    <ClientOnly>
                        <div class="relative h-6 w-6">
                            <template v-if="colorMode.value === 'light'">
                                <Icon name="mage:moon" size="24" class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                                <Icon name="mage:moon-fill" size="24" class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                            </template>
                            <template v-else>
                                <Icon name="mage:sun" size="24" class="absolute inset-0 text-neutral-400 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                                <Icon name="mage:sun-fill" size="24" class="absolute inset-0 text-secondary-400 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                            </template>
                        </div>
                        <template #fallback>
                            <Icon name="mage:moon" size="24" class="text-neutral-500" />
                        </template>
                    </ClientOnly>
                </button>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const { user } = useUserSession()
const route = useRoute()

const inStudio = computed(() => route.path.startsWith('/studio') || route.path.startsWith('/en/studio') || route.path.startsWith('/de/studio'))

const $toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = computed(() => {
    if (inStudio.value) {
        return [
            { path: '/studio', icon: 'mage:dashboard', activeIcon: 'mage:dashboard-fill', label: 'studio' },
            { path: '/studio/applications', icon: 'mage:users', activeIcon: 'mage:users-fill', label: 'applications' },
            { path: '/studio/blog', icon: 'mage:edit', activeIcon: 'mage:edit-fill', label: 'blog' },
            { path: '/studio/projects', icon: 'mage:folder', activeIcon: 'mage:folder-fill', label: 'projects' },
        ]
    }
    
    return [
        { path: '/', icon: 'mage:home', activeIcon: 'mage:home-fill', label: 'home' },
        { path: '/about', icon: 'mage:user-square', activeIcon: 'mage:user-square-fill', label: 'about' },
        { path: '/blog', icon: 'mage:note', activeIcon: 'mage:note-fill', label: 'blog' },
        { path: '/projects', icon: 'mage:briefcase', activeIcon: 'mage:briefcase-fill', label: 'projects' },
        { path: '/store', icon: 'mage:shop', activeIcon: 'mage:shop-fill', label: 'store' },
    ]
})
</script>