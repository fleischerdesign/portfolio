<template>
    <div class="flex fixed bottom-0 my-2 w-full z-20 print:hidden">
        <div class="m-auto flex gap-2">
            <div @click="$toggleDarkMode()"
                class="shadow-sm cursor-pointer group p-3 flex backdrop-blur-md bg-gradient-to-br dark:from-neutral-900/40 from-neutral-100/40 dark:to-neutral-800/40 to-neutral-200/40 border rounded-lg dark:border-neutral-700/40 border-neutral-300/40 hover:bg-gradient-to-br dark:hover:from-neutral-800/40 hover:from-neutral-200/40 dark:hover:to-neutral-900/40 hover:to-neutral-100/40 dark:hover:border-neutral-600/40 hover:border-neutral-400/40 hover:shadow-inner transition">
                <ClientOnly>
                    <template v-if="colorMode.value == 'light'">
                        <Icon name="mage:moon" size="30"
                            class="opacity-40 hover:-translate-y-1 transition group-hover:opacity-0" />
                        <Icon name="mage:moon-fill" size="30"
                            class="opacity-0 absolute transition group-hover:opacity-100" />
                    </template>
                    <template v-else>
                        <Icon name="mage:sun" size="30"
                            class="opacity-40 hover:-translate-y-1 transition group-hover:opacity-0" />
                        <Icon name="mage:sun-fill" size="30"
                            class="opacity-0 absolute transition group-hover:opacity-100" />
                    </template>
                    <template #fallback>
                        <!-- Fallback für SSR - zeigt ein neutrales Icon -->
                        <Icon name="mage:moon" size="30" class="opacity-40" />
                    </template>
                </ClientOnly>
            </div>
            <div
                class="shadow-sm flex gap-3 p-3 backdrop-blur-md bg-gradient-to-br dark:from-neutral-900/40 from-neutral-100/40 dark:to-neutral-800/40 to-neutral-200/40 border rounded-lg dark:border-neutral-700/40 border-neutral-300/40 hover:bg-gradient-to-br dark:hover:from-neutral-800/40 hover:from-neutral-200/40 dark:hover:to-neutral-900/40 hover:to-neutral-100/40 dark:hover:border-neutral-600/40 hover:border-neutral-400/40 hover:shadow-inner transition">
                <NuxtLink :to="$localePath('/')" class="group flex" activeClass="active">
                    <Icon name="mage:home" size="30"
                        class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0" />
                    <Icon name="mage:home-fill" size="30"
                        class="group-[.active]:opacity-100 group-[.active]:text-secondary-400 absolute opacity-0 transition group-hover:opacity-40" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/about')" class="group flex" activeClass="active">
                    <Icon name="mage:user-square" size="30"
                        class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0" />
                    <Icon name="mage:user-square-fill" size="30"
                        class="group-[.active]:opacity-100 group-[.active]:text-secondary-400 absolute opacity-0 transition group-hover:opacity-40" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/blog')" class="group flex" activeClass="active">
                    <Icon name="mage:note" size="30"
                        class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0" />
                    <Icon name="mage:note-fill" size="30"
                        class="group-[.active]:opacity-100 group-[.active]:text-secondary-400 absolute opacity-0 transition group-hover:opacity-40" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/projects')" class="group flex" activeClass="active">
                    <Icon name="mage:briefcase" size="30"
                        class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0" />
                    <Icon name="mage:briefcase-fill" size="30"
                        class="group-[.active]:opacity-100 group-[.active]:text-secondary-400 absolute opacity-0 transition group-hover:opacity-40" />
                </NuxtLink>
                <NuxtLink :to="$localePath('/store')" class="group flex" activeClass="active">
                    <Icon name="mage:shop" size="30"
                        class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0" />
                    <Icon name="mage:shop-fill" size="30"
                        class="group-[.active]:opacity-100 group-[.active]:text-secondary-400 absolute opacity-0 transition group-hover:opacity-40" />
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