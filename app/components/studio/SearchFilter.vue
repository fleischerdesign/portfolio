<template>
  <UiCard class="mt-8 border-secondary-500/10 shadow-xl shadow-secondary-500/5">
    <UiCardContainer class="flex flex-col gap-4 p-6 md:flex-row md:items-end">
      <UiInput
        :id="searchId"
        :model-value="searchTerm"
        :placeholder="searchPlaceholderProp"
        class="w-full md:flex-grow"
        @update:model-value="emit('update:searchTerm', $event as string)"
      />
      <div
        class="flex flex-col gap-4 md:flex-shrink-0 md:flex-row md:items-end"
      >
        <UiSelect
          :id="filterId"
          :model-value="statusFilter"
          :options="statusOptions"
          :label="statusLabelProp"
          class="w-full md:w-48"
          @update:model-value="emit('update:statusFilter', $event as string)"
        >
          <template #display="{ option }">
            <slot name="statusDisplay" :option="option">
              <span class="capitalize">{{ option }}</span>
            </slot>
          </template>
          <template #option="{ option }">
            <slot name="statusOption" :option="option">
              <span class="capitalize">{{ option }}</span>
            </slot>
          </template>
        </UiSelect>
        <slot name="actions">
          <NuxtLink :to="newRoute" class="w-full md:w-auto">
            <UiButton variant="secondary" class="w-full justify-center">
              <Icon name="heroicons:plus" class="mr-2 h-5 w-5" />
              {{ newLabel }}
            </UiButton>
          </NuxtLink>
        </slot>
      </div>
    </UiCardContainer>
  </UiCard>
</template>

<script setup lang="ts">
const { t } = useI18n();

interface Props {
  searchTerm: string;
  statusFilter: string;
  searchPlaceholder?: string;
  newLabel?: string;
  newRoute?: string;
  searchId?: string;
  filterId?: string;
  statusOptions?: string[];
  statusLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: "",
  newLabel: "",
  newRoute: "#",
  searchId: "search",
  filterId: "filter-status",
  statusOptions: () => ["all", "published", "draft", "archived"],
  statusLabel: "",
});

const searchPlaceholderProp = computed(
  () => props.searchPlaceholder || t("studio.search.placeholder"),
);

const statusLabelProp = computed(
  () => props.statusLabel || t("studio.search.filter"),
);

const emit = defineEmits<{
  "update:searchTerm": [value: string];
  "update:statusFilter": [value: string];
}>();
</script>
