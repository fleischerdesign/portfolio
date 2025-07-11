<template>
    <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Success and Error Messages -->
        <div v-if="success" class="p-4 text-center text-green-400 bg-green-900/50 border border-green-700 rounded-lg">
            {{ $t('contact.form.success') }}
        </div>
        <div v-if="submitError" class="p-4 text-center text-red-400 bg-red-900/50 border border-red-700 rounded-lg">
            {{ $t('contact.form.error') }}
        </div>

        <!-- Form Fields -->
        <div class="relative">
            <input v-model="form.name" id="name" type="text"
                class="peer placeholder-transparent w-full px-4 py-3 shadow-sm dark:focus:placeholder-neutral-600 focus:placeholder-neutral-400 bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400  transition placeholder-opacity-0 peer-focus:placeholder-opacity-100"
                :class="{ 'border-red-500': errors.name }" placeholder="Name" required />
            <label for="name"
                class="absolute left-4 -top-2.5 text-sm text-neutral-400 dark:peer-focus:bg-neutral-900 peer-focus:bg-neutral-50 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-secondary-400">
                {{ $t("contact.form.label.name") }}
            </label>
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>

        <div class="relative">
            <input v-model="form.email" id="email" type="email"
                class="peer placeholder-transparent w-full px-4 py-3 shadow-sm dark:focus:placeholder-neutral-600 focus:placeholder-neutral-400 bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400  transition placeholder-opacity-0 peer-focus:placeholder-opacity-100"
                :class="{ 'border-red-500': errors.email }" placeholder="E-Mail" required />
            <label for="email"
                class="absolute left-4 -top-2.5 text-sm text-neutral-400 dark:peer-focus:bg-neutral-900 peer-focus:bg-neutral-50 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-secondary-400">
                {{ $t("contact.form.label.email") }}
            </label>
            <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
        </div>

        <div class="relative">
            <input v-model="form.subject" id="subject" type="text"
                class="peer placeholder-transparent w-full px-4 py-3 shadow-sm dark:focus:placeholder-neutral-600 focus:placeholder-neutral-400 bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400  transition placeholder-opacity-0 peer-focus:placeholder-opacity-100"
                :class="{ 'border-red-500': errors.subject }" :placeholder="$t('contact.form.placeholder.subject')"
                required />
            <label for="subject"
                class="absolute left-4 -top-2.5 text-sm text-neutral-400 dark:peer-focus:bg-neutral-900 peer-focus:bg-neutral-50 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-secondary-400">
                {{ $t("contact.form.label.subject") }}
            </label>
            <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject }}</p>
        </div>

        <div class="relative">
            <textarea v-model="form.message" id="message" rows="5"
                class="peer placeholder-transparent w-full px-4 py-3 shadow-sm dark:focus:placeholder-neutral-600 focus:placeholder-neutral-400 bg-gradient-to-br dark:from-neutral-900 from-neutral-100 dark:to-neutral-800 to-neutral-200 border dark:border-neutral-700 border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-400 transition placeholder-opacity-0 peer-focus:placeholder-opacity-100"
                :class="{ 'border-red-500': errors.name }" placeholder="Message" required />
            <label for="message"
                class="absolute left-4 -top-2.5 text-sm text-neutral-400 dark:peer-focus:bg-neutral-900 peer-focus:bg-neutral-50 px-1 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-secondary-400">
                {{ $t("contact.form.label.message") }}
            </label>
            <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
        </div>

        <Button type="submit" variant="secondary" class="w-full py-4 flex items-center justify-center" :disabled="loading">
            <span v-if="!loading">{{ $t('contact.form.label.submit') }}</span>
            <svg v-else class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
            </svg>
        </Button>
    </form>
</template>

<script setup lang="ts">
const { t } = useI18n();

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
});

const errors = ref<{ name?: string; email?: string; subject?: string; message?: string }>({});
const loading = ref(false);
const success = ref(false);
const submitError = ref(false);

function validate() {
    errors.value = {};
    if (!form.value.name) errors.value.name = t('contact.form.validation.name');
    if (!form.value.email) {
        errors.value.email = t('contact.form.validation.email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
        errors.value.email = t('contact.form.validation.email_invalid');
    }
    if (!form.value.subject) errors.value.subject = t('contact.form.validation.subject');
    if (!form.value.message) errors.value.message = t('contact.form.validation.message');
    return Object.keys(errors.value).length === 0;
}

async function onSubmit() {
    if (!validate()) return;

    loading.value = true;
    success.value = false;
    submitError.value = false;

    try {
        await $fetch('/api/contact', {
            method: 'POST',
            body: form.value
        });
        success.value = true;
        form.value = { name: '', email: '', subject: '', message: '' };
        // Hide success message after 5 seconds
        setTimeout(() => success.value = false, 5000);
    } catch (e) {
        submitError.value = true;
        // Hide error message after 5 seconds
        setTimeout(() => submitError.value = false, 5000);
    } finally {
        loading.value = false;
    }
}
</script>
