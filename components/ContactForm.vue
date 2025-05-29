<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
    <div>
      <label class="block text-neutral-400 mb-1" for="name">Name</label>
      <input
        v-model="form.name"
        id="name"
        type="text"
        class="bg-gradient-to-br from-neutral-900 to-neutral-800 w-full px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        :class="{ 'border-red-500': errors.name }"
        placeholder="Dein Name"
        required
      />
      <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
    </div>
    <div>
      <label class="block text-neutral-400 mb-1" for="email">E-Mail</label>
      <input
        v-model="form.email"
        id="email"
        type="email"
        class="bg-gradient-to-br from-neutral-900 to-neutral-800 w-full px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        :class="{ 'border-red-500': errors.email }"
        placeholder="deine@email.de"
        required
      />
      <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
    </div>
    <div>
      <label class="block text-neutral-400 mb-1" for="subject">Betreff</label>
      <input
        v-model="form.subject"
        id="subject"
        type="subject"
        class="bg-gradient-to-br from-neutral-900 to-neutral-800 w-full px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        :class="{ 'border-red-500': errors.subject }"
        placeholder="Dein Anliegen"
        required
      />
      <p v-if="errors.subject" class="text-red-500 text-sm mt-1">{{ errors.subject }}</p>
    </div>
    <div>
      <label class="block text-neutral-400 mb-1" for="message">Nachricht</label>
      <textarea
        v-model="form.message"
        id="message"
        rows="5"
        class="bg-gradient-to-br from-neutral-900 to-neutral-800 w-full px-4 py-2 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        :class="{ 'border-red-500': errors.message }"
        placeholder="Deine Nachricht"
        required
      ></textarea>
      <p v-if="errors.message" class="text-red-500 text-sm mt-1">{{ errors.message }}</p>
    </div>
    <div class="grid grid-cols-2 gap-4">
    <Button class="px-4 py-4 place-self-start"><Icon name="mage:phone" size="30" /></Button>
    <button
      type="submit"
      class="border border-green-300 bg-green-400 text-neutral-900 px-4 py-4 rounded-lg hover:bg-green-600 hover:border-green-500 active:bg-green-500 active:border-green-400 active:drop-shadow-emit transition"
      :disabled="loading"
    >
      {{ loading ? 'Senden...' : 'Senden' }}
    </button>
    </div>
    <p v-if="success" class="text-green-600 text-center mt-2">Vielen Dank für deine Nachricht!</p>
    <p v-if="submitError" class="text-red-600 text-center mt-2">Fehler beim Senden. Bitte versuche es erneut.</p>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  message: '',
  subject: ''
})

const errors = ref<{ name?: string; email?: string; subject?: string; message?: string }>({})
const loading = ref(false)
const success = ref(false)
const submitError = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'Name ist erforderlich'
  if (!form.value.email) {
    errors.value.email = 'E-Mail ist erforderlich'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Bitte gib eine gültige E-Mail-Adresse ein'
  }
  if (!form.value.message) errors.value.message = 'Nachricht ist erforderlich'
  return Object.keys(errors.value).length === 0
}

async function onSubmit() {
  if (!validate()) return
  loading.value = true
  success.value = false
  submitError.value = false
  try {
    // Hier könntest du einen API-Call machen, z.B. via useFetch oder Supabase
    // await $fetch('/api/contact', { method: 'POST', body: form.value })
    await new Promise(resolve => setTimeout(resolve, 1200)) // Demo: Fake-Delay
    success.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
  } catch (e) {
    submitError.value = true
  } finally {
    loading.value = false
  }
}
</script>
