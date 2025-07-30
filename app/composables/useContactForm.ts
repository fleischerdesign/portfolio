export function useContactForm() {
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
      form.value.name = '';
      form.value.email = '';
      form.value.subject = '';
      form.value.message = '';
      setTimeout(() => success.value = false, 5000);
    } catch (error) {
      console.error('Form submission failed:', error);
      submitError.value = true;
      setTimeout(() => submitError.value = false, 5000);
    } finally {
      loading.value = false;
    }
  }

  return {
    form,
    errors,
    loading,
    success,
    submitError,
    onSubmit
  };
}