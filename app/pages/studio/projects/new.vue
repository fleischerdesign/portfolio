<script setup lang="ts">
import type { ProjectCreate } from '~~/shared/schemas/project.schema';
import { slugify } from '~~/shared/utils/slugify';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin
});

const router = useRouter();
const localePath = useLocalePath();
const { showToast } = useToast();

const form = ref({
  title: '',
  slug: '',
  translationKey: ''
});

const isLoading = ref(false);

// Auto-generate slug and translation key from title
watch(() => form.value.title, (newVal, oldVal) => {
  const newSlug = slugify(newVal);
  const oldSlug = slugify(oldVal || '');

  if (!form.value.slug || form.value.slug === oldSlug) {
    form.value.slug = newSlug;
  }
  
  if (!form.value.translationKey || form.value.translationKey === oldSlug) {
      form.value.translationKey = newSlug;
  }
});

async function create() {
  if (!form.value.title || !form.value.slug || !form.value.translationKey) {
      showToast('Please fill in all required fields', { type: 'error' });
      return;
  }

  isLoading.value = true;
  try {
    const payload: ProjectCreate = {
      locale: 'de', // Default locale
      title: form.value.title,
      slug: form.value.slug,
      translationKey: form.value.translationKey,
      subtitle: '',
      body: 'Describe your project here',
      status: 'draft',
      publishedAt: new Date(),
      icon: 'mage:folder',
      coverImage: null,
      coverImageAlt: null,
      repoUrl: null,
      projectUrl: null,
      features: [],
      learned: [],
      challenges: [],
      categoryName: null,
      tags: [],
      techstack: []
    };

    const res = await $fetch<{ result?: { id: number }, id?: number }>('/api/projects', {
      method: 'POST',
      body: payload
    });

    const projectId = res.result?.id || res.id;
    
    if (projectId) {
        showToast('Project created!', { type: 'success' });
        router.push(localePath(`/studio/projects/${projectId}`));
    } else {
        throw new Error('No ID returned from server');
    }

  } catch (error) {
    console.error(error);
    showToast('Failed to create project', { type: 'error' });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="container mx-auto max-w-screen-md px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <UiBackButton :to="$localePath('/studio/projects')" class="mb-8" />
    
    <UiCard>
        <UiCardContainer class="space-y-6 p-8">
            <div class="mb-6">
                <h1 class="text-2xl font-bold">Create New Project</h1>
                <p class="text-neutral-500">Start with the basics. You can edit the full details and translations later.</p>
            </div>

            <UiInput id="title" v-model="form.title" label="Title (German)" placeholder="My Awesome Project" required />
            
            <UiInput id="slug" v-model="form.slug" label="URL Slug" placeholder="my-awesome-project" required />

            <UiInput id="translation-key" v-model="form.translationKey" label="Translation Key" placeholder="my-awesome-project" helper-text="Used to link different language versions together." required />

            <UiButton class="mt-4 w-full" :is-loading="isLoading" @click="create">
                Create & Edit
            </UiButton>
        </UiCardContainer>
    </UiCard>
  </div>
</template>
