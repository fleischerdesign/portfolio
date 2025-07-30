<template>
    <form class="space-y-6" @submit.prevent="onSubmit">
        <!-- Success and Error Messages -->
        <div v-if="success" class="rounded-lg border border-green-700 bg-green-900/50 p-4 text-center text-green-400">
            {{ $t('contact.form.success') }}
        </div>
        <div v-if="submitError" class="rounded-lg border border-red-700 bg-red-900/50 p-4 text-center text-red-400">
            {{ $t('contact.form.error') }}
        </div>

        <!-- Form Fields -->
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
            required />

        <UiButton type="submit" variant="secondary" class="flex w-full items-center justify-center py-4" :disabled="loading">
            <span v-if="!loading">{{ $t('contact.form.label.submit') }}</span>
            <svg
v-else class="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </UiButton>
    </form>
</template>

<script setup lang="ts">

const { form, errors, loading, success, submitError, onSubmit } = useContactForm();
</script>
