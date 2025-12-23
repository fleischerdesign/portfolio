<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { applicationApiSchema, type ApplicationApiPayload as Application } from '#shared/schemas/application.schema';

const props = defineProps({
  application: {
    type: Object as () => Application,
    required: true,
  },
});

const emit = defineEmits(['deleted', 'updated']);

const { statusColor, formatDate } = useApplicationUtils();
const isMenuOpen = ref(false);
const showDeleteModal = ref(false);
const showStatusModal = ref(false);
const isDeleting = ref(false);
const isUpdatingStatus = ref(false);
const menu = ref<HTMLElement | null>(null);

const newStatus = ref(props.application.status);
const availableStatuses = applicationApiSchema.shape.status.options;

const handleClickOutside = (event: MouseEvent) => {
  if (menu.value && !menu.value.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

async function deleteApplication() {
  isDeleting.value = true;
  try {
    await useRequestFetch()(`/api/applications/${props.application.slug}`, {
      method: 'DELETE',
    });
    emit('deleted', props.application.id);
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Failed to delete application', error);
  } finally {
    isDeleting.value = false;
  }
}

async function updateApplicationStatus() {
  isUpdatingStatus.value = true;
  try {
    const updatedApplication = await useRequestFetch()(`/api/applications/${props.application.slug}`, {
      method: 'PUT',
      body: { status: newStatus.value },
    });
    console.log('API Response:', updatedApplication);
    emit('updated', updatedApplication);
    showStatusModal.value = false;
  } catch (error) {
    console.error('Failed to update status', error);
  } finally {
    isUpdatingStatus.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  watch(showStatusModal, (newValue) => {
    if (newValue) {
      newStatus.value = props.application.status;
    }
  });
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div>
    <NuxtLink :to="$localePath(`/application/${application.slug}`)" class="group relative">
      <UiCard hover class="h-full flex-col">
        <UiCardContainer class="h-full flex-col">
          <uiButton
            class="absolute right-4 z-20 h-9 w-9 rounded-md !p-1 text-neutral-500 hover:bg-neutral-200 dark:text-neutral-400 dark:hover:bg-neutral-700"
            @click.stop.prevent="isMenuOpen = !isMenuOpen"
          >
            <Icon name="mdi:dots-vertical" class="p-3" />
          </uiButton>

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
                  <button @click="showStatusModal = true" class="flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50">
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
                  <button class="flex w-full items-center gap-3 rounded-md p-2 text-left text-red-500 hover:bg-red-500/10" @click="showDeleteModal = true">
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

    <UiModal v-model="showDeleteModal" title="Bewerbung löschen">
      <template #body>
        <p class="mt-2">Möchten Sie die Bewerbung für "{{ application.title }}" bei "{{ application.company.name }}" wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.</p>
      </template>
      <template #footer>
        <UiButton @click="showDeleteModal = false">Abbrechen</UiButton>
        <UiButton variant="danger" :is-loading="isDeleting" @click="deleteApplication">
          Löschen
        </UiButton>
      </template>
    </UiModal>

    <UiModal v-model="showStatusModal" title="Status ändern">
      <template #body>
        <p class="mt-2">Wählen Sie einen neuen Status für die Bewerbung bei "{{ application.company.name }}".</p>
        <fieldset class="mt-4">
          <legend class="sr-only">
            Application Status
          </legend>
          <div class="space-y-2">
            <label
              v-for="status in availableStatuses"
              :key="status"
              :for="`status_${status}`"
              class="relative flex cursor-pointer items-center gap-3 rounded-lg border p-3 shadow-sm transition hover:bg-secondary-500/20 hover:border-secondary-300 dark:hover:border-secondary-700"
              :class="[
                newStatus === status ? 'border-secondary-400 ring-2 ring-secondary-400 bg-secondary-100 dark:border-secondary-600 dark:ring-secondary-600 dark:bg-secondary-800' : 'border-neutral-300 dark:border-neutral-700'
              ]"
            >
              <input
                :id="`status_${status}`"
                type="radio"
                :value="status"
                v-model="newStatus"
                name="application_status"
                class="sr-only"
              >
              <span class="flex flex-1 items-center gap-3">
                <Icon name="mdi:circle" class="h-4 w-4" :class="statusColor(status)" />
                <span class="font-medium">{{ status }}</span>
              </span>
            </label>
          </div>
        </fieldset>
      </template>
      <template #footer>
        <UiButton @click="showStatusModal = false">Abbrechen</UiButton>
        <UiButton :is-loading="isUpdatingStatus" @click="updateApplicationStatus">
          Speichern
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
