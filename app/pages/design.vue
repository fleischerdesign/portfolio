<script setup lang="ts">
const { showToast } = useToast();

definePageMeta({
  title: 'Design System',
});

// Demo states
const isLoading = ref(false);
const searchTerm = ref('');
const selectedStatus = ref('published');
const inputText = ref('Sample text');
const inputError = ref('This field is required');
const showDemoModal = ref(false);
const editorContent = ref('# Hello Markdown\n\nThis is a live preview of the **ContentEditor**.\n\n- Feature 1\n- Feature 2');

function toggleLoading() {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 2000);
}

function triggerToast(type: 'success' | 'error' | 'info' | 'warning') {
  showToast(`This is a ${type} toast message!`, { type });
}

// Mock Data
const demoTimeline = [
  { date: '2024', title: 'Senior Developer', description: 'Leading the frontend team at TechCorp.', icon: 'heroicons:briefcase', skills: ['Vue', 'Nuxt', 'TypeScript'] },
  { date: '2022', title: 'Fullstack Engineer', description: 'Built highly scalable microservices.', icon: 'heroicons:cpu-chip', skills: ['Node.js', 'Go'] },
];

const demoContact = {
  name: 'John Doe',
  position: 'Hiring Manager',
  email: 'john@example.com',
  phone: '+49 123 456789'
};

const mockProject = {
  id: 1,
  title: 'Portfolio Website',
  subtitle: 'Nuxt 4 & Tailwind CSS',
  slug: 'portfolio',
  status: 'published',
  icon: 'heroicons:globe-alt',
  coverImage: null,
  tags: [{ id: 1, name: 'Nuxt', slug: 'nuxt' }],
  techstack: [{ id: 1, name: 'Vue', slug: 'vue' }]
};

const mockPost = {
  id: 1,
  title: 'Refactoring like a Pro',
  excerpt: 'A deep dive into clean code patterns.',
  slug: 'refactoring-pro',
  status: 'published',
  publishedAt: new Date(),
  tags: [{ id: 1, name: 'Engineering', slug: 'eng' }]
};

