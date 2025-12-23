<script setup lang="ts">

defineProps({
  application: {
    type: Object as () => Application,
    required: true,
  },
});

const { statusColor, formatDate } = useApplicationUtils();
const isMenuOpen = ref(false);
const menu = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (menu.value && !menu.value.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <NuxtLink :to="$localePath(`/application/${application.slug}`)" class="group relative">
    <UiCard hover class="h-full flex-col">
      <UiCardContainer class="h-full flex-col">
        <!-- Kebab Menu Button -->
        <uiButton
          class="absolute right-4 z-20 h-9 w-9 rounded-md !p-1 text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
          @click.stop.prevent="isMenuOpen = !isMenuOpen"
        >
          <Icon name="mdi:dots-vertical" class="p-3" />
        </uiButton>

        <!-- Kebab Menu Dropdown -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="isMenuOpen"
            ref="menu"
            class="absolute right-4 top-12 z-50 w-48 origin-top-right rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 px-3 py-2 text-neutral-950 shadow-lg backdrop-blur-md dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:text-white"
            @click.stop.prevent
          >
            <ul class="flex flex-col gap-1">
              <li>
                <button class="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50">
                  <Icon name="mdi:pencil" class="h-5 w-5" />
                  <span>Bearbeiten</span>
                </button>
              </li>
              <li>
                <button class="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50">
                  <Icon name="mdi:tag-multiple" class="h-5 w-5" />
                  <span>Status ändern</span>
                </button>
              </li>
              <li>
                <button class="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50">
                  <Icon name="mdi:share-variant" class="h-5 w-5" />
                  <span>Teilen</span>
                </button>
              </li>
              <li>
                <button class="flex w-full items-center gap-3 rounded-md p-2 text-left text-red-500 hover:bg-red-500/10">
                  <Icon name="mdi:delete" class="h-5 w-5" />
                  <span>Entfernen</span>
                </button>
              </li>
            </ul>
          </div>
        </Transition>
        
        <div class="flex-grow">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white">{{ application.company.name }}</h2>
          </div>
          <p class="mt-2 text-neutral-600 dark:text-neutral-300">{{ application.title }}</p>
        </div>

        <div class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
          <span>Bewerbung vom: {{ formatDate(application.applicationDate) }}</span>
          <span class="flex items-center gap-1">
            <Icon name="mdi:circle" class="h-3 w-3" :class="statusColor(application.status)" />
            <span>{{ application.status }}</span>
          </span>
        </div>
      </UiCardContainer>
    </UiCard>
  </NuxtLink>
</template>
