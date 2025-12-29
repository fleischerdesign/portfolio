<script setup lang="ts">
import type { ApplicationCreatePayload } from '#shared/schemas/application.schema';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const router = useRouter();
const localePath = useLocalePath();
const isLoading = ref(false);

const form = ref<ApplicationCreatePayload>({
  title: '',
  subtitle: '',
  slug: '',
  url: '',
  company: {
    name: '',
    address: {
      street: '',
      houseNumber: '',
      zipcode: undefined,
      city: '',
    }
  },
  body: '',
  notes: [],
  interviews: [],
});

const autoSlug = ref(true);
watch(() => [form.value.company.name, form.value.title], ([companyName, title]) => {
  if (autoSlug.value) {
    form.value.slug = slugify(`${companyName} ${title}`);
  }
});

function manualSlugInput() {
  autoSlug.value = false;
}

async function createApplication() {
  isLoading.value = true;
  try {
    const payload = JSON.parse(JSON.stringify(form.value));

    // Ensure zipcode is a number if address is provided
    if (payload.company.address && payload.company.address.zipcode) {
      const parsedZip = parseInt(payload.company.address.zipcode, 10);
      if (!isNaN(parsedZip)) {
        payload.company.address.zipcode = parsedZip;
      } else {
        // If parsing fails, it's better to nullify it to avoid validation errors
        payload.company.address.zipcode = undefined; 
      }
    }

    // Clean up address if essential fields are missing
    if (payload.company.address && (!payload.company.address.street || !payload.company.address.city)) {
      payload.company.address = undefined;
    }

    const result = await useRequestFetch()('/api/applications', {
      method: 'POST',
      body: payload,
    });
    
    const newSlug = result?.result?.slug;
    if (newSlug) {
      router.push(localePath(`/application/${newSlug}`));
    } else {
      // TODO: Fallback or error handling
      router.push(localePath('/application'));
    }
  } catch (error) {
    console.error('Failed to create application', error);
    // TODO: Add user-facing error handling
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl py-16">
    <div class="mb-12">
      <UiSectionHeader title="Neue Bewerbung erstellen" subtitle="Fülle die Details für die neue Bewerbung aus." />
    </div>
    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4 lg:items-start">
      <div class="space-y-8 lg:col-span-3">
        <UiCard>
          <UiCardContainer class="flex h-full flex-col gap-4">
            <h3 class="text-2xl font-medium">Basis-Informationen</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UiInput id="title" v-model="form.title" label="Jobtitel" required />
              <UiInput id="subtitle" v-model="form.subtitle" label="Untertitel / Slogan" />
              <UiInput id="slug" v-model="form.slug" label="URL-Slug" required @input="manualSlugInput" />
              <UiInput id="url" v-model="form.url" label="URL zur Ausschreibung" />
            </div>
          </UiCardContainer>
        </UiCard>

        <UiCard>
          <UiCardContainer class="flex h-full flex-col gap-4">
            <h3 class="text-2xl font-medium">Unternehmen</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UiInput id="company-name" v-model="form.company.name" label="Firmenname" required />
              <div />
              <UiInput id="company-street" v-model="form.company.address.street" label="Straße" />
              <UiInput id="company-housenumber" v-model="form.company.address.houseNumber" label="Hausnummer" />
              <UiInput id="company-zipcode" v-model="form.company.address.zipcode" type="number" label="PLZ" />
              <UiInput id="company-city" v-model="form.company.address.city" label="Stadt" />
            </div>
          </UiCardContainer>
        </UiCard>

        <UiCard>
            <UiCardContainer>
                <h3 class="mb-4 text-2xl font-medium">Inhalt (Anschreiben)</h3>
                <UiInput
                    id="body"
                    v-model="form.body"
                    as="textarea"
                    label="Inhalt (Markdown)"
                    class="min-h-64"
                />
            </UiCardContainer>
        </UiCard>
      </div>

      <div class="sticky top-10 flex flex-col gap-2 lg:col-span-1">
        <div class="rounded-lg bg-white shadow dark:bg-neutral-900">
          <div class="flex w-full flex-col gap-2">
            <UiButton class="w-full" :is-loading="isLoading" @click="createApplication">
              Speichern & Erstellen
            </UiButton>
            <NuxtLink :to="$localePath('/application')">
              <UiButton class="w-full" variant="secondary">
                Abbrechen
              </UiButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
