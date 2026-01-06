<template>
    <form class="flex h-full flex-col space-y-8" @submit.prevent="onSubmit">
        <!-- Status Messages with Glow -->
        <div v-if="success" class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <Icon name="mage:check-circle-fill" size="32" class="mx-auto mb-2 text-emerald-500" />
            <p class="font-bold text-emerald-700 dark:text-emerald-400">{{ $t('contact.form.success') }}</p>
        </div>
        
        <div v-if="submitError" class="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center backdrop-blur-md shadow-lg shadow-red-500/10">
            <Icon name="mage:exclamation-circle-fill" size="32" class="mx-auto mb-2 text-red-500" />
            <p class="font-bold text-red-700 dark:text-red-400">{{ $t('contact.form.error') }}</p>
        </div>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <UiInput
                id="name" 
                v-model="form.name" 
                :label="$t('contact.form.label.name')" 
                :error="errors.name" 
                required />
            <UiInput
                id="email" 
                v-model="form.email" 
                type="email" 
                :label="$t('contact.form.label.email')" 
                :error="errors.email" 
                required />
        </div>

        <UiInput
            id="subject" 
            v-model="form.subject" 
            :label="$t('contact.form.label.subject')" 
            :error="errors.subject" 
            required />
            
        <UiInput
            id="message" 
            v-model="form.message" 
            as="textarea" 
            :label="$t('contact.form.label.message')" 
            :error="errors.message"
            class="flex-grow"
            required />

        <UiButton 
            type="submit" 
            variant="secondary" 
            size="lg"
            class="group relative w-full overflow-hidden shadow-xl transition-all duration-500 hover:shadow-secondary-500/20" 
            :disabled="loading"
        >
            <span v-if="!loading" class="relative z-10 flex items-center gap-2">
                {{ $t('contact.form.label.submit') }}
                <Icon name="heroicons:paper-airplane-20-solid" class="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </span>
            <div v-else class="relative z-10 flex items-center gap-2">
                <Icon name="mdi:loading" class="h-5 w-5 animate-spin" />
                <span>Sending...</span>
            </div>
            
            <!-- Animated Shimmer Highlight -->
            <div class="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
        </UiButton>
    </form>
</template>

<script setup lang="ts">
const { form, errors, loading, success, submitError, onSubmit } = useContactForm();
</script>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>