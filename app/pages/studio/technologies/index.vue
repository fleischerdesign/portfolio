<script setup lang="ts">
import { ref, computed } from "vue";
import type { Technology } from "#shared/schemas/technology.schema";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
  layout: "default",
});

const { data, refresh } = await useFetch<{
  technologies: (Technology & { projectCount: number })[];
}>("/api/studio/technologies");

const technologies = computed(() => data.value?.technologies || []);

const searchTerm = ref("");

const filteredTechnologies = computed(() => {
  if (!searchTerm.value) return technologies.value;
  const term = searchTerm.value.toLowerCase();
  return technologies.value.filter(
    (tech) =>
      tech.name.toLowerCase().includes(term) ||
      tech.slug.toLowerCase().includes(term),
  );
});

const editingId = ref<number | null>(null);
const editForm = ref<{ name: string; icon: string | null; featured: boolean }>({
  name: "",
  icon: null,
  featured: false,
});
const saving = ref(false);
const togglingFeatured = ref<number | null>(null);
const deleting = ref<number | null>(null);

function startEdit(tech: Technology & { projectCount: number }) {
  editingId.value = tech.id;
  editForm.value = {
    name: tech.name,
    icon: tech.icon,
    featured: tech.featured,
  };
}

function cancelEdit() {
  editingId.value = null;
  editForm.value = { name: "", icon: null, featured: false };
}

async function saveEdit() {
  if (!editingId.value) return;
  saving.value = true;
  try {
    await $fetch(`/api/studio/technologies/${editingId.value}`, {
      method: "PUT",
      body: editForm.value,
    });
    await refresh();
    cancelEdit();
  } catch (e) {
    console.error("Failed to save technology:", e);
  } finally {
    saving.value = false;
  }
}

async function toggleFeatured(tech: Technology & { projectCount: number }) {
  togglingFeatured.value = tech.id;
  try {
    await $fetch(`/api/studio/technologies/${tech.id}`, {
      method: "PUT",
      body: { featured: !tech.featured },
    });
    await refresh();
  } catch (e) {
    console.error("Failed to toggle featured:", e);
  } finally {
    togglingFeatured.value = null;
  }
}

async function deleteTech(id: number) {
  deleting.value = id;
  try {
    await $fetch(`/api/studio/technologies/${id}`, { method: "DELETE" });
    await refresh();
  } catch (e: unknown) {
    const err = e as { data?: { statusMessage?: string } };
    alert(err.data?.statusMessage || "Failed to delete technology");
  } finally {
    deleting.value = null;
  }
}
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-24 space-y-8">
      <UiSectionHeader
        :level="1"
        symbol="heroicons:cpu-chip"
        title="Technologies"
        subtitle="Manage tech stack entries, icons, and featured status."
      />

      <div class="max-w-md">
        <UiInput
          id="search-technologies"
          v-model="searchTerm"
          label="Search"
          placeholder="Filter by name or slug..."
        />
      </div>

      <div
        class="overflow-hidden rounded-xl border border-primary-200/50 bg-white shadow-sm dark:border-primary-800/50 dark:bg-primary-900/50"
      >
        <table class="w-full text-left text-sm">
          <thead
            class="border-b border-primary-200/50 bg-primary-50/50 text-xs font-black uppercase tracking-wider text-primary-500 dark:border-primary-800/50 dark:bg-primary-900/80 dark:text-primary-400"
          >
            <tr>
              <th class="px-6 py-3">Icon</th>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Slug</th>
              <th class="px-6 py-3 text-center">Featured</th>
              <th class="px-6 py-3 text-center">Projects</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-primary-100 dark:divide-primary-800/50">
            <tr
              v-for="tech in filteredTechnologies"
              :key="tech.id"
              class="group transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-800/30"
            >
              <td class="px-6 py-3">
                <template v-if="editingId === tech.id">
                  <UiInput
                    id="edit-icon"
                    v-model="editForm.icon"
                    placeholder="simple-icons:react"
                  />
                </template>
                <div
                  v-else
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-800"
                >
                  <Icon
                    :name="tech.icon || 'mage:box-3d'"
                    :class="!tech.icon && 'opacity-30'"
                    size="18"
                  />
                </div>
              </td>
              <td class="px-6 py-3">
                <template v-if="editingId === tech.id">
                  <UiInput id="edit-name" v-model="editForm.name" />
                </template>
                <span
                  v-else
                  class="font-bold text-primary-900 dark:text-white"
                  >{{ tech.name }}</span
                >
              </td>
              <td
                class="px-6 py-3 font-mono text-xs text-primary-500 dark:text-primary-400"
              >
                {{ tech.slug }}
              </td>
              <td class="px-6 py-3 text-center">
                <button
                  class="transition-colors"
                  :class="
                    tech.featured
                      ? 'text-secondary-500'
                      : 'text-primary-300 dark:text-primary-600'
                  "
                  :title="tech.featured ? 'Featured' : 'Not featured'"
                  :disabled="togglingFeatured === tech.id"
                  @click="toggleFeatured(tech)"
                >
                  <Icon
                    v-if="togglingFeatured === tech.id"
                    name="heroicons:arrow-path"
                    size="18"
                    class="animate-spin"
                  />
                  <Icon
                    v-else-if="tech.featured"
                    name="heroicons:star-solid"
                    size="18"
                  />
                  <Icon v-else name="heroicons:star" size="18" />
                </button>
              </td>
              <td
                class="px-6 py-3 text-center text-primary-500 dark:text-primary-400"
              >
                {{ tech.projectCount }}
              </td>
              <td class="px-6 py-3 text-right">
                <div
                  v-if="editingId === tech.id"
                  class="flex items-center justify-end gap-2"
                >
                  <UiButton
                    size="sm"
                    variant="secondary"
                    :is-loading="saving"
                    @click="saveEdit"
                    >Save</UiButton
                  >
                  <UiButton size="sm" variant="ghost" @click="cancelEdit"
                    >Cancel</UiButton
                  >
                </div>
                <div
                  v-else
                  class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <UiButton size="sm" variant="ghost" @click="startEdit(tech)">
                    <Icon name="heroicons:pencil-square" size="16" />
                  </UiButton>
                  <UiButton
                    size="sm"
                    variant="ghost"
                    :is-loading="deleting === tech.id"
                    :disabled="tech.projectCount > 0"
                    :title="
                      tech.projectCount > 0
                        ? 'Cannot delete: used by projects'
                        : 'Delete'
                    "
                    @click="deleteTech(tech.id)"
                  >
                    <Icon
                      name="heroicons:trash"
                      size="16"
                      class="text-red-500"
                    />
                  </UiButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="filteredTechnologies.length === 0"
        class="flex flex-col items-center py-12 text-center text-primary-500"
      >
        <Icon name="heroicons:cpu-chip" class="mb-4 h-12 w-12 opacity-20" />
        <p>No technologies found.</p>
      </div>
    </div>
  </div>
</template>
