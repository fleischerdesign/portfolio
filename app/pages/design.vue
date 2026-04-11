<script setup lang="ts">
definePageMeta({
  title: 'Design System',
});

const categories = [
  { id: 'buttons', name: 'Buttons', icon: 'heroicons:cursor-arrow-rays' },
  { id: 'cards', name: 'Cards', icon: 'heroicons:square-2-stack' },
  { id: 'forms', name: 'Forms', icon: 'heroicons:pencil-square' },
  { id: 'tags', name: 'Tags', icon: 'heroicons:tag' },
  { id: 'stats', name: 'Stats', icon: 'heroicons:chart-bar' },
];

// Demo states
const isLoading = ref(false);
const searchTerm = ref('');
const selectedStatus = ref('published');
const inputText = ref('Sample text');
const inputError = ref('This field is required');

function toggleLoading() {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 2000);
}
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-32 pt-32 md:px-8 lg:pt-44">
    
    <!-- Hero Section -->
    <section class="mb-32">
      <UiSectionHeader
        symbol="heroicons:paint-brush"
        title="Design System"
        subtitle="Visual language and component reference for the portfolio."
      />
    </section>

    <!-- Local Navigation -->
    <section class="mb-32">
      <div class="flex flex-wrap gap-4">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.id"
          :to="`#${cat.id}`"
          class="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-bold text-neutral-600 transition-all hover:border-secondary-500 hover:text-secondary-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-secondary-400"
        >
          <Icon :name="cat.icon" size="18" />
          {{ cat.name }}
        </NuxtLink>
      </div>
    </section>

    <!-- 1. BUTTONS -->
    <section id="buttons" class="mb-32 scroll-mt-32">
      <UiSectionHeader 
        title="Buttons" 
        subtitle="Trigger actions with consistent visual feedback." 
        class="mb-16"
      />

      <div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-6">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Variants</p>
          <div class="flex flex-wrap items-center gap-4">
            <UiButton>Default</UiButton>
            <UiButton variant="secondary">Secondary</UiButton>
            <UiButton variant="glass">Glass</UiButton>
            <UiButton variant="danger">Danger</UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
            <UiButton variant="link">Link</UiButton>
          </div>
        </div>

        <div class="space-y-6 md:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Sizes</p>
          <div class="flex flex-wrap items-center gap-4">
            <UiButton size="sm">Small</UiButton>
            <UiButton size="md">Medium</UiButton>
            <UiButton size="lg">Large</UiButton>
            <UiButton size="icon"><Icon name="heroicons:plus" /></UiButton>
          </div>
        </div>

        <div class="space-y-6 lg:pl-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Interactive States</p>
          <div class="flex flex-wrap items-center gap-4">
            <UiButton :is-loading="isLoading" @click="toggleLoading">Toggle Loading</UiButton>
            <UiButton disabled>Disabled</UiButton>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. CARDS -->
    <section id="cards" class="mb-32 scroll-mt-32">
      <UiSectionHeader 
        title="Cards & Elevation" 
        subtitle="Surface containers for different content depths." 
        class="mb-16"
      />

      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500 text-center">shadow-sm</p>
          <UiCard shadow="sm">
            <UiCardContainer class="p-10 text-center">
              <h3 class="text-xl font-bold text-neutral-900 dark:text-white">Standard Card</h3>
              <p class="mt-2 text-neutral-500">Used for basic content grouping.</p>
            </UiCardContainer>
          </UiCard>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500 text-center">hover-shadow</p>
          <UiCard hover shadow="sm">
            <UiCardContainer class="p-10 text-center">
              <h3 class="text-xl font-bold text-neutral-900 dark:text-white">Interactive Card</h3>
              <p class="mt-2 text-neutral-500">Elevates slightly on hover.</p>
            </UiCardContainer>
          </UiCard>
        </div>

        <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500 text-center">shadow-accent</p>
          <UiCard shadow="accent">
            <UiCardContainer class="p-10 text-center">
              <h3 class="text-xl font-bold text-secondary-600">Brand Depth</h3>
              <p class="mt-2 text-neutral-500">Utilizes the emerald glow shadow.</p>
            </UiCardContainer>
          </UiCard>
        </div>
      </div>
    </section>

    <!-- 3. FORMS -->
    <section id="forms" class="mb-32 scroll-mt-32">
      <UiSectionHeader 
        title="Form Elements" 
        subtitle="Input types and validation feedback states." 
        class="mb-16"
      />

      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div class="space-y-10">
          <UiInput id="lab-1" label="Standard Input" placeholder="Search..." v-model="inputText" />
          <UiInput id="lab-2" label="Input with Prefix Icon">
            <template #prefix>
              <Icon name="heroicons:magnifying-glass" size="18" />
            </template>
          </UiInput>
          <UiInput id="lab-3" label="Validation State" :error="inputError" has-error />
        </div>
        <div class="space-y-10 lg:pl-16">
          <UiSelect
            id="lab-select"
            label="Select Dropdown"
            v-model="selectedStatus"
            :options="['published', 'draft', 'archived']"
          />
          <div class="space-y-4">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Search Filter Component</p>
            <UiSearchFilter v-model:search-term="searchTerm" />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. TAGS -->
    <section id="tags" class="mb-32 scroll-mt-32">
      <UiSectionHeader 
        title="Tags & Chips" 
        subtitle="Status indicators and metadata classification." 
        class="mb-16"
      />

      <div class="grid gap-16 md:grid-cols-2">
        <div class="space-y-8">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Status Badges</p>
          <div class="flex flex-wrap gap-3">
            <UiTag status="published" variant="status" shape="rounded">Published</UiTag>
            <UiTag status="draft" variant="status" shape="rounded">Draft</UiTag>
            <UiTag status="interview" variant="status" shape="rounded">Interview</UiTag>
            <UiTag status="rejected" variant="status" shape="rounded">Rejected</UiTag>
          </div>
        </div>
        <div class="space-y-8 md:pl-16">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Tag Variants</p>
          <div class="flex flex-wrap gap-3">
            <UiTag variant="glow">Vue.js</UiTag>
            <UiTag variant="outline">Tailwind</UiTag>
            <UiTag variant="fill" color="primary">Nuxt 4</UiTag>
            <UiTag interactive>Interactive Tag</UiTag>
          </div>
        </div>
        <div class="col-span-1 space-y-8 md:col-span-2">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500 text-center">Interactive Chips</p>
          <div class="flex justify-center flex-wrap gap-4">
            <UiChip>Standard Entity</UiChip>
            <UiChip closable @close="() => {}">Removable Chip</UiChip>
            <UiChip variant="gradient" size="lg">Premium/Special</UiChip>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. STATS -->
    <section id="stats" class="mb-32 scroll-mt-32">
      <UiSectionHeader 
        title="Data Visualization" 
        subtitle="Simple metrics and statistical representations." 
        class="mb-16"
      />

      <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div class="space-y-10">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Stacked Metric Layout</p>
          <div class="grid grid-cols-2 gap-6">
            <UiQuickStat icon="heroicons:signal" label="Current Status" value="Interview" />
            <UiQuickStat icon="heroicons:building-office" label="Company" value="Tech Corp" />
          </div>
        </div>
        <div class="space-y-10 lg:pl-16">
          <p class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500">Inline Metric Layout</p>
          <div class="flex flex-col gap-4">
            <UiQuickStat layout="inline" icon="mdi:coffee" label="Coffee consumed" value="1,234" />
            <UiQuickStat layout="inline" icon="mdi:code-tags" label="Lines of code" value="85,000" />
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
