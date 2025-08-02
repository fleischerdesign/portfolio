import { ref } from 'vue'
import { z } from 'zod'
import { ContactFormSchema, type ContactForm } from '~/utils/schemas/contact'

const TIMEOUT_DURATION = 5000

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

    async function onSubmit() {
        try {
            // Validiere das Formular mit dem Zod-Schema
            ContactFormSchema.parse(form.value)
            errors.value = {}
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Extrahiere die Fehlermeldungen aus dem Zod-Error
                const newErrors: Record<string, string> = {}
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0]] = err.message
                    }
                })
                errors.value = newErrors
                return // Stoppe die Ausführung, wenn die Validierung fehlschlägt
            }
        }

        loading.value = true
        success.value = false
        submitError.value = false

        try {
            await $fetch('/api/contact', {
                method: 'POST',
                body: form.value,
            })
            success.value = true
            // Formular zurücksetzen
            form.value = { name: '', email: '', subject: '', message: '' }
            setTimeout(() => (success.value = false), TIMEOUT_DURATION)
        } catch (error) {
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
