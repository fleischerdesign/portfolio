<script setup lang="ts">
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";

defineProps<{
  application: ApplicationResponsePayload;
}>();

const { getFormattedLastActivityDate, getDisplayDate } = useApplicationUtils();
</script>

<template>
  <UiCard class="mb-12 border-secondary-500/10 shadow-xl shadow-secondary-500/5">
    <UiCardContainer
      class="flex flex-col justify-between gap-6 px-8 py-6 lg:flex-row lg:items-center lg:gap-8"
    >
      <!-- Status -->
      <div class="flex w-full items-center gap-5 lg:w-auto">
        <div
          class="flex h-14 w-14 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
        >
          <Icon name="heroicons:signal" size="28" />
        </div>
        <div>
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
          >
            {{ $t("applications.detail.document.current_status") }}
          </p>
          <div class="mt-1">
            <UiStatusBadge
              :status="application.currentStatus"
              size="md"
              :capitalize="false"
            >
              {{ $t(`applications.status.${application.currentStatus}`) }}
            </UiStatusBadge>
          </div>
        </div>
      </div>

      <!-- Company -->
      <div
        class="flex w-full items-center gap-5 border-t border-neutral-100 pt-6 lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800"
      >
        <div
          class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
        >
          <Icon name="heroicons:building-office" size="28" />
        </div>
        <div class="min-w-0 flex-1">
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
          >
            {{ $t("applications.detail.config.company") }}
          </p>
          <p
            class="mt-0.5 truncate text-xl font-bold text-neutral-900 dark:text-white"
            :title="application.company.name"
          >
            {{ application.company.name }}
          </p>
          <p
            v-if="application.company.address"
            class="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400"
          >
            {{ application.company.address.city }}
          </p>
        </div>
      </div>

      <!-- Activity -->
      <div
        class="flex w-full items-center gap-5 border-t border-neutral-100 pt-6 lg:w-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800"
      >
        <div
          class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
        >
          <Icon name="heroicons:clock" size="28" />
        </div>
        <div>
          <p
            class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
          >
            {{ $t("applications.detail.document.activity") }}
          </p>
          <p
            class="mt-0.5 text-xl font-bold text-neutral-900 dark:text-white"
          >
            {{ getFormattedLastActivityDate(application) }}
          </p>
          <p
            class="whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400"
          >
            {{
              application.currentStatus === "draft"
                ? $t("applications.detail.document.created_at")
                : $t("applications.detail.document.applied_at")
            }}
            {{ getDisplayDate(application) }}
          </p>
        </div>
      </div>

      <!-- Listing Link -->
      <div
        v-if="application.url"
        class="w-full border-t border-neutral-100 pt-6 lg:ml-auto lg:w-auto lg:border-t-0 lg:pt-0 dark:border-neutral-800"
      >
        <a :href="application.url" target="_blank" rel="noopener noreferrer">
          <UiButton
            variant="glass"
            size="lg"
            class="group w-full !rounded-2xl border-secondary-200/50 transition-all duration-500 hover:bg-secondary-500 hover:text-white lg:w-auto"
          >
            <span class="inline lg:hidden xl:inline">{{
              $t("applications.detail.document.listing")
            }}</span>
            <Icon
              name="heroicons:arrow-top-right-on-square"
              class="ml-3 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 lg:ml-0 xl:ml-3"
            />
          </UiButton>
        </a>
      </div>
    </UiCardContainer>
  </UiCard>
</template>
