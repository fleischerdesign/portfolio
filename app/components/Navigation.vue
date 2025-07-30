<template>
    <div class="fixed bottom-0 z-20 my-2 flex w-full print:hidden">
        <div class="m-auto flex gap-2">
            <div
class="group flex cursor-pointer rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 p-3 shadow-sm backdrop-blur-md transition hover:border-neutral-400/40 hover:bg-gradient-to-br hover:from-neutral-200/40 hover:to-neutral-100/40 hover:shadow-inner dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:hover:border-neutral-600/40 dark:hover:from-neutral-800/40 dark:hover:to-neutral-900/40"
                @click="$toggleDarkMode()">
                <ClientOnly>
                    <template v-if="colorMode.value == 'light'">
                        <Icon
name="mage:moon" size="30"
                            class="opacity-40 transition hover:-translate-y-1 group-hover:opacity-0" />
                        <Icon
name="mage:moon-fill" size="30"
                            class="absolute opacity-0 transition group-hover:opacity-40" />
                    </template>
                    <template v-else>
                        <Icon
name="mage:sun" size="30"
                            class="opacity-40 transition hover:-translate-y-1 group-hover:opacity-0" />
                        <Icon
name="mage:sun-fill" size="30"
                            class="absolute opacity-0 transition group-hover:opacity-40" />
                    </template>
                    <template #fallback>
                        <!-- Fallback für SSR - zeigt ein neutrales Icon -->
                        <Icon name="mage:moon" size="30" class="opacity-40" />
                    </template>
                </ClientOnly>
            </div>
            <div
                class="flex gap-3 rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 p-3 shadow-sm backdrop-blur-md transition hover:border-neutral-400/40 hover:bg-gradient-to-br hover:from-neutral-200/40 hover:to-neutral-100/40 hover:shadow-inner dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:hover:border-neutral-600/40 dark:hover:from-neutral-800/40 dark:hover:to-neutral-900/40">
                <NuxtLink :to="$localePath('/')" class="group flex" active-class="active">
                    <Icon
name="mage:home" size="30"
                        class="opacity-40 transition group-hover:opacity-0 group-[.active]:opacity-0" />
                    <Icon
name="mage:home-fill" size="30"
                        class="absolute opacity-0 transition group-hover:opacity-40 group-[.active]:text-secondary-400 group-[.active]:opacity-100" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/about')" class="group flex" active-class="active">
                    <Icon
name="mage:user-square" size="30"
                        class="opacity-40 transition group-hover:opacity-0 group-[.active]:opacity-0" />
                    <Icon
name="mage:user-square-fill" size="30"
                        class="absolute opacity-0 transition group-hover:opacity-40 group-[.active]:text-secondary-400 group-[.active]:opacity-100" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/blog')" class="group flex" active-class="active">
                    <Icon
name="mage:note" size="30"
                        class="opacity-40 transition group-hover:opacity-0 group-[.active]:opacity-0" />
                    <Icon
name="mage:note-fill" size="30"
                        class="absolute opacity-0 transition group-hover:opacity-40 group-[.active]:text-secondary-400 group-[.active]:opacity-100" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/projects')" class="group flex" active-class="active">
                    <Icon
name="mage:briefcase" size="30"
                        class="opacity-40 transition group-hover:opacity-0 group-[.active]:opacity-0" />
                    <Icon
name="mage:briefcase-fill" size="30"
                        class="absolute opacity-0 transition group-hover:opacity-40 group-[.active]:text-secondary-400 group-[.active]:opacity-100" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/store')" class="group flex" active-class="active">
                    <Icon
name="mage:shop" size="30"
                        class="opacity-40 transition group-hover:opacity-0 group-[.active]:opacity-0" />
                    <Icon
name="mage:shop-fill" size="30"
                        class="absolute opacity-0 transition group-hover:opacity-40 group-[.active]:text-secondary-400 group-[.active]:opacity-100" />
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode()
const $toggleDarkMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>