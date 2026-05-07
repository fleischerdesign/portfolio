<template>
  <div
    class="mt-8 flex flex-col gap-3 rounded-2xl border border-secondary-500/10 bg-white/50 p-4 shadow-xl shadow-secondary-500/5 backdrop-blur-sm md:flex-row md:items-center md:gap-4 md:p-4 dark:bg-primary-900/50"
  >
    <div class="relative flex-1">
      <UiInput
        :id="searchId"
        v-model="modelSearchTerm"
        :placeholder="searchPlaceholderProp"
        class="flex-1"
      >
        <template #prefix>
          <Icon
            name="heroicons:magnifying-glass"
            class="h-5 w-5 text-primary-400"
          />
        </template>
        <template #suffix>
          <button
            v-if="searchTerm"
            type="button"
            class="flex h-6 w-6 items-center justify-center rounded-full text-primary-400 transition-colors hover:bg-primary-200 hover:text-primary-600 dark:hover:bg-primary-700"
            @click="emit('update:searchTerm', '')"
          >
            <Icon name="heroicons:x-mark" class="h-4 w-4" />
          </button>
        </template>
      </UiInput>
    </div>

    <UiSelect
      v-if="showFilter"
      :id="filterId"
      :model-value="statusFilter"
      :options="statusOptions"
      class="w-36 shrink-0"
      @update:model-value="emit('update:statusFilter', $event as string)"
    >
      <template #display="{ option }">
        <slot name="statusDisplay" :option="option">
          <Icon name="heroicons:funnel" class="mr-2 h-4 w-4" />
          <span class="capitalize">{{ option }}</span>
        </slot>
      </template>
      <template #option="{ option }">
        <slot name="statusOption" :option="option">
          <span class="capitalize">{{ option }}</span>
        </slot>
      </template>
    </UiSelect>

    <NuxtLink
      v-if="newRoute"
      :to="newRoute"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-500 text-white transition-colors hover:bg-secondary-600 md:w-auto md:px-4"
    >
      <Icon name="heroicons:plus" class="h-5 w-5" />
      <span v-if="newLabel" class="hidden md:ml-2 md:inline">{{
        newLabel
      }}</span>
    </NuxtLink>

    <button
      v-else-if="newLabel"
      type="button"
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-500 text-white transition-colors hover:bg-secondary-600 md:w-auto md:px-4"
      @click="emit('click:new')"
    >
      <Icon name="heroicons:plus" class="h-5 w-5" />
      <span v-if="newLabel" class="hidden md:ml-2 md:inline">{{
        newLabel
      }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

interface Props {
  searchTerm: string;
  statusFilter?: string;
  searchPlaceholder?: string;
  newLabel?: string;
  newRoute?: string;
  searchId?: string;
  filterId?: string;
  statusOptions?: string[];
  showFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  statusFilter: "",
  searchPlaceholder: "",
  newLabel: "",
  newRoute: "",
  searchId: "search",
  filterId: "filter-status",
  statusOptions: () => ["all", "published", "draft", "archived"],
  showFilter: true,
});

const emit = defineEmits<{
  "update:searchTerm": [value: string];
  "update:statusFilter": [value: string];
  "click:new": [];
}>();

const modelSearchTerm = computed({
  get: () => props.searchTerm,
  set: (val) => emit("update:searchTerm", val),
});

const searchPlaceholderProp = computed(
  () => props.searchPlaceholder || t("studio.search.placeholder") || "Suchen...",
);
</script>
