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
      <UiQuickStat
        icon="heroicons:signal"
        :label="$t('applications.detail.document.current_status')"
      >
        <template #value>
          <UiTag
            :status="application.currentStatus"
            shape="rounded"
            variant="status"
            size="md"
          >
            {{ $t(`applications.status.${application.currentStatus}`) }}
          </UiTag>
        </template>
      </UiQuickStat>

      <!-- Company -->
      <UiQuickStat
        class="border-t border-primary-100 pt-6 lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-primary-800"
        icon="heroicons:building-office"
        :label="$t('applications.detail.config.company')"
        :value="application.company.name"
      >
        <template #footer v-if="application.company.address">
          {{ application.company.address.city }}
        </template>
      </UiQuickStat>

      <!-- Activity -->
      <UiQuickStat
        class="border-t border-primary-100 pt-6 lg:w-auto lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-primary-800"
        icon="heroicons:clock"
        :label="$t('applications.detail.document.activity')"
        :value="getFormattedLastActivityDate(application)"
      >
        <template #footer>
          {{
            application.currentStatus === "draft"
              ? $t("applications.detail.document.created_at")
              : $t("applications.detail.document.applied_at")
          }}
          {{ getDisplayDate(application) }}
        </template>
      </UiQuickStat>

      <!-- Listing Link -->
      <div
        v-if="application.url"
        class="w-full border-t border-primary-100 pt-6 lg:ml-auto lg:w-auto lg:border-t-0 lg:pt-0 dark:border-primary-800"
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
