import { ref } from 'vue'
import { type ContactForm, ContactFormSchema } from '~~/shared/schemas/contactForm.schema'

const TIMEOUT_DURATION = 5000

/**
 * @composable useContactForm
 * @description Composable for managing contact form state and submission.
 */
export function useContactForm() {
    const form = ref<ContactForm>({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const errors = ref<Record<string, string>>({})
    const loading = ref(false)
    const success = ref(false)
    const submitError = ref(false)

    /**
     * @handler onSubmit
     * @description Validates and submits the contact form.
     */
    async function onSubmit() {
        const validation = ContactFormSchema.safeParse(form.value)
        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors
            errors.value = Object.fromEntries(
                Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || ''])
            )
            return
        }
        
        errors.value = {}
        loading.value = true
        success.value = false
        submitError.value = false

        try {
            await $fetch('/api/contact', {
                method: 'POST',
                body: validation.data,
            })
            success.value = true
            form.value = { name: '', email: '', subject: '', message: '' }
            setTimeout(() => (success.value = false), TIMEOUT_DURATION)
        } catch (error: unknown) {
            console.error('Form submission failed:', error)
            submitError.value = true
            setTimeout(() => (submitError.value = false), TIMEOUT_DURATION)
        } finally {
            loading.value = false
        }
    }

    return {
        form,
        errors,
        loading,
        success,
        submitError,
        onSubmit,
    }
}
