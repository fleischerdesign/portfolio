<script setup lang="ts">
import { useProjectEditor } from "~/composables/useProjectEditor";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
  layout: "default",
});

const route = useRoute();

const projectId = parseInt(route.params.id as string);
const { data, refresh } = await useFetch(`/api/studio/projects/${projectId}`);

const {
  isEditing,
  isLoading,
  currentLocale,
  editableData: editableProject,
  startEditing,
  cancelEditing,
  save,
} = useProjectEditor(projectId, data, refresh);

const project = computed(() => data.value?.project);

const viewTranslation = computed(() => {
  if (!project.value) return null;
  return (
    project.value.translations.find(
      (t: { locale: string }) => t.locale === currentLocale.value,
    ) ||
    project.value.translations.find(
      (t: { locale: string }) => t.locale === "en",
    ) ||
    project.value.translations[0]
  );
});

const currentBody = computed(() => {
  if (isEditing.value && editableProject.value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (editableProject.value as any)[currentLocale.value].body;
  }
  return viewTranslation.value?.body || "";
});
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-12 flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <UiBackButton :to="$localePath('/studio/projects')" />
      </div>

      <UiSectionHeader
        v-if="project && viewTranslation && !isEditing"
        :level="1"
        :title="viewTranslation.title"
        :subtitle="viewTranslation.subtitle || ''"
        symbol="mage:folder"
      />
      <UiSectionHeader
        v-else-if="isEditing && editableProject"
        :level="1"
        :title="
          (editableProject as any)[currentLocale].title || 'Editing Project'
        "
        subtitle="Showcase your work."
        symbol="mage:folder"
      />
    </div>

    <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-4">
      <div class="space-y-12 lg:col-span-3">
        <!-- View Mode Content -->
        <div v-if="!isEditing && project && viewTranslation" class="space-y-12">
          <div
            v-if="project.coverImage"
            class="group relative aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-100 shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900"
          >
            <NuxtImg
              :src="project.coverImage"
              sizes="100vw lg:1000px"
              class="h-full w-full object-cover"
            />
          </div>

          <BaseMarkdown :content="currentBody" />

          <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            <UiCard v-if="viewTranslation.features?.length" class="p-6">
              <h3 class="mb-4 text-lg font-bold">Features</h3>
              <ul
                class="list-disc space-y-1 pl-4 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <li v-for="item in viewTranslation.features" :key="item">
                  {{ item }}
                </li>
              </ul>
            </UiCard>
            <UiCard v-if="viewTranslation.learned?.length" class="p-6">
              <h3 class="mb-4 text-lg font-bold">Learned</h3>
              <ul
                class="list-disc space-y-1 pl-4 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <li v-for="item in viewTranslation.learned" :key="item">
                  {{ item }}
                </li>
              </ul>
            </UiCard>
            <UiCard v-if="viewTranslation.challenges?.length" class="p-6">
              <h3 class="mb-4 text-lg font-bold">Challenges</h3>
              <ul
                class="list-disc space-y-1 pl-4 text-sm text-neutral-600 dark:text-neutral-400"
              >
                <li v-for="item in viewTranslation.challenges" :key="item">
                  {{ item }}
                </li>
              </ul>
            </UiCard>
          </div>
        </div>

        <!-- Edit Mode Content -->
        <div v-else-if="isEditing && editableProject" class="space-y-8">
          <UiCard>
            <UiCardContainer class="space-y-6 p-8">
              <UiInput
                id="project-title"
                v-model="(editableProject as any)[currentLocale].title"
                label="Title"
                class="text-xl font-bold"
              />
              <UiInput
                id="project-slug"
                v-model="(editableProject as any)[currentLocale].slug"
                label="Slug"
                class="font-mono text-sm"
              />
              <UiInput
                id="project-subtitle"
                v-model="(editableProject as any)[currentLocale].subtitle"
                label="Subtitle"
                as="textarea"
                rows="2"
              />

              <div
                class="border-t border-neutral-100 pt-4 dark:border-neutral-800"
              >
                <UiImageUploader
                  v-model="(editableProject as any).common.coverImage"
                  label="Cover Image"
                  helper-text="Upload a representative cover image."
                />

                <UiInput
                  id="project-image-alt"
                  v-model="(editableProject as any).common.coverImageAlt"
                  label="Alt Text"
                  class="mt-4"
                />
              </div>
            </UiCardContainer>
          </UiCard>

          <div class="grid h-[600px] grid-cols-1 gap-4 md:grid-cols-2">
            <UiCard class="flex h-full flex-col overflow-hidden">
              <div
                class="border-b border-neutral-200 bg-neutral-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50"
              >
                Markdown
              </div>
              <textarea
                v-model="(editableProject as any)[currentLocale].body"
                class="w-full flex-1 resize-none border-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:ring-0"
              ></textarea>
            </UiCard>
            <UiCard
              class="flex h-full flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30"
            >
              <BaseMarkdown
                :content="currentBody"
                class="prose-sm flex-1 overflow-y-auto p-4"
              />
            </UiCard>
          </div>

          <UiCard>
            <UiCardContainer class="space-y-6 p-6">
              <h3
                class="text-xs font-bold uppercase tracking-widest text-secondary-500"
              >
                Details (Lists)
              </h3>
              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Features (one per line)</label
                >
                <textarea
                  :value="
                    (editableProject as any)[currentLocale].features.join('\n')
                  "
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  rows="5"
                  @input="
                    (e) =>
                      ((editableProject as any)[currentLocale].features = (
                        e.target as HTMLTextAreaElement
                      ).value
                        .split('\n')
                        .filter(Boolean))
                  "
                ></textarea>
              </div>
              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Learned (one per line)</label
                >
                <textarea
                  :value="
                    (editableProject as any)[currentLocale].learned.join('\n')
                  "
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  rows="5"
                  @input="
                    (e) =>
                      ((editableProject as any)[currentLocale].learned = (
                        e.target as HTMLTextAreaElement
                      ).value
                        .split('\n')
                        .filter(Boolean))
                  "
                ></textarea>
              </div>
              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Challenges (one per line)</label
                >
                <textarea
                  :value="
                    (editableProject as any)[currentLocale].challenges.join(
                      '\n',
                    )
                  "
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  rows="5"
                  @input="
                    (e) =>
                      ((editableProject as any)[currentLocale].challenges = (
                        e.target as HTMLTextAreaElement
                      ).value
                        .split('\n')
                        .filter(Boolean))
                  "
                ></textarea>
              </div>
            </UiCardContainer>
          </UiCard>
        </div>
      </div>

      <aside class="sticky top-24 space-y-6">
        <!-- Control Card -->
        <UiCard
          class="overflow-hidden border-secondary-500/10 shadow-lg shadow-secondary-500/5"
        >
          <UiCardContainer class="space-y-6 p-6">
            <div class="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              <button
                v-for="lang in LOCALES"
                :key="lang"
                class="flex-1 rounded-md px-3 py-2 text-xs font-bold uppercase transition-all"
                :class="
                  currentLocale === lang
                    ? 'bg-white dark:bg-neutral-800 shadow-sm text-secondary-600'
                    : 'text-neutral-500 hover:text-neutral-900'
                "
                @click="currentLocale = lang"
              >
                {{ lang }}
              </button>
            </div>

            <div class="flex flex-col gap-2">
              <template v-if="!isEditing">
                <UiButton
                  class="w-full"
                  variant="secondary"
                  @click="startEditing"
                >
                  <Icon name="heroicons:pencil-square" class="mr-2" /> Edit
                  Project
                </UiButton>
              </template>

              <template v-else>
                <UiButton class="w-full" :is-loading="isLoading" @click="save"
                  >Save Changes</UiButton
                >
                <UiButton class="w-full" variant="ghost" @click="cancelEditing"
                  >Cancel</UiButton
                >
              </template>
            </div>
          </UiCardContainer>
        </UiCard>

        <UiCard v-if="!isEditing && project && viewTranslation" class="p-6">
          <h3
            class="mb-4 text-xs font-bold uppercase tracking-widest text-secondary-500"
          >
            Meta Data
          </h3>
          <div class="space-y-4 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Status</span>
              <div class="flex">
                <UiStatusBadge :status="project.status" />
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Icon</span>
              <div class="flex items-center gap-2">
                <Icon
                  :name="project.icon || 'heroicons:question-mark-circle'"
                  class="h-6 w-6"
                />
                <span class="font-mono text-xs">{{
                  project.icon || "No icon"
                }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Repo URL</span>
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                class="truncate text-secondary-500 hover:underline"
                >{{ project.repoUrl }}</a
              >
              <span v-else class="text-neutral-400">-</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Project URL</span>
              <a
                v-if="project.projectUrl"
                :href="project.projectUrl"
                target="_blank"
                class="truncate text-secondary-500 hover:underline"
                >{{ project.projectUrl }}</a
              >
              <span v-else class="text-neutral-400">-</span>
            </div>
          </div>
        </UiCard>

        <template v-else-if="isEditing && editableProject">
          <UiCard>
            <UiCardContainer class="space-y-6 p-6">
              <h3
                class="text-xs font-bold uppercase tracking-widest text-secondary-500"
              >
                Settings
              </h3>

              <UiSelect
                id="project-status"
                v-model="(editableProject as any).common.status"
                label="Status"
                :options="['draft', 'published', 'archived']"
              />
              <UiInput
                id="project-date"
                v-model="(editableProject as any).common.publishedAt"
                label="Publish Date"
                type="datetime-local"
              />

              <UiInput
                id="project-category"
                v-model="(editableProject as any).common.categoryName"
                label="Category"
              />

              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Tags</label
                >
                <input
                  :value="(editableProject as any).common.tags.join(', ')"
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  placeholder="vue, nuxt"
                  @input="
                    (e) =>
                      ((editableProject as any).common.tags = (
                        e.target as HTMLInputElement
                      ).value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean))
                  "
                />
                <div class="mt-2 flex flex-wrap gap-2">
                  <UiChip
                    v-for="tag in (editableProject as any).common.tags"
                    :key="tag"
                    size="sm"
                    >{{ tag }}</UiChip
                  >
                </div>
              </div>

              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Techstack</label
                >
                <input
                  :value="editableProject.common.techstack.join(', ')"
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  placeholder="typescript, tailwind"
                  @input="
                    (e) =>
                      ((editableProject as any).common.techstack = (
                        e.target as HTMLInputElement
                      ).value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean))
                  "
                />
                <div class="mt-2 flex flex-wrap gap-2">
                  <UiChip
                    v-for="tech in (editableProject as any).common.techstack"
                    :key="tech"
                    size="sm"
                    >{{ tech }}</UiChip
                  >
                </div>
              </div>
            </UiCardContainer>
          </UiCard>

          <UiCard>
            <UiCardContainer class="space-y-6 p-6">
              <h3
                class="text-xs font-bold uppercase tracking-widest text-secondary-500"
              >
                Links & Icon
              </h3>

              <UiInput
                id="project-icon"
                v-model="(editableProject as any).common.icon"
                label="Icon (e.g. mage:folder)"
              />
              <div
                v-if="(editableProject as any).common.icon"
                class="flex items-center gap-2 rounded bg-neutral-100 p-2 dark:bg-neutral-800"
              >
                <Icon
                  :name="(editableProject as any).common.icon"
                  class="h-6 w-6"
                />
                <span class="text-xs">{{
                  (editableProject as any).common.icon
                }}</span>
              </div>

              <UiInput
                id="project-repo"
                v-model="(editableProject as any).common.repoUrl"
                label="Repo URL"
              />
              <UiInput
                id="project-url"
                v-model="(editableProject as any).common.projectUrl"
                label="Project URL"
              />
            </UiCardContainer>
          </UiCard>
        </template>
      </aside>
    </div>
  </div>
</template>
