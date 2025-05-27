<template>
    <div class="flex fixed bottom-0 my-2 w-full">
        <div class="m-auto flex gap-2">
            <div
                class="group p-3 flex backdrop-blur-md bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border rounded-lg border-neutral-700/40 hover:bg-gradient-to-br hover:from-neutral-800/40 hover:to-neutral-900/40 hover:border-neutral-600/40 hover:shadow-inner transition">
                <Icon name="mage:bolt" size="30" class="opacity-60 hover:-translate-y-1 transition hover-group:opacity-0"/>
                <Icon name="mage:bolt-fill" size="30" class="opacity-0 absolute transition group-hover:opacity-100"/>
            </div>
            <div
                class="flex gap-3 p-3 backdrop-blur-md bg-gradient-to-br from-neutral-900/40 to-neutral-800/40 border rounded-lg border-neutral-700/40 hover:bg-gradient-to-br hover:from-neutral-800/40 hover:to-neutral-900/40 hover:border-neutral-600/40 hover:shadow-inner transition">
                <NuxtLink :to="$localePath('/')" class="group flex" activeClass="active">
                    <Icon name="mage:home" size="30" class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0"/>
                    <Icon name="mage:home-fill" size="30" class="group-[.active]:opacity-100 absolute opacity-0 transition group-hover:opacity-40"/>
                </NuxtLink>
                <NuxtLink :to="$localePath('/about')" class="group flex" activeClass="active">
                    <Icon name="mage:user-square" size="30" class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0"/>
                    <Icon name="mage:user-square-fill" size="30" class="group-[.active]:opacity-100 absolute opacity-0 transition group-hover:opacity-40"/>
                </NuxtLink>
                <NuxtLink :to="$localePath('/blog')" class="group flex" activeClass="active">
                    <Icon name="mage:note" size="30" class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0"/>
                    <Icon name="mage:note-fill" size="30" class="group-[.active]:opacity-100 absolute opacity-0 transition group-hover:opacity-40"/>
                </NuxtLink>
                <NuxtLink :to="$localePath('/projects')" class="group flex" activeClass="active">
                    <Icon name="mage:briefcase" size="30" class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0"/>
                    <Icon name="mage:briefcase-fill" size="30" class="group-[.active]:opacity-100 absolute opacity-0 transition group-hover:opacity-40"/>
                </NuxtLink>
                <NuxtLink :to="$localePath('/store')" class="group flex" activeClass="active">
                    <Icon name="mage:shop" size="30" class="group-[.active]:opacity-0 opacity-40 transition group-hover:opacity-0"/>
                    <Icon name="mage:shop-fill" size="30" class="group-[.active]:opacity-100 absolute opacity-0 transition group-hover:opacity-40"/>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>