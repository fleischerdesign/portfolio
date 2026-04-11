<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";

const props = defineProps({
  application: {
    type: Object as () => ApplicationResponsePayload,
    required: true,
  },
});

const emit = defineEmits(["deleted", "refresh"]);

const { t } = useI18n();
const { getFormattedLastActivityDate } = useApplicationUtils();
const localePath = useLocalePath();
const { showToast } = useToast();

const isMenuOpen = ref(false);
const showDeleteModal = ref(false);
const isDeleting = ref(false);
const menu = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (menu.value && !menu.value.contains(event.target as Node)) {
    isMenuOpen.value = false;
  }
};

async function shareApplication() {
  const url = new URL(window.location.origin);
  url.pathname = localePath({
    path: `/studio/applications/${props.application.slug}`,
  });
  const shareData = {
    title: t("applications.card.share_title", {
      title: props.application.title,
    }),
    text: t("applications.card.share_text", {
      title: props.application.title,
      company: props.application.company.name,
    }),
    url: url.toString(),
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showToast(t("applications.card.share_success"), { type: "success" });
    } else {
      throw new Error("Web Share API not supported");
    }
  } catch (err) {
    console.log("Could not share, falling back to clipboard. Reason:", err);
    try {
      await navigator.clipboard.writeText(shareData.url);
      showToast(t("applications.card.copy_success"), { type: "success" });
    } catch (clipErr) {
      showToast(t("applications.card.copy_error"), { type: "error" });
      console.error("Failed to copy URL to clipboard", clipErr);
    }
  } finally {
    isMenuOpen.value = false;
  }
}

async function deleteApplication() {
  isDeleting.value = true;
  try {
    await useRequestFetch()(`/api/applications/${props.application.slug}`, {
      method: "DELETE",
    });
    showToast(t("applications.card.delete_success"), { type: "success" });
    emit("deleted", props.application.id);
    showDeleteModal.value = false;
  } catch (error) {
    showToast(t("applications.card.delete_error"), { type: "error" });
    console.error("Failed to delete application", error);
  } finally {
    isDeleting.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div>
    <NuxtLink
      :to="$localePath(`/studio/applications/${application.slug}`)"
      class="group relative"
    >
      <UiCard interactive class="h-full">
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
              class="absolute right-4 top-12 z-50 w-48 origin-top-right rounded-xl border border-neutral-200/60 bg-white/80 px-2 py-2 text-neutral-900 shadow-xl backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/80 dark:text-white"
              @click.stop.prevent
            >
              <ul class="flex flex-col gap-1">
                <li>
                  <NuxtLink
                    :to="
                      $localePath({
                        path: `/studio/applications/${application.slug}`,
                        query: { edit: 'true' },
                      })
                    "
                    class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-medium transition-colors hover:bg-secondary-50 hover:text-secondary-700 dark:hover:bg-secondary-900/20 dark:hover:text-secondary-400"
                  >
                    <Icon name="mdi:pencil" class="h-4 w-4" />
                    <span>{{ $t("applications.card.edit") }}</span>
                  </NuxtLink>
                </li>
                <li>
                  <button
                    class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-medium transition-colors hover:bg-secondary-50 hover:text-secondary-700 dark:hover:bg-secondary-900/20 dark:hover:text-secondary-400"
                    @click="shareApplication"
                  >
                    <Icon name="mdi:share-variant" class="h-4 w-4" />
                    <span>{{ $t("applications.card.share") }}</span>
                  </button>
                </li>
                <li>
                  <button
                    class="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                    @click="showDeleteModal = true"
                  >
                    <Icon name="mdi:delete" class="h-4 w-4" />
                    <span>{{ $t("applications.card.delete") }}</span>
                  </button>
                </li>
              </ul>
            </div>
          </Transition>

          <div class="flex-grow">
            <div class="flex items-center justify-between">
              <h2
                class="text-xl font-semibold text-neutral-900 dark:text-white"
              >
                {{ application.company.name }}
              </h2>
            </div>
            <p class="mt-2 text-neutral-600 dark:text-neutral-300">
              {{ application.title }}
            </p>
          </div>

          <div
            class="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400"
          >
            <span
              >{{ $t("applications.card.last_activity") }}:
              {{ getFormattedLastActivityDate(application) }}</span
            >
            <UiStatusBadge
              :status="application.currentStatus"
              size="md"
              :capitalize="false"
            >
              {{ $t(`applications.status.${application.currentStatus}`) }}
            </UiStatusBadge>
          </div>
        </UiCardContainer>
      </UiCard>
    </NuxtLink>

    <UiModal v-model="showDeleteModal">
      <template #header>
        <h3 class="text-2xl font-black">
          {{ $t("applications.card.delete_confirm_title") }}
        </h3>
      </template>
      <template #body>
        <p class="mt-2">
          {{
            $t("applications.card.delete_confirm_text", {
              title: application.title,
              company: application.company.name,
            })
          }}
        </p>
      </template>
      <template #footer>
        <UiButton @click="showDeleteModal = false">{{
          $t("applications.detail.actions.cancel")
        }}</UiButton>
        <UiButton
          variant="danger"
          :is-loading="isDeleting"
          @click="deleteApplication"
        >
          {{ $t("applications.card.delete") }}
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
