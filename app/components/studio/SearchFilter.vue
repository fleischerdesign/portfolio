<template>
  <div
    class="mt-8 flex flex-col gap-3 rounded-2xl border border-secondary-500/10 bg-white/50 p-4 shadow-xl shadow-secondary-500/5 backdrop-blur-sm dark:bg-neutral-900/50 md:flex-row md:items-center md:gap-4 md:p-4"
  >
    <div class="relative flex-1">
      <Icon
        name="heroicons:magnifying-glass"
        class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
      />
      <input
        :id="searchId"
        :value="searchTerm"
        type="text"
        :placeholder="searchPlaceholderProp"
        class="w-full rounded-lg border-none bg-neutral-100 py-2.5 pl-10 pr-8 text-sm outline-none transition-all placeholder:text-neutral-400 focus:bg-neutral-100/50 focus:ring-2 focus:ring-secondary-500/20 dark:bg-neutral-800 dark:focus:bg-neutral-800/50"
        @input="
          emit('update:searchTerm', ($event.target as HTMLInputElement).value)
        "
      />
      <button
        v-if="searchTerm"
        type="button"
        class="absolute right-2 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700"
        @click="emit('update:searchTerm', '')"
      >
        <Icon name="heroicons:x-mark" class="h-4 w-4" />
      </button>
    </div>

    <UiSelect
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
  statusFilter: string;
  searchPlaceholder?: string;
  newLabel?: string;
  newRoute?: string;
  searchId?: string;
  filterId?: string;
  statusOptions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: "",
  newLabel: "",
  newRoute: "#",
  searchId: "search",
  filterId: "filter-status",
  statusOptions: () => ["all", "published", "draft", "archived"],
});

const searchPlaceholderProp = computed(
  () => props.searchPlaceholder || t("studio.search.placeholder"),
);

const emit = defineEmits<{
  "update:searchTerm": [value: string];
  "update:statusFilter": [value: string];
  "click:new": [];
}>();
</script>
