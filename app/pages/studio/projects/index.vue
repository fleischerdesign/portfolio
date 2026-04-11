<script setup lang="ts">
import { ref, computed } from "vue";
import type { ProjectStudioResponse } from "#shared/schemas/project.schema";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
  layout: "default",
});

const { locale } = useI18n();
const { data } = await useFetch<{ projects: ProjectStudioResponse[] }>("/api/studio/projects");

const projects = computed(() => data.value?.projects || []);

const searchTerm = ref("");
const statusFilter = ref("all");

const filteredProjects = computed(() => {
  let result = projects.value;

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter((project) => {
      return project.translations.some(
        (trans) =>
          trans.title.toLowerCase().includes(term) ||
          trans.slug.toLowerCase().includes(term),
      );
    });
  }

  if (statusFilter.value !== "all") {
    result = result.filter((project) => project.status === statusFilter.value);
  }

  return result;
});

function getTitle(project: ProjectStudioResponse) {
  const trans =
    project.translations.find((t) => t.locale === locale.value) ||
    project.translations.find((t) => t.locale === "en") ||
    project.translations[0];
  return trans?.title || "Untitled";
}
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-24 space-y-8">
      <UiSectionHeader
        :level="1"
        symbol="mage:folder"
        :title="$t('navigation.project_editor')"
        subtitle="Showcase your work."
      />

      <UiSearchFilter
        v-model:search-term="searchTerm"
        v-model:status-filter="statusFilter"
        :new-label="$t('studio.projects.new')"
        :new-route="$localePath('/studio/projects/new')"
        search-id="search-projects"
      />

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UiCard
          v-for="project in filteredProjects"
          :key="project.id"
          interactive
          class="group flex h-full flex-col transition-all duration-300 hover:border-secondary-500/30 hover:shadow-lg"
        >
          <NuxtLink
            :to="$localePath(`/studio/projects/${project.id}`)"
            class="flex h-full flex-col"
          >
            <div
              v-if="project.coverImage"
              class="relative h-48 w-full overflow-hidden border-b border-neutral-100 dark:border-neutral-800"
            >
              <NuxtImg
                :src="project.coverImage"
                sizes="500px"
                class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent"
              ></div>
              <div
                class="absolute bottom-4 left-4 right-4 flex items-end justify-between"
              >
                <UiTag :status="project.status" shape="rounded" variant="status" />
              </div>
            </div>
            <div
              v-else
              class="h-2 bg-gradient-to-r from-secondary-500 to-emerald-400"
            ></div>

            <UiCardContainer class="flex flex-1 flex-col p-6">
              <div v-if="!project.coverImage" class="mb-4">
                <UiTag :status="project.status" shape="rounded" variant="status" />
              </div>

              <h3
                class="mb-2 line-clamp-2 text-xl font-bold text-neutral-900 transition-colors group-hover:text-secondary-600 dark:text-white"
              >
                {{ getTitle(project) }}
              </h3>

              <div
                class="mt-auto flex items-center justify-between border-t border-neutral-100 pt-4 text-xs text-neutral-500 dark:border-neutral-800"
              >
                <span>{{ formatDate(project.createdAt) }}</span>

                <div class="flex gap-1">
                  <span
                    v-for="trans in project.translations"
                    :key="trans.locale"
                    class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] uppercase dark:bg-neutral-800"
                  >
                    {{ trans.locale }}
                  </span>
                </div>
              </div>
            </UiCardContainer>
          </NuxtLink>
        </UiCard>
      </div>

      <div
        v-if="filteredProjects.length === 0"
        class="flex flex-col items-center py-12 text-center text-neutral-500"
      >
        <Icon name="heroicons:folder" class="mb-4 h-12 w-12 opacity-20" />
        <p>{{ $t("studio.projects.empty") }}</p>
      </div>
    </div>
  </div>
</template>
