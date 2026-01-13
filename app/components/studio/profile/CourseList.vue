<script setup lang="ts">
import { ref } from 'vue';
import type { DbCourse, CreateCourse } from '#shared/schemas/course.schema';

const courses = ref<DbCourse[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isEditing = ref(false);
const currentCourseId = ref<number | null>(null);
const { showToast } = useToast();

// Form State
const form = ref<CreateCourse>({
  title: { de: '', en: '' },
  organization: '',
  teachers: [],
  startedAt: null,
  endedAt: null,
  certificateUrl: '',
});

// Teachers input helper
const teachersInput = ref('');

const fetchCourses = async () => {
  isLoading.value = true;
  try {
    const res = await $fetch<{ courses: DbCourse[] }>('/api/studio/courses');
    courses.value = res.courses;
  } catch (e) {
    console.error(e);
    showToast('Fehler beim Laden der Kurse', { type: 'error' });
  } finally {
    isLoading.value = false;
  }
};

const openAddModal = () => {
  isEditing.value = false;
  currentCourseId.value = null;
  form.value = {
    title: { de: '', en: '' },
    organization: '',
    teachers: [],
    startedAt: null,
    endedAt: null,
    certificateUrl: '',
  };
  teachersInput.value = '';
  isModalOpen.value = true;
};

const openEditModal = (course: DbCourse) => {
  isEditing.value = true;
  currentCourseId.value = course.id;
  form.value = {
    title: { ...course.title },
    organization: course.organization || '',
    teachers: course.teachers || [],
    startedAt: course.startedAt ? new Date(course.startedAt) : null,
    endedAt: course.endedAt ? new Date(course.endedAt) : null,
    certificateUrl: course.certificateUrl || '',
  };
  teachersInput.value = (course.teachers || []).join(', ');
  isModalOpen.value = true;
};

const saveCourse = async () => {
  // Parse teachers from string
  form.value.teachers = teachersInput.value.split(',').map(t => t.trim()).filter(t => t);

  // Sanitize payload for Zod (empty string != null for urls)
  const payload = {
    ...form.value,
    certificateUrl: form.value.certificateUrl || null,
    organization: form.value.organization || null,
  };

  try {
    if (isEditing.value && currentCourseId.value) {
      await $fetch(`/api/studio/courses/${currentCourseId.value}`, {
        method: 'PUT',
        body: payload
      });
      showToast('Kurs aktualisiert', { type: 'success' });
    } else {
      await $fetch('/api/studio/courses', {
        method: 'POST',
        body: payload
      });
      showToast('Kurs erstellt', { type: 'success' });
    }
    isModalOpen.value = false;
    fetchCourses();
  } catch (e: any) {
    console.error('Save error:', e.data || e);
    const issues = e.data?.data?.issues;
    if (issues && Array.isArray(issues)) {
       const msg = issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('\n');
       showToast(`Fehler:\n${msg}`, { type: 'error' });
    } else {
       const msg = e.data?.statusMessage || e.message || 'Unbekannter Fehler';
       showToast(`Fehler: ${msg}`, { type: 'error' });
    }
  }
};

const deleteCourse = async (id: number) => {
  if (!confirm('Wirklich löschen?')) return;
  try {
    await $fetch(`/api/studio/courses/${id}`, { method: 'DELETE' });
    fetchCourses();
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  fetchCourses();
});

const formatDate = (d: string | Date | null) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('de-DE');
};
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <h3 class="text-lg font-bold">Meine Kurse & Zertifikate</h3>
      <UiButton @click="openAddModal" size="sm" variant="primary">
        <Icon name="heroicons:plus" class="mr-2" />
        Kurs hinzufügen
      </UiButton>
    </div>

    <div v-if="isLoading" class="py-10 text-center">Lädt...</div>
    
    <div v-else class="space-y-4">
      <div v-if="courses.length === 0" class="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
        Noch keine Kurse eingetragen.
      </div>

      <div v-for="course in courses" :key="course.id" class="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div>
          <h4 class="font-bold">{{ course.title.de }}</h4>
          <div class="text-sm text-neutral-500">
             {{ course.organization }} • {{ formatDate(course.startedAt) }} - {{ formatDate(course.endedAt) }}
          </div>
        </div>
        <div class="flex gap-2">
          <UiButton @click="openEditModal(course)" size="icon-sm" variant="ghost">
            <Icon name="heroicons:pencil" />
          </UiButton>
          <UiButton @click="deleteCourse(course.id)" size="icon-sm" variant="ghost" class="text-red-500 hover:bg-red-50 hover:text-red-600">
            <Icon name="heroicons:trash" />
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Modal (Simple Implementation using native dialog or conditional rendering) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900">
        <h3 class="mb-4 text-xl font-bold">{{ isEditing ? 'Kurs bearbeiten' : 'Neuer Kurs' }}</h3>
        
        <div class="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
           <UiInput label="Titel (DE)" v-model="form.title.de" placeholder="Kursname Deutsch" />
           <UiInput label="Titel (EN)" v-model="form.title.en" placeholder="Course Name English" />
           
           <UiInput label="Organisation / Anbieter" v-model="form.organization" placeholder="z.B. Udemy, WBS..." />
           
           <div class="grid grid-cols-2 gap-4">
              <UiInput label="Startdatum" type="date" :model-value="form.startedAt ? new Date(form.startedAt).toISOString().split('T')[0] : ''" @update:model-value="v => form.startedAt = v ? new Date(v) : null" />
              <UiInput label="Enddatum" type="date" :model-value="form.endedAt ? new Date(form.endedAt).toISOString().split('T')[0] : ''" @update:model-value="v => form.endedAt = v ? new Date(v) : null" />
           </div>

           <UiInput label="Lehrer / Dozenten (Kommagetrennt)" v-model="teachersInput" placeholder="Max Mustermann, ..." />
           
           <UiInput label="Zertifikat URL" v-model="form.certificateUrl" placeholder="https://..." />
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <UiButton @click="isModalOpen = false" variant="ghost">Abbrechen</UiButton>
          <UiButton @click="saveCourse" variant="primary">Speichern</UiButton>
        </div>
      </div>
    </div>
  </div>
</template>
