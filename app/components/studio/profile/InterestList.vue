<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type {
  DbInterest,
  DbInterestCategory,
} from "#shared/schemas/profile.schema";

const { showToast } = useToast();

const categories = ref<DbInterestCategory[]>([]);
const allInterests = ref<DbInterest[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isCatModalOpen = ref(false);
const isEditing = ref(false);
const isEditingCat = ref(false);
const currentId = ref<number | null>(null);
const currentCatId = ref<number | null>(null);

const form = ref({
  slug: "",
  name: { de: "", en: "" },
  categoryId: 0,
  sortOrder: 0,
});

const catForm = ref({
  slug: "",
  name: { de: "", en: "" },
  icon: "",
  sortOrder: 0,
});

const groupedInterests = computed(() => {
  const map = new Map<number, DbInterest[]>();
  for (const cat of categories.value) {
    map.set(cat.id, []);
  }
  for (const interest of allInterests.value) {
    const list = map.get(interest.categoryId);
    if (list) list.push(interest);
    else {
      map.set(interest.categoryId, [interest]);
    }
  }
  return map;
});

async function fetchData() {
  isLoading.value = true;
  try {
    const [catRes, intRes] = await Promise.all([
      $fetch<{ categories: DbInterestCategory[] }>(
        "/api/studio/interest-categories",
      ),
      $fetch<{ interests: DbInterest[] }>("/api/studio/interests"),
    ]);
    categories.value = catRes.categories;
    allInterests.value = intRes.interests;
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Laden", { type: "error" });
  } finally {
    isLoading.value = false;
  }
}

function openAddInterest(catId?: number) {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    slug: "",
    name: { de: "", en: "" },
    categoryId: catId || (categories.value[0]?.id ?? 0),
    sortOrder: allInterests.value.length,
  };
  isModalOpen.value = true;
}

function openEditInterest(item: DbInterest) {
  isEditing.value = true;
  currentId.value = item.id;
  form.value = {
    slug: item.slug,
    name: { ...item.name },
    categoryId: item.categoryId,
    sortOrder: item.sortOrder,
  };
  isModalOpen.value = true;
}

async function saveInterest() {
  try {
    if (isEditing.value && currentId.value) {
      await $fetch(`/api/studio/interests/${currentId.value}`, {
        method: "PUT",
        body: form.value,
      });
      showToast("Interesse aktualisiert", { type: "success" });
    } else {
      await $fetch("/api/studio/interests", {
        method: "POST",
        body: form.value,
      });
      showToast("Interesse erstellt", { type: "success" });
    }
    isModalOpen.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Speichern", { type: "error" });
  }
}

async function removeInterest(id: number) {
  if (!confirm("Wirklich löschen?")) return;
  try {
    await $fetch(`/api/studio/interests/${id}`, { method: "DELETE" });
    fetchData();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Löschen", { type: "error" });
  }
}

function openAddCategory() {
  isEditingCat.value = false;
  currentCatId.value = null;
  catForm.value = {
    slug: "",
    name: { de: "", en: "" },
    icon: "",
    sortOrder: categories.value.length,
  };
  isCatModalOpen.value = true;
}

function openEditCategory(cat: DbInterestCategory) {
  isEditingCat.value = true;
  currentCatId.value = cat.id;
  catForm.value = {
    slug: cat.slug,
    name: { ...cat.name },
    icon: cat.icon || "",
    sortOrder: cat.sortOrder,
  };
  isCatModalOpen.value = true;
}

async function saveCategory() {
  try {
    if (isEditingCat.value && currentCatId.value) {
      await $fetch(`/api/studio/interest-categories/${currentCatId.value}`, {
        method: "PUT",
        body: catForm.value,
      });
      showToast("Kategorie aktualisiert", { type: "success" });
    } else {
      await $fetch("/api/studio/interest-categories", {
        method: "POST",
        body: catForm.value,
      });
      showToast("Kategorie erstellt", { type: "success" });
    }
    isCatModalOpen.value = false;
    fetchData();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Speichern", { type: "error" });
  }
}

async function removeCategory(id: number) {
  if (!confirm("Kategorie und alle zugehörigen Interessen löschen?")) return;
  try {
    await $fetch(`/api/studio/interest-categories/${id}`, { method: "DELETE" });
    fetchData();
  } catch (e) {
    console.error(e);
    const err = e as { data?: { statusMessage?: string } };
    const msg = err.data?.statusMessage || "Fehler beim Löschen";
    showToast(msg, { type: "error" });
  }
}

