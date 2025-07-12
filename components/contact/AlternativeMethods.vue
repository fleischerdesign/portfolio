<template>
    <div class="space-y-8">
        <div>
            <h3 class="text-2xl font-semibold mb-2">{{ $t('contact.social.title') }}</h3>
            <p class="text-neutral-400 mb-4">{{ $t('contact.social.description') }}</p>
            <SocialLinks />
        </div>
        <div>
            <h3 class="text-2xl font-semibold mb-2">{{ $t('contact.email.title') }}</h3>
            <p class="text-neutral-400 mb-4">{{ $t('contact.email.description') }}</p>
            <div class="flex items-center gap-4 w-full px-4 py-3 shadow-sm bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg">
                <Icon name="mdi:email-outline" class="text-2xl text-neutral-400" />
                <span class="text-lg">hello@fleischer.design</span>
                <Button @click="copyEmail" class="ml-auto" :aria-label="$t('contact.email.copy')">
                    <Icon :name="copyIcon" class="text-xl" />
                </Button>
            </div>
        </div>
        <div>
            <h3 class="text-2xl font-semibold mb-2">{{ $t('contact.phone.title') }}</h3>
            <p class="text-neutral-400 mb-4">{{ $t('contact.phone.description') }}</p>
            <div class="flex items-center gap-4 w-full px-4 py-3 shadow-sm bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg">
                <Icon name="mdi:phone-outline" class="text-2xl text-neutral-400" />
                <span class="text-lg">+49 176 31099324</span>
                <Button @click="copyPhone" class="ml-auto" :aria-label="$t('contact.phone.copy')">
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

