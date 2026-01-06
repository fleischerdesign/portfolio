<template>
    <div class="fixed bottom-0 z-20 my-4 flex w-full justify-center print:hidden">
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
                            <!-- Moon Outline -->
                            <Icon name="mage:moon" size="24" class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                            <!-- Moon Filled -->
                            <Icon name="mage:moon-fill" size="24" class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                        </template>
                        <template v-else>
                            <!-- Sun Outline -->
                            <Icon name="mage:sun" size="24" class="absolute inset-0 text-neutral-400 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90" />
                            <!-- Sun Filled -->
                            <Icon name="mage:sun-fill" size="24" class="absolute inset-0 text-secondary-400 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100" />
                        </template>
                    </div>
                    <template #fallback>
                        <Icon name="mage:moon" size="24" class="text-neutral-500" />
                    </template>
                </ClientOnly>
            </button>

            <!-- Navigation Bar -->
            <nav
                class="flex items-center gap-1 rounded-2xl border border-neutral-200/50 bg-white/70 p-1.5 shadow-xl backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/70"
            >
                <NuxtLink 
                    v-for="link in navLinks" 
                    :key="link.path"
                    :to="$localePath(link.path)" 
                    class="group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 hover:bg-secondary-50 dark:hover:bg-secondary-900/20"
                    active-class="active-nav-item"
                >
                    <div class="relative h-6 w-6 transition-transform duration-300 group-active:scale-95">
                        <!-- Outline Icon -->
                        <Icon
                            :name="link.icon" 
                            size="24"
                            class="absolute inset-0 text-neutral-500 transition-all duration-300 group-hover:opacity-0 group-hover:scale-90 group-[.active-nav-item]:opacity-0 dark:text-neutral-400" 
                        />
                        
                        <!-- Filled Icon -->
                        <Icon
                            :name="link.activeIcon" 
                            size="24"
                            class="absolute inset-0 text-secondary-600 opacity-0 transition-all duration-300 scale-90 group-hover:opacity-100 group-hover:scale-100 group-[.active-nav-item]:opacity-100 group-[.active-nav-item]:scale-100 dark:text-secondary-400" 
                        />
                    </div>
                    
                    <!-- Active Indicator: Small glowing line at the bottom -->
                    <div class="absolute bottom-1 h-0.5 w-4 rounded-full bg-secondary-500 opacity-0 shadow-[0_0_8px_rgba(16,185,129,0.8)] transition-all duration-300 group-[.active-nav-item]:opacity-100"></div>
                </NuxtLink>
            </nav>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const $toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const navLinks = [
    { path: '/', icon: 'mage:home', activeIcon: 'mage:home-fill' },
    { path: '/about', icon: 'mage:user-square', activeIcon: 'mage:user-square-fill' },
    { path: '/blog', icon: 'mage:note', activeIcon: 'mage:note-fill' },
    { path: '/projects', icon: 'mage:briefcase', activeIcon: 'mage:briefcase-fill' },
    { path: '/store', icon: 'mage:shop', activeIcon: 'mage:shop-fill' },
]
</script>