onMounted(fetchData);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-bold">Interessen</h3>
      <div class="flex gap-2">
        <UiButton size="sm" variant="ghost" @click="openAddCategory">
          <Icon name="heroicons:folder-plus" class="mr-2" />
          Kategorie
        </UiButton>
        <UiButton size="sm" variant="default" @click="openAddInterest()">
          <Icon name="heroicons:plus" class="mr-2" />
          Interesse
        </UiButton>
      </div>
    </div>

    <div v-if="isLoading" class="py-10 text-center">Lädt...</div>

    <div v-else class="space-y-6">
      <div
        v-if="categories.length === 0"
        class="rounded-xl border border-dashed border-primary-300 p-8 text-center text-primary-500"
      >
        Noch keine Kategorien. Erstelle zuerst eine Kategorie.
      </div>

      <div
        v-for="cat in categories"
        :key="cat.id"
        class="rounded-xl border border-primary-200 bg-white p-5 dark:border-primary-800 dark:bg-primary-900"
      >
        <div class="mb-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <Icon
              v-if="cat.icon"
              :name="cat.icon"
              class="text-secondary-500"
              size="20"
            />
            <h4 class="font-bold text-primary-900 dark:text-white">
              {{ cat.name.de }}
            </h4>
            <span class="text-sm text-primary-400">{{ cat.name.en }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UiButton
              size="sm"
              variant="ghost"
              @click="openAddInterest(cat.id)"
            >
              <Icon name="heroicons:plus" size="16" />
            </UiButton>
            <UiButton size="sm" variant="ghost" @click="openEditCategory(cat)">
              <Icon name="heroicons:pencil" size="16" />
            </UiButton>
            <UiButton
              size="sm"
              variant="ghost"
              class="text-red-500 hover:bg-red-50"
              @click="removeCategory(cat.id)"
            >
              <Icon name="heroicons:trash" size="16" />
            </UiButton>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="interest in groupedInterests.get(cat.id) || []"
            :key="interest.id"
            class="group flex items-center gap-1 rounded-lg border border-primary-100 bg-primary-50 px-3 py-1.5 dark:border-primary-700 dark:bg-primary-800"
          >
            <span
              class="text-sm font-medium text-primary-800 dark:text-primary-200"
              >{{ interest.name.de }}</span
            >
            <span class="text-xs text-primary-400"
              >/ {{ interest.name.en }}</span
            >
            <button
              class="ml-1 hidden text-primary-400 hover:text-red-500 group-hover:block"
              @click="openEditInterest(interest)"
            >
              <Icon name="heroicons:pencil" size="12" />
            </button>
            <button
              class="hidden text-primary-400 hover:text-red-500 group-hover:block"
              @click="removeInterest(interest.id)"
            >
              <Icon name="heroicons:x-mark" size="12" />
            </button>
          </div>
          <div
            v-if="(groupedInterests.get(cat.id) || []).length === 0"
            class="text-sm italic text-primary-400"
          >
            Keine Interessen
          </div>
        </div>
      </div>
    </div>

    <!-- Interest Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-primary-900"
      >
        <h3 class="mb-4 text-xl font-bold">
          {{ isEditing ? "Interesse bearbeiten" : "Neues Interesse" }}
        </h3>
        <div class="space-y-4">
          <UiInput
            id="int-slug"
            v-model="form.slug"
            label="Slug"
            placeholder="z.b. programming"
          />
          <UiInput
            id="int-name-de"
            v-model="form.name.de"
            label="Name (DE)"
            placeholder="Programmieren"
          />
          <UiInput
            id="int-name-en"
            v-model="form.name.en"
            label="Name (EN)"
            placeholder="Programming"
          />
          <div>
            <label
              class="mb-1 block text-sm font-bold text-primary-700 dark:text-primary-300"
              >Kategorie</label
            >
            <select
              v-model.number="form.categoryId"
              class="w-full rounded-xl border border-primary-200 bg-white p-2.5 dark:border-primary-800 dark:bg-primary-900"
            >
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name.de }}
              </option>
            </select>
          </div>
          <UiInput
            id="int-sort"
            v-model.number="form.sortOrder"
            type="number"
            label="Sortierung"
          />
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UiButton variant="ghost" @click="isModalOpen = false"
            >Abbrechen</UiButton
          >
          <UiButton variant="default" @click="saveInterest">Speichern</UiButton>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div
      v-if="isCatModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-primary-900"
      >
        <h3 class="mb-4 text-xl font-bold">
          {{ isEditingCat ? "Kategorie bearbeiten" : "Neue Kategorie" }}
        </h3>
        <div class="space-y-4">
          <UiInput
            id="cat-slug"
            v-model="catForm.slug"
            label="Slug"
            placeholder="z.b. technology"
          />
          <UiInput
            id="cat-name-de"
            v-model="catForm.name.de"
            label="Name (DE)"
            placeholder="Technologie"
          />
          <UiInput
            id="cat-name-en"
            v-model="catForm.name.en"
            label="Name (EN)"
            placeholder="Technology"
          />
          <UiInput
            id="cat-icon"
            v-model="catForm.icon"
            label="Icon"
            placeholder="heroicons:code-bracket"
          />
          <UiInput
            id="cat-sort"
            v-model.number="catForm.sortOrder"
            type="number"
            label="Sortierung"
          />
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <UiButton variant="ghost" @click="isCatModalOpen = false"
            >Abbrechen</UiButton
          >
          <UiButton variant="default" @click="saveCategory">Speichern</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
