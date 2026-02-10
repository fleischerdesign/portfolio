<script setup lang="ts">
const { profile, fetchProfile } = useProfile();

await callOnce('fetch-profile', fetchProfile);

const githubUrl = computed(() => {
    if (!profile.value?.github) return '';
    return profile.value.github.startsWith('http') ? profile.value.github : `https://${profile.value.github}`;
});

const linkedinUrl = computed(() => {
    if (!profile.value?.linkedin) return '';
    return profile.value.linkedin.startsWith('http') ? profile.value.linkedin : `https://${profile.value.linkedin}`;
});

const instagramUrl = computed(() => {
    if (!profile.value?.instagram) return '';
    return profile.value.instagram.startsWith('http') ? profile.value.instagram : `https://${profile.value.instagram}`;
});
</script>

<template>
    <div class="flex w-fit gap-3">
        <UiButton v-if="linkedinUrl" :to="linkedinUrl" target="_blank" variant="glass" size="icon">
            <Icon name="mdi:linkedin" size="24" />
        </UiButton>
        <UiButton v-if="githubUrl" :to="githubUrl" target="_blank" variant="glass" size="icon">
            <Icon name="mdi:github" size="24" />
        </UiButton>
        <UiButton v-if="instagramUrl" :to="instagramUrl" target="_blank" variant="glass" size="icon">
            <Icon name="mdi:instagram" size="24" />
        </UiButton>
        <slot />
    </div>
</template>