<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { DbSkill } from "#shared/schemas/profile.schema";

const { showToast } = useToast();

const skills = ref<DbSkill[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  slug: "",
  name: { de: "", en: "" },
  score: 0,
  featured: false,
  sortOrder: 0,
});

async function fetchItems() {
  isLoading.value = true;
  try {
    const res = await $fetch<{ skills: DbSkill[] }>("/api/studio/skills");
    skills.value = res.skills;
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Laden der Skills", { type: "error" });
  } finally {
    isLoading.value = false;
  }
}

function openAdd() {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    slug: "",
    name: { de: "", en: "" },
    score: 0,
    featured: false,
    sortOrder: skills.value.length,
  };
  isModalOpen.value = true;
}

function openEdit(item: DbSkill) {
  isEditing.value = true;
  currentId.value = item.id;
  form.value = {
    slug: item.slug,
    name: { ...item.name },
    score: item.score,
    featured: item.featured,
    sortOrder: item.sortOrder,
  };
  isModalOpen.value = true;
}

async function save() {
  try {
    if (isEditing.value && currentId.value) {
      await $fetch(`/api/studio/skills/${currentId.value}`, {
        method: "PUT",
        body: form.value,
      });
      showToast("Skill aktualisiert", { type: "success" });
    } else {
      await $fetch("/api/studio/skills", {
        method: "POST",
        body: form.value,
      });
      showToast("Skill erstellt", { type: "success" });
    }
    isModalOpen.value = false;
    fetchItems();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Speichern", { type: "error" });
  }
}

async function remove(id: number) {
  if (!confirm("Wirklich löschen?")) return;
  try {
    await $fetch(`/api/studio/skills/${id}`, { method: "DELETE" });
    fetchItems();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Löschen", { type: "error" });
  }
}

async function toggleFeatured(item: DbSkill) {
  try {
    await $fetch(`/api/studio/skills/${item.id}`, {
      method: "PUT",
      body: { featured: !item.featured },
    });
    fetchItems();
  } catch (e) {
    console.error(e);
    showToast("Fehler", { type: "error" });
  }
}

onMounted(fetchItems);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-bold">Soft Skills</h3>
      <UiButton size="sm" variant="default" @click="openAdd">
        <Icon name="heroicons:plus" class="mr-2" />
        Skill hinzufügen
      </UiButton>
    </div>

    <div v-if="isLoading" class="py-10 text-center">Lädt...</div>

    <div v-else class="space-y-3">
      <div
        v-if="skills.length === 0"
        class="rounded-xl border border-dashed border-primary-300 p-8 text-center text-primary-500"
      >
        Noch keine Skills eingetragen.
      </div>

      <div
        v-for="item in skills"
        :key="item.id"
        class="flex items-center justify-between rounded-xl border border-primary-200 bg-white p-4 shadow-sm dark:border-primary-800 dark:bg-primary-900"
      >
        <div class="flex items-center gap-4">
          <button
            class="text-xl transition-colors"
            :class="
              item.featured
                ? 'text-yellow-500'
                : 'text-primary-300 hover:text-yellow-400'
            "
            :title="item.featured ? 'Featured' : 'Nicht featured'"
            @click="toggleFeatured(item)"
          >
            <Icon
              :name="item.featured ? 'heroicons:star-solid' : 'heroicons:star'"
            />
          </button>
          <div>
            <h4 class="font-bold text-primary-900 dark:text-white">
              {{ item.name.de }}
            </h4>
            <div class="text-sm text-primary-500">{{ item.name.en }}</div>
          </div>
          <div class="ml-4 flex items-center gap-2">
            <div
              class="h-2 w-24 overflow-hidden rounded-full bg-primary-100 dark:bg-primary-800"
            >
              <div
                class="h-full rounded-full bg-secondary-400"
                :style="{ width: item.score + '%' }"
              />
            </div>
            <span class="text-xs font-bold text-primary-500"
              >{{ item.score }}%</span
            >
          </div>
        </div>
        <div class="flex gap-2">
          <UiButton size="sm" variant="ghost" @click="openEdit(item)">
            <Icon name="heroicons:pencil" />
          </UiButton>
          <UiButton
            size="sm"
            variant="ghost"
            class="text-red-500 hover:bg-red-50 hover:text-red-600"
            @click="remove(item.id)"
          >
            <Icon name="heroicons:trash" />
          </UiButton>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-primary-900"
      >
        <h3 class="mb-4 text-xl font-bold">
          {{ isEditing ? "Skill bearbeiten" : "Neuer Skill" }}
        </h3>
        <div class="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
          <UiInput
            id="skill-slug"
            v-model="form.slug"
            label="Slug"
            placeholder="z.B. leadership"
          />
          <UiInput
            id="skill-name-de"
            v-model="form.name.de"
            label="Name (DE)"
            placeholder="Führung"
          />
          <UiInput
            id="skill-name-en"
            v-model="form.name.en"
            label="Name (EN)"
            placeholder="Leadership"
          />
          <UiInput
            id="skill-score"
            v-model.number="form.score"
            type="number"
            label="Score (0-100)"
            placeholder="85"
            min="0"
            max="100"
          />
          <UiInput
            id="skill-sort"
            v-model.number="form.sortOrder"
            type="number"
            label="Sortierung"
            placeholder="0"
          />
          <label class="flex items-center gap-3">
            <input
              v-model="form.featured"
              type="checkbox"
              class="h-4 w-4 rounded border-primary-300"
            />
            <span
              class="text-sm font-bold text-primary-700 dark:text-primary-300"
              >Featured</span
            >
          </label>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UiButton variant="ghost" @click="isModalOpen = false"
            >Abbrechen</UiButton
          >
          <UiButton variant="default" @click="save">Speichern</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
