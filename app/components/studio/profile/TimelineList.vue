<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { DbTimelineEntry } from "#shared/schemas/profile.schema";

const { showToast } = useToast();

const entries = ref<DbTimelineEntry[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentId = ref<number | null>(null);

const form = ref({
  slug: "",
  date: "",
  title: { de: "", en: "" },
  description: { de: "", en: "" },
  icon: "",
  type: "education" as "education" | "career",
  skills: [] as { de: string; en: string }[],
  sortOrder: 0,
});

const skillsInputDe = ref("");
const skillsInputEn = ref("");

async function fetchItems() {
  isLoading.value = true;
  try {
    const res = await $fetch<{ timeline: DbTimelineEntry[] }>(
      "/api/studio/timeline",
    );
    entries.value = res.timeline;
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Laden", { type: "error" });
  } finally {
    isLoading.value = false;
  }
}

function openAdd() {
  isEditing.value = false;
  currentId.value = null;
  form.value = {
    slug: "",
    date: "",
    title: { de: "", en: "" },
    description: { de: "", en: "" },
    icon: "",
    type: "education",
    skills: [],
    sortOrder: entries.value.length,
  };
  skillsInputDe.value = "";
  skillsInputEn.value = "";
  isModalOpen.value = true;
}

function openEdit(item: DbTimelineEntry) {
  isEditing.value = true;
  currentId.value = item.id;
  form.value = {
    slug: item.slug,
    date: item.date,
    title: { ...item.title },
    description: { ...item.description },
    icon: item.icon || "",
    type: item.type,
    skills: item.skills ? [...item.skills] : [],
    sortOrder: item.sortOrder,
  };
  skillsInputDe.value = (item.skills || []).map((s) => s.de).join(", ");
  skillsInputEn.value = (item.skills || []).map((s) => s.en).join(", ");
  isModalOpen.value = true;
}

function parseSkills() {
  const deArr = skillsInputDe.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const enArr = skillsInputEn.value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const len = Math.max(deArr.length, enArr.length);
  const result: { de: string; en: string }[] = [];
  for (let i = 0; i < len; i++) {
    result.push({
      de: deArr[i] || enArr[i] || "",
      en: enArr[i] || deArr[i] || "",
    });
  }
  form.value.skills = result;
}

async function save() {
  parseSkills();
  const payload = {
    ...form.value,
    icon: form.value.icon || null,
    skills: form.value.skills.length > 0 ? form.value.skills : null,
  };
  try {
    if (isEditing.value && currentId.value) {
      await $fetch(`/api/studio/timeline/${currentId.value}`, {
        method: "PUT",
        body: payload,
      });
      showToast("Eintrag aktualisiert", { type: "success" });
    } else {
      await $fetch("/api/studio/timeline", {
        method: "POST",
        body: payload,
      });
      showToast("Eintrag erstellt", { type: "success" });
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
    await $fetch(`/api/studio/timeline/${id}`, { method: "DELETE" });
    fetchItems();
  } catch (e) {
    console.error(e);
    showToast("Fehler beim Löschen", { type: "error" });
  }
}

onMounted(fetchItems);
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-bold">Werdegang</h3>
      <UiButton size="sm" variant="default" @click="openAdd">
        <Icon name="heroicons:plus" class="mr-2" />
        Eintrag hinzufügen
      </UiButton>
    </div>

    <div v-if="isLoading" class="py-10 text-center">Lädt...</div>

    <div v-else class="space-y-3">
      <div
        v-if="entries.length === 0"
        class="rounded-xl border border-dashed border-primary-300 p-8 text-center text-primary-500"
      >
        Noch keine Einträge.
      </div>

      <div
        v-for="item in entries"
        :key="item.id"
        class="flex items-center justify-between rounded-xl border border-primary-200 bg-white p-4 shadow-sm dark:border-primary-800 dark:bg-primary-900"
      >
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <Icon
              v-if="item.icon"
              :name="item.icon"
              class="text-secondary-500"
              size="18"
            />
            <span
              class="text-xs font-black uppercase tracking-widest text-secondary-500"
              >{{ item.date }}</span
            >
            <span
              class="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
              :class="
                item.type === 'education'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-green-50 text-green-600'
              "
            >
              {{ item.type === "education" ? "Bildung" : "Karriere" }}
            </span>
          </div>
          <h4 class="mt-1 font-bold text-primary-900 dark:text-white">
            {{ item.title.de }}
          </h4>
          <div class="text-sm text-primary-500">{{ item.title.en }}</div>
          <div
            v-if="item.skills && item.skills.length"
            class="mt-2 flex flex-wrap gap-1"
          >
            <span
              v-for="(skill, i) in item.skills"
              :key="i"
              class="rounded-md border border-secondary-100 bg-secondary-50 px-1.5 py-0.5 text-[10px] font-bold text-secondary-600"
            >
              {{ skill.de }}
            </span>
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
          {{ isEditing ? "Eintrag bearbeiten" : "Neuer Eintrag" }}
        </h3>
        <div class="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
          <UiInput
            id="tl-slug"
            v-model="form.slug"
            label="Slug"
            placeholder="z.b. wbs"
          />
          <UiInput
            id="tl-date"
            v-model="form.date"
            label="Zeitraum"
            placeholder="2025 - 2027"
          />
          <UiInput
            id="tl-title-de"
            v-model="form.title.de"
            label="Titel (DE)"
          />
          <UiInput
            id="tl-title-en"
            v-model="form.title.en"
            label="Title (EN)"
          />
          <UiInput
            id="tl-desc-de"
            v-model="form.description.de"
            label="Beschreibung (DE)"
          />
          <UiInput
            id="tl-desc-en"
            v-model="form.description.en"
            label="Description (EN)"
          />
          <UiInput
            id="tl-icon"
            v-model="form.icon"
            label="Icon"
            placeholder="heroicons:academic-cap"
          />
          <div>
            <label
              class="mb-1 block text-sm font-bold text-primary-700 dark:text-primary-300"
              >Typ</label
            >
            <select
              v-model="form.type"
              class="w-full rounded-xl border border-primary-200 bg-white p-2.5 dark:border-primary-800 dark:bg-primary-900"
            >
              <option value="education">Bildung</option>
              <option value="career">Karriere</option>
            </select>
          </div>
          <UiInput
            id="tl-skills-de"
            v-model="skillsInputDe"
            label="Skills (DE, kommasepariert)"
            placeholder="Java, Python, ..."
          />
          <UiInput
            id="tl-skills-en"
            v-model="skillsInputEn"
            label="Skills (EN, comma-separated)"
            placeholder="Java, Python, ..."
          />
          <UiInput
            id="tl-sort"
            v-model.number="form.sortOrder"
            type="number"
            label="Sortierung"
          />
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