const mockApplication = {
  id: 1,
  title: 'Senior Frontend Developer',
  company: { name: 'Tech Solutions' },
  currentStatus: 'applied',
  updatedAt: new Date(),
  notes: [],
  documents: [],
  contacts: []
};
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-32 pt-32 md:px-8 lg:pt-44 font-sans">
    
    <!-- Header -->
    <section class="mb-32">
      <UiSectionHeader
        symbol="heroicons:paint-brush"
        title="Design System"
        subtitle="Visual language and component reference for the portfolio."
      />
    </section>

    <!-- 1. BUTTONS -->
    <section class="mb-32">
      <UiSectionHeader title="Buttons" subtitle="Interactive triggers." class="mb-16" />
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="space-y-6">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Variants</p>
          <div class="flex flex-wrap items-center gap-4">
            <UiButton>Default</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="glass">Glass</UiButton>
            <UiButton variant="danger">Danger</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
          </div>
        </div>
        <div class="space-y-6 md:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Sizes</p>
          <div class="flex flex-wrap gap-4 items-center">
            <UiButton size="sm">Small</UiButton>
            <UiButton size="md">Medium</UiButton>
            <UiButton size="lg">Large</UiButton>
            <UiButton size="icon"><Icon name="heroicons:plus" /></UiButton>
          </div>
        </div>
        <div class="space-y-6 lg:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Async</p>
          <div class="flex flex-wrap gap-4">
            <UiButton :is-loading="isLoading" @click="toggleLoading">Click to Load</UiButton>
            <UiButton disabled>Disabled</UiButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. CARDS -->
    <section class="mb-32">
      <UiSectionHeader title="Cards & Elevation" subtitle="Surface containers." class="mb-16" />
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <UiCard shadow="sm"><UiCardContainer class="p-10 text-center font-bold">shadow-sm</UiCardContainer></UiCard>
        <UiCard hover shadow="sm"><UiCardContainer class="p-10 text-center font-bold">hover-shadow</UiCardContainer></UiCard>
        <UiCard shadow="accent"><UiCardContainer class="p-10 text-center font-bold text-secondary-600">shadow-accent</UiCardContainer></UiCard>
        <UiContactCard :contact="demoContact" />
      </div>
    </section>

    <!-- 3. FORMS -->
    <section class="mb-32">
      <UiSectionHeader title="Forms & Inputs" subtitle="Data entry." class="mb-16" />
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="space-y-8">
          <UiInput id="f1" label="Standard Input" placeholder="Type something..." v-model="inputText" />
          <UiInput id="f2" label="With Icon"><template #prefix><Icon name="heroicons:envelope" size="18" /></template></UiInput>
          <UiInput id="f3" label="Error State" :error="inputError" has-error />
        </div>
        <div class="space-y-8 lg:pl-16">
          <UiSelect id="s1" label="Select Component" v-model="selectedStatus" :options="['published', 'draft', 'archived']" />
          <div class="space-y-2">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Search Filter</p>
            <UiSearchFilter v-model:search-term="searchTerm" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. TAGS -->
    <section class="mb-32">
      <UiSectionHeader title="Tags & Status" subtitle="Classification." class="mb-16" />
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="space-y-6">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Status</p>
          <div class="flex flex-wrap gap-3">
            <UiTag status="published" variant="status" shape="rounded">Published</UiTag>
            <UiTag status="interview" variant="status" shape="rounded">Interview</UiTag>
            <UiTag status="rejected" variant="status" shape="rounded">Rejected</UiTag>
          </div>
        </div>
        <div class="space-y-6 md:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Variants</p>
          <div class="flex flex-wrap gap-3">
            <UiTag variant="glow">Glow</UiTag>
            <UiTag variant="outline">Outline</UiTag>
            <UiTag variant="fill" color="primary">Primary</UiTag>
          </div>
        </div>
        <div class="space-y-6 lg:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Chips</p>
          <div class="flex flex-wrap gap-3">
            <UiChip closable @close="() => {}">Entity Chip</UiChip>
            <UiChip variant="gradient">Special</UiChip>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FEEDBACK -->
    <section class="mb-32">
      <UiSectionHeader title="Feedback" subtitle="Alerts and Modals." class="mb-16" />
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="space-y-4">
          <UiAlert variant="info" title="Info">This is an information.</UiAlert>
          <UiAlert variant="warning" title="Warning">Please be careful.</UiAlert>
          <UiAlert variant="error" title="Error">Something went wrong.</UiAlert>
        </div>
        <div class="flex flex-wrap gap-4 items-start lg:pl-16 pt-4">
          <UiButton size="sm" @click="triggerToast('success')">Success Toast</UiButton>
          <UiButton size="sm" variant="danger" @click="triggerToast('error')">Error Toast</UiButton>
          <UiButton size="sm" variant="secondary" @click="showDemoModal = true">Open Modal</UiButton>
        </div>
      </div>
      <UiModal v-model="showDemoModal">
        <template #header><h3 class="text-2xl font-black">System Modal</h3></template>
        <template #body><p>Demonstration of the global modal component.</p></template>
        <template #footer><UiButton @click="showDemoModal = false">Close</UiButton></template>
      </UiModal>
    </section>

    <!-- 6. CONTENT -->
    <section class="mb-32">
      <UiSectionHeader title="Content Tools" subtitle="Rich text." class="mb-16" />
      <div class="space-y-16">
        <div class="space-y-6">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Content Editor</p>
          <UiContentEditor v-model="editorContent" />
        </div>
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div class="space-y-6">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Markdown</p>
            <div class="rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <BaseMarkdown content="**Bold**, *italic*, and [links](https://google.com) work here." />
            </div>
          </div>
          <div class="space-y-6 lg:pl-16">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Timeline</p>
            <UiTimeline :items="demoTimeline" />
          </div>
        </div>
      </div>
    </section>

    <!-- 7. DISPLAY -->
    <section class="mb-32">
      <UiSectionHeader title="Display Components" subtitle="Frontend cards." class="mb-16" />
      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div class="space-y-12">
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Project Card</p>
            <ProjectCard :project="(mockProject as any)" />
          </div>
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Blog Card</p>
            <BlogPostCard :post="(mockPost as any)" />
          </div>
        </div>
        <div class="space-y-12 lg:pl-16">
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Application Card</p>
            <ApplicationCard :application="(mockApplication as any)" />
          </div>
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Status & Social</p>
            <div class="flex items-center justify-between rounded-2xl border border-neutral-100 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
              <div class="flex items-center gap-3">
                <span class="text-sm font-bold text-neutral-500">Status:</span>
                <NowIndicator />
              </div>
              <SocialLinks />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. NAVIGATION & UTILS -->
    <section class="mb-32 pb-32">
      <UiSectionHeader title="Navigation & Utils" subtitle="Utility components." class="mb-16" />
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Image Uploader</p>
          <UiImageUploader label="Upload Image" />
        </div>
        <div class="space-y-4 md:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Back Actions</p>
          <UiBackButton />
        </div>
        <div class="space-y-4 lg:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Locale Switcher</p>
          <StudioLocaleSwitcher model-value="en" @update:model-value="() => {}" />
        </div>
      </div>
    </section>

  </div>
</template>
