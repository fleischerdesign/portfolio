<template>
    <div class="flex w-full gap-3">
        <UiButton to="https://www.linkedin.com/in/fleischerdesign" target="_blank">
            <Icon name="mdi:linkedin" size="30" />
        </UiButton>
        <UiButton to="https://github.com/fleischerdesign" target="_blank">
            <Icon name="mdi:github" size="30" />
        </UiButton>
        <UiButton to="https://instagram.com/fleischer.design/" target="_blank">
            <Icon name="mdi:instagram" size="30" />
        </UiButton>
        <slot />
    </div>
</template>