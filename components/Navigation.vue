<template>
    <div class="flex fixed bottom-0 my-2 w-full">
        <div class="m-auto flex gap-2">
            <div
                class="p-3 flex backdrop-blur-sm bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border rounded-lg border-neutral-700/40 hover:bg-gradient-to-br hover:from-neutral-800/40 hover:to-neutral-900/40 hover:border-neutral-600/40 hover:shadow-inner transition">
                <Icon name="mdi:settings" size="30" class="opacity-60 hover:-translate-y-1 transition"/>
            </div>
            <div
                class="flex gap-3 p-3 backdrop-blur-sm bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border rounded-lg border-neutral-700/40 hover:bg-gradient-to-br hover:from-neutral-800/40 hover:to-neutral-900/40 hover:border-neutral-600/40 hover:shadow-inner transition">
                <NuxtLink to="/" class="flex" exactActiveClass="*:!opacity-100"><Icon name="mdi:home-variant" size="30" class="opacity-60 hover:-translate-y-1 transition"/></NuxtLink>
                <NuxtLink to="/about" class="flex" exactActiveClass="*:!opacity-100"><Icon name="mdi:person-circle" size="30" class="opacity-60 hover:-translate-y-1 transition"/></NuxtLink>
                <NuxtLink to="/blog" class="flex" exactActiveClass="*:!opacity-100"><Icon name="mdi:text-box" size="30" class="opacity-60 hover:-translate-y-1 transition"/></NuxtLink>
                <NuxtLink to="/projects" class="flex" exactActiveClass="*:!opacity-100"><Icon name="mdi:work" size="30" class="opacity-60 hover:-translate-y-1 transition"/></NuxtLink>
                <NuxtLink to="/store" class="flex" exactActiveClass="*:!opacity-100"><Icon name="mdi:store" size="30" class="opacity-60 hover:-translate-y-1 transition"/></NuxtLink>
            </div>
        </div>
    </div>
</template>