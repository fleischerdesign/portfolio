<script setup lang="ts">
import type { BlogPostCreate } from "~~/shared/schemas/blog.schema";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
});

const router = useRouter();
const localePath = useLocalePath();
const { showToast } = useToast();

const form = ref({
  title: "",
  translationKey: "",
  slug: "",
});

const isLoading = ref(false);

// Auto-generate slug from title
watch(
  () => form.value.title,
  (newVal, oldVal) => {
    const newSlug = slugify(newVal);
    const oldSlug = slugify(oldVal || "");

    if (!form.value.slug || form.value.slug === oldSlug) {
      form.value.slug = newSlug;
    }
  },
);

async function create() {
  isLoading.value = true;
  try {
    const payload: BlogPostCreate = {
      locale: "de", // Start with DE as default
      title: form.value.title,
      slug: form.value.slug,
      body: "# New Post\n\nStart writing...", // Corrected newline escaping
      status: "draft",
      excerpt: "",
      publishedAt: new Date(),
      coverImage: null,
      coverImageAlt: null,
      categoryName: null,
      tags: [],
    };

    const res = await $fetch<{ id?: number; result?: { id: number } }>(
      "/api/blog",
      {
        method: "POST",
        body: payload,
      },
    );

    const postId = res.result?.id || res.id; // Check response structure

    if (postId) {
      showToast("Post created!", { type: "success" });
      router.push(localePath(`/studio/blog/${postId}`));
    } else {
      throw new Error("No ID returned");
    }
  } catch (error) {
    console.error(error);
    showToast("Failed to create post", { type: "error" });
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div
    class="container mx-auto max-w-screen-md px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <UiBackButton :to="$localePath('/studio/blog')" class="mb-8" />

    <UiCard>
      <UiCardContainer class="space-y-6 p-8">
        <div class="mb-6">
          <h1 class="text-2xl font-bold">Create New Post</h1>
          <p class="text-neutral-500">
            Start with the basics. You can edit everything else later.
          </p>
        </div>

        <UiInput
          id="title"
          v-model="form.title"
          label="Title (German)"
          placeholder="My Awesome Article"
          required
        />

        <UiInput
          id="slug"
          v-model="form.slug"
          label="URL Slug"
          placeholder="my-awesome-article"
        />

        <UiButton class="mt-4 w-full" :is-loading="isLoading" @click="create">
          Create & Edit
        </UiButton>
      </UiCardContainer>
    </UiCard>
  </div>
</template>
