<template>
    <div class="space-y-8">
        <div>
            <h3 class="mb-2 text-2xl font-semibold">{{ $t('contact.social.title') }}</h3>
            <p class="mb-4 text-neutral-400">{{ $t('contact.social.description') }}</p>
            <SocialLinks />
        </div>
        <div>
            <h3 class="mb-2 text-2xl font-semibold">{{ $t('contact.email.title') }}</h3>
            <p class="mb-4 text-neutral-400">{{ $t('contact.email.description') }}</p>
            <div class="flex w-full items-center gap-4 rounded-lg border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 px-4 py-3 shadow-sm dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800">
                <Icon name="mdi:email-outline" class="text-2xl text-neutral-400" />
                <span class="text-lg">hello@fleischer.design</span>
                <Button class="ml-auto" :aria-label="$t('contact.email.copy')" @click="copyEmail">
                    <Icon :name="copyIcon" class="text-xl" />
                </Button>
            </div>
        </div>
        <div>
            <h3 class="mb-2 text-2xl font-semibold">{{ $t('contact.phone.title') }}</h3>
            <p class="mb-4 text-neutral-400">{{ $t('contact.phone.description') }}</p>
            <div class="flex w-full items-center gap-4 rounded-lg border border-neutral-300 bg-gradient-to-br from-neutral-100 to-neutral-200 px-4 py-3 shadow-sm dark:border-neutral-700 dark:from-neutral-900 dark:to-neutral-800">
                <Icon name="mdi:phone-outline" class="text-2xl text-neutral-400" />
                <span class="text-lg">+49 176 31099324</span>
                <Button class="ml-auto" :aria-label="$t('contact.phone.copy')" @click="copyPhone">
                    <Icon :name="phoneCopyIcon" class="text-xl" />
                </Button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const copyIcon = ref('mdi:content-copy');
const phoneCopyIcon = ref('mdi:content-copy');

const copyEmail = () => {
    navigator.clipboard.writeText('hello@fleischer.design');
    copyIcon.value = 'mdi:check';
    setTimeout(() => {
        copyIcon.value = 'mdi:content-copy';
    }, 2000);
};

const copyPhone = () => {
    navigator.clipboard.writeText('+4917631099324');
    phoneCopyIcon.value = 'mdi:check';
    setTimeout(() => {
        phoneCopyIcon.value = 'mdi:content-copy';
    }, 2000);
};
</script>

