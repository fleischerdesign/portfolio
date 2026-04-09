<script setup lang="ts">
import { useBlogEditor } from "~/composables/useBlogEditor";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
  layout: "default",
});

const route = useRoute();

const postId = parseInt(route.params.id as string);
const { data, refresh } = await useFetch(`/api/studio/blog/${postId}`);

const {
  isEditing,
  isLoading,
  currentLocale,
  editableData: editablePost,
  startEditing,
  cancelEditing,
  save,
} = useBlogEditor(postId, data, refresh);

const post = computed(() => data.value?.post);

const viewTranslation = computed(() => {
  if (!post.value) return null;
  return (
    post.value.translations.find(
      (t: { locale: string }) => t.locale === currentLocale.value,
    ) ||
    post.value.translations.find(
      (t: { locale: string }) => t.locale === "en",
    ) ||
    post.value.translations[0]
  );
});

const currentBody = computed(() => {
  if (isEditing.value && editablePost.value) {
    return (editablePost.value as any)[currentLocale.value].body;
  }
  return viewTranslation.value?.body || "";
});

const viewFormattedDate = computed(() =>
  post.value?.publishedAt ? formatDate(post.value.publishedAt) : "",
);

function getStatusColor(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-500 text-white shadow-emerald-500/30 border-emerald-400/50";
    case "draft":
      return "bg-amber-500 text-white shadow-amber-500/30 border-amber-400/50";
    case "archived":
      return "bg-neutral-500 text-white border-neutral-400/50";
    default:
      return "bg-neutral-500";
  }
}
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-12 flex flex-col gap-8">
      <div class="flex items-center justify-between">
        <UiBackButton :to="$localePath('/studio/blog')" />
      </div>

      <UiSectionHeader
        v-if="post && viewTranslation && !isEditing"
        :level="1"
        :title="viewTranslation.title"
        :subtitle="viewTranslation.excerpt || ''"
        symbol="mage:edit"
      />
      <UiSectionHeader
        v-else-if="isEditing && editablePost"
        :level="1"
        :title="(editablePost as any)[currentLocale].title || 'Editing Post'"
        subtitle="Compose and refine your story."
        symbol="mage:edit"
      />
    </div>

    <UiCard
      v-if="post && !isEditing"
      class="mb-12 border-secondary-500/10 shadow-xl shadow-secondary-500/5"
    >
      <UiCardContainer
        class="flex flex-col justify-between gap-6 px-8 py-6 lg:flex-row lg:items-center lg:gap-8"
      >
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
              Status
            </p>
            <div class="mt-1">
              <span
                class="rounded-lg border px-3 py-0.5 text-xs font-bold capitalize shadow-sm"
                :class="getStatusColor(post.status)"
              >
                {{ post.status }}
              </span>
            </div>
          </div>
        </div>

        <div
          class="flex w-full items-center gap-5 border-t border-neutral-100 pt-6 lg:min-w-0 lg:flex-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800"
        >
          <div
            class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-50 text-secondary-600 shadow-sm dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400"
          >
            <Icon name="heroicons:language" size="28" />
          </div>
          <div class="min-w-0 flex-1">
            <p
              class="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500"
            >
              Translations
            </p>
            <div class="mt-1 flex gap-2">
              <span
                v-for="lang in ['de', 'en']"
                :key="lang"
                class="flex items-center gap-1.5"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="
                    post.translations.some((t: any) => t.locale === lang)
                      ? 'bg-emerald-500'
                      : 'bg-neutral-300'
                  "
                ></span>
                <span
                  class="text-sm font-bold uppercase text-neutral-700 dark:text-neutral-300"
                  >{{ lang }}</span
                >
              </span>
            </div>
          </div>
        </div>

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
              Published
            </p>
            <p
              class="mt-0.5 text-xl font-bold text-neutral-900 dark:text-white"
            >
              {{ viewFormattedDate || "Not published" }}
            </p>
            <p
              class="whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400"
            >
              {{ 0 }} min read
            </p>
          </div>
        </div>
      </UiCardContainer>
    </UiCard>

    <div class="grid grid-cols-1 items-start gap-12 lg:grid-cols-4">
      <div class="space-y-12 lg:col-span-3">
        <div
          v-if="!isEditing && post && viewTranslation"
          class="flex flex-col items-start"
        >
          <div class="mb-10 w-full">
            <div class="mb-6 flex flex-wrap items-center gap-4">
              <div class="flex gap-2">
                <UiTag
                  v-for="tag in post.tags"
                  :key="tag.id"
                  variant="glow"
                  size="sm"
                  >{{ tag.name }}</UiTag
                >
              </div>
            </div>
          </div>

          <div
            v-if="post.coverImage"
            class="group relative mb-16 aspect-[21/9] w-full overflow-hidden rounded-[2.5rem] border border-neutral-200/50 bg-neutral-100 shadow-2xl dark:border-neutral-800/50 dark:bg-neutral-900"
          >
            <NuxtImg
              :src="post.coverImage"
              sizes="100vw lg:1000px"
              class="h-full w-full object-cover"
            />
          </div>

          <BaseMarkdown :content="currentBody" class="w-full" />
        </div>

        <div v-else-if="isEditing && editablePost" class="space-y-8">
          <UiCard>
            <UiCardContainer class="space-y-6 p-8">
              <UiInput
                id="post-title"
                v-model="(editablePost as any)[currentLocale].title"
                label="Title"
                class="text-xl font-bold"
              />

              <div class="flex items-end gap-2">
                <UiInput
                  id="post-slug"
                  v-model="(editablePost as any)[currentLocale].slug"
                  label="Slug"
                  class="flex-1 font-mono text-sm"
                  readonly
                />
                <UiButton
                  variant="secondary"
                  title="Regenerate Slug from Title"
                  class="mb-[2px]"
                  @click="
                    (editablePost as any)[currentLocale].slug = slugify(
                      (editablePost as any)[currentLocale].title,
                    )
                  "
                >
                  <Icon name="heroicons:arrow-path" />
                </UiButton>
              </div>

              <UiInput
                id="post-excerpt"
                v-model="(editablePost as any)[currentLocale].excerpt"
                label="Excerpt"
                as="textarea"
                rows="3"
              />

              <div
                class="border-t border-neutral-100 pt-4 dark:border-neutral-800"
              >
                <UiImageUploader
                  v-model="(editablePost as any).common.coverImage"
                  label="Cover Image"
                  helper-text="Upload a representative cover image for the post."
                />

                <UiInput
                  id="post-image-alt"
                  v-model="(editablePost as any).common.coverImageAlt"
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
                v-model="(editablePost as any)[currentLocale].body"
                class="w-full flex-1 resize-none border-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:ring-0"
              ></textarea>
            </UiCard>
            <UiCard
              class="flex h-full flex-col overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/30"
            >
              <BaseMarkdown :content="currentBody" class="prose-sm flex-1 overflow-y-auto p-4" />
            </UiCard>
          </div>
        </div>
      </div>

      <aside class="sticky top-24 space-y-6">
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
                  <Icon name="heroicons:pencil-square" class="mr-2" /> Edit Post
                </UiButton>

                <a
                  v-if="post?.status === 'published' && viewTranslation"
                  :href="`/${currentLocale}/blog/${viewTranslation.slug}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="block w-full"
                >
                  <UiButton variant="glass" class="w-full">
                    <Icon
                      name="heroicons:arrow-top-right-on-square"
                      class="mr-2"
                    />
                    View Live
                  </UiButton>
                </a>
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

        <UiCard v-if="!isEditing && post && viewTranslation" class="p-6">
          <h3
            class="mb-4 text-xs font-bold uppercase tracking-widest text-secondary-500"
          >
            Meta Data
          </h3>
          <div class="space-y-4 text-sm">
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Status</span>
              <div class="flex">
                <span
                  class="rounded border px-2 py-0.5 text-[10px] font-bold uppercase capitalize shadow-sm"
                  :class="getStatusColor(post.status)"
                >
                  {{ post.status }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Published</span>
              <span class="font-bold">{{ viewFormattedDate || "-" }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Category</span>
              <span class="font-bold">{{ post.category?.name || "-" }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs text-neutral-500">Key</span>
              <span
                class="rounded bg-neutral-100 px-1 font-mono text-xs dark:bg-neutral-800"
                >{{ post.translationKey }}</span
              >
            </div>
          </div>
        </UiCard>

        <template v-else-if="isEditing && editablePost">
          <UiCard>
            <UiCardContainer class="space-y-6 p-6">
              <h3
                class="text-xs font-bold uppercase tracking-widest text-secondary-500"
              >
                Settings
              </h3>

              <UiSelect
                id="post-status"
                v-model="(editablePost as any).common.status"
                label="Status"
                :options="['draft', 'published', 'archived']"
              />
              <UiInput
                id="post-date"
                v-model="editablePost.common.publishedAt"
                label="Publish Date"
                type="datetime-local"
              />

              <UiInput
                id="post-category"
                v-model="(editablePost as any).common.categoryName"
                label="Category"
              />

              <div>
                <label
                  class="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >Tags</label
                >
                <input
                  :value="(editablePost as any).common.tags.join(', ')"
                  class="w-full rounded-lg border-neutral-300 bg-transparent text-sm dark:border-neutral-700"
                  placeholder="vue, nuxt"
                  @input="
                    (e) =>
                      ((editablePost as any).common.tags = (
                        e.target as HTMLInputElement
                      ).value
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean))
                  "
                />
                <div class="mt-2 flex flex-wrap gap-2">
                  <UiChip
                    v-for="tag in (editablePost as any).common.tags"
                    :key="tag"
                    size="sm"
                    >{{ tag }}</UiChip
                  >
                </div>
              </div>
            </UiCardContainer>
          </UiCard>
        </template>
      </aside>
    </div>
  </div>
</template>
