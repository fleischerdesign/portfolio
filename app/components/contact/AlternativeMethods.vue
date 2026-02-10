<script lang="ts" setup>
const { profile, fetchProfile } = useProfile();

await callOnce('fetch-profile', fetchProfile);

const copyIcon = ref('mage:copy');
const phoneCopyIcon = ref('mage:copy');

const copyEmail = () => {
    if (!profile.value?.email) return;
    navigator.clipboard.writeText(profile.value.email);
    copyIcon.value = 'mage:check-circle';
    setTimeout(() => {
        copyIcon.value = 'mage:copy';
    }, 2000);
};

const copyPhone = () => {
    if (!profile.value?.phone) return;
    navigator.clipboard.writeText(profile.value.phone.replace(/\s/g, ''));
    phoneCopyIcon.value = 'mage:check-circle';
    setTimeout(() => {
        phoneCopyIcon.value = 'mage:copy';
    }, 2000);
};
</script>

<template>
    <div class="space-y-10">
        <!-- Social Media Section -->
        <div class="flex flex-col gap-4">
            <div>
                <h3 class="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{{ $t('contact.social.title') }}</h3>
                <p class="mt-1 text-neutral-500 dark:text-neutral-400">{{ $t('contact.social.description') }}</p>
            </div>
            <div class="pt-2">
                <SocialLinks />
            </div>
        </div>

        <!-- Contact Cards -->
        <div class="grid grid-cols-1 gap-6">
            <!-- Email Card -->
            <div v-if="profile?.email" class="flex flex-col gap-3">
                <h4 class="text-xs font-bold uppercase tracking-widest text-secondary-500">{{ $t('contact.email.title') }}</h4>
                <div class="group relative flex items-center gap-4 rounded-2xl border border-neutral-200/60 bg-white/50 p-4 backdrop-blur-md transition-all duration-500 hover:border-secondary-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] dark:border-neutral-800/60 dark:bg-neutral-900/50 dark:hover:border-secondary-400/30">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-800 dark:group-hover:bg-secondary-900/30">
                        <Icon name="mage:email" size="24" class="text-neutral-600 dark:text-neutral-400 dark:group-hover:text-secondary-400" />
                    </div>
                    <span class="text-lg font-medium text-neutral-800 dark:text-white">{{ profile.email }}</span>
                    <UiButton 
                        variant="glass" 
                        size="icon" 
                        class="ml-auto" 
                        :aria-label="$t('contact.email.copy')" 
                        @click="copyEmail"
                    >
                        <Icon :name="copyIcon" size="20" />
                    </UiButton>
                </div>
            </div>

            <!-- Phone Card -->
            <div v-if="profile?.phone" class="flex flex-col gap-3">
                <h4 class="text-xs font-bold uppercase tracking-widest text-secondary-500">{{ $t('contact.phone.title') }}</h4>
                <div class="group relative flex items-center gap-4 rounded-2xl border border-neutral-200/60 bg-white/50 p-4 backdrop-blur-md transition-all duration-500 hover:border-secondary-500/30 hover:shadow-[0_0_25px_rgba(16,185,129,0.1)] dark:border-neutral-800/60 dark:bg-neutral-900/50 dark:hover:border-secondary-400/30">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-800 dark:group-hover:bg-secondary-900/30">
                        <Icon name="mage:phone" size="24" class="text-neutral-600 dark:text-neutral-400 dark:group-hover:text-secondary-400" />
                    </div>
                    <span class="text-lg font-medium text-neutral-800 dark:text-white">{{ profile.phone }}</span>
                    <UiButton 
                        variant="glass" 
                        size="icon" 
                        class="ml-auto" 
                        :aria-label="$t('contact.phone.copy')" 
                        @click="copyPhone"
                    >
                        <Icon :name="phoneCopyIcon" size="20" />
                    </UiButton>
                </div>
            </div>
        </div>
    </div>
</template>