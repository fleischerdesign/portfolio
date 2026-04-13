<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import type { DbUser } from "#shared/schemas/user.schema";

definePageMeta({
  middleware: "authorize",
  ability: isAdmin,
  layout: "default",
});

const { showToast } = useToast();
const route = useRoute();
const router = useRouter();

const activeTab = computed({
  get: () => (route.query.tab as string) || "basics",
  set: (val) => router.replace({ query: { ...route.query, tab: val } }),
});

const user = ref<Partial<DbUser>>({});
const isLoading = ref(true);
const isSaving = ref(false);

async function fetchProfile() {
  isLoading.value = true;
  try {
    const response = await $fetch<{ user: DbUser }>("/api/studio/profile");
    const data = response.user;

    // Initialize JSON fields if null
    const defaults = { de: "", en: "" };
    data.country = data.country || { ...defaults };
    data.maritalStatus = data.maritalStatus || { ...defaults };
    data.driversLicense = data.driversLicense || { ...defaults };
    data.availabilityStatus = data.availabilityStatus || { ...defaults };
    data.summary = data.summary || { ...defaults };

    user.value = data;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    showToast("Profil konnte nicht geladen werden.", { type: "error" });
  } finally {
    isLoading.value = false;
  }
}

async function saveProfile() {
  isSaving.value = true;
  try {
    // Basic fields - explicit payload construction for type safety
    const payload: Partial<DbUser> = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      website: user.value.website,
      github: user.value.github,
      linkedin: user.value.linkedin,
      instagram: user.value.instagram,
      birthday: user.value.birthday,
      birthLocation: user.value.birthLocation,
      street: user.value.street,
      houseNumber: user.value.houseNumber,
      zipcode: user.value.zipcode,
      city: user.value.city,
      country: user.value.country,
      maritalStatus: user.value.maritalStatus,
      driversLicense: user.value.driversLicense,
      availabilityStatus: user.value.availabilityStatus,
      summary: user.value.summary,
    };

    await $fetch("/api/studio/profile", {
      method: "PUT",
      body: payload as Record<string, unknown>,
    });

    showToast("Profil erfolgreich aktualisiert!", { type: "success" });
  } catch (error) {
    console.error("Failed to save profile:", error);
    showToast("Fehler beim Speichern des Profils.", { type: "error" });
  } finally {
    isSaving.value = false;
  }
}

const formatDateForInput = (date: string | Date | null | undefined) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44"
  >
    <div class="mb-8 flex flex-col gap-8">
      <UiSectionHeader
        :level="1"
        title="Profil & Lebenslauf"
        subtitle="Verwalte deine Stammdaten, Kurse und weitere Infos."
        symbol="heroicons:user-circle"
      />
    </div>

    <!-- Tabs -->
    <div
      class="mb-8 flex flex-wrap gap-4 border-b border-primary-200 dark:border-primary-800"
    >
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'basics'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'basics'"
      >
        Stammdaten
      </button>
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'skills'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'skills'"
      >
        Skills
      </button>
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'languages'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'languages'"
      >
        Sprachen
      </button>
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'interests'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'interests'"
      >
        Interessen
      </button>
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'timeline'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'timeline'"
      >
        Werdegang
      </button>
      <button
        class="border-b-2 px-4 py-2 font-bold transition-colors"
        :class="
          activeTab === 'courses'
            ? 'border-secondary-500 text-secondary-500'
            : 'border-transparent text-primary-500 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-200'
        "
        @click="activeTab = 'courses'"
      >
        Kurse & Zertifikate
      </button>
    </div>

    <div v-if="!isLoading">
      <!-- TAB: BASICS -->
      <div v-show="activeTab === 'basics'" class="space-y-8">
        <!-- Contact & Links -->
        <UiCard
          class="border-secondary-500/10 shadow-xl shadow-secondary-500/5"
        >
          <UiCardContainer class="space-y-8 p-8 md:p-10">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Kontakt
                </h3>
                <UiInput
                  id="profile-name"
                  v-model="user.name"
                  label="Anzeigename"
                  placeholder="Dein Name"
                  required
                />
                <UiInput
                  id="profile-email"
                  v-model="user.email"
                  type="email"
                  label="E-Mail Adresse"
                  placeholder="beispiel@domain.de"
                  required
                />
                <UiInput
                  id="profile-phone"
                  v-model="user.phone"
                  label="Telefon"
                  placeholder="+49 ..."
                />
              </div>

              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Links & Social
                </h3>
                <UiInput
                  id="profile-website"
                  v-model="user.website"
                  label="Website"
                  placeholder="domain.de"
                />
                <UiInput
                  id="profile-github"
                  v-model="user.github"
                  label="GitHub"
                  placeholder="github.com/username"
                />
                <UiInput
                  id="profile-linkedin"
                  v-model="user.linkedin"
                  label="LinkedIn"
                  placeholder="linkedin.com/in/username"
                />
                <UiInput
                  id="profile-instagram"
                  v-model="user.instagram"
                  label="Instagram"
                  placeholder="instagram.com/username"
                />
              </div>
            </div>
          </UiCardContainer>
        </UiCard>

        <!-- Personal Information -->
        <UiCard
          class="border-secondary-500/10 shadow-xl shadow-secondary-500/5"
        >
          <UiCardContainer class="space-y-8 p-8 md:p-10">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Persönlich
                </h3>
                <UiInput
                  id="profile-birthday"
                  :model-value="formatDateForInput(user.birthday)"
                  type="date"
                  label="Geburtsdatum"
                  @update:model-value="
                    (val) => (user.birthday = val ? new Date(val) : null)
                  "
                />
                <UiInput
                  id="profile-birthlocation"
                  v-model="user.birthLocation"
                  label="Geburtsort"
                />

                <div class="grid grid-cols-2 gap-4">
                  <UiInput
                    id="profile-marital-de"
                    v-model="user.maritalStatus!.de"
                    label="Familienstand (DE)"
                  />
                  <UiInput
                    id="profile-marital-en"
                    v-model="user.maritalStatus!.en"
                    label="Familienstand (EN)"
                  />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <UiInput
                    id="profile-drivers-de"
                    v-model="user.driversLicense!.de"
                    label="Führerschein (DE)"
                  />
                  <UiInput
                    id="profile-drivers-en"
                    v-model="user.driversLicense!.en"
                    label="Führerschein (EN)"
                  />
                </div>
              </div>

              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Status & Summary
                </h3>
                <div class="grid grid-cols-1 gap-4">
                  <UiInput
                    id="profile-availability-de"
                    v-model="user.availabilityStatus!.de"
                    label="Verfügbarkeit (DE)"
                  />
                  <UiInput
                    id="profile-availability-en"
                    v-model="user.availabilityStatus!.en"
                    label="Verfügbarkeit (EN)"
                  />
                </div>
                <div class="space-y-4">
                  <label
                    class="block text-sm font-bold text-primary-700 dark:text-primary-300"
                    >Zusammenfassung (Hero Summary)</label
                  >
                  <textarea
                    v-model="user.summary!.de"
                    rows="3"
                    class="w-full rounded-xl border border-primary-200 bg-white p-3 dark:border-primary-800 dark:bg-primary-900"
                    placeholder="DE: Kurzinfo für den Hero Bereich"
                  ></textarea>
                  <textarea
                    v-model="user.summary!.en"
                    rows="3"
                    class="w-full rounded-xl border border-primary-200 bg-white p-3 dark:border-primary-800 dark:bg-primary-900"
                    placeholder="EN: Summary for Hero section"
                  ></textarea>
                </div>
              </div>
            </div>
          </UiCardContainer>
        </UiCard>

        <!-- Address -->
        <UiCard
          class="border-secondary-500/10 shadow-xl shadow-secondary-500/5"
        >
          <UiCardContainer class="space-y-8 p-8 md:p-10">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Anschrift
                </h3>
                <div class="grid grid-cols-3 gap-4">
                  <UiInput
                    id="profile-street"
                    v-model="user.street"
                    class="col-span-2"
                    label="Straße"
                  />
                  <UiInput
                    id="profile-hnr"
                    v-model="user.houseNumber"
                    label="Nr."
                  />
                </div>
                <div class="grid grid-cols-3 gap-4">
                  <UiInput
                    id="profile-zip"
                    v-model="user.zipcode"
                    label="PLZ"
                  />
                  <UiInput
                    id="profile-city"
                    v-model="user.city"
                    class="col-span-2"
                    label="Stadt"
                  />
                </div>
              </div>
              <div class="space-y-6">
                <h3
                  class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500"
                >
                  Land
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <UiInput
                    id="profile-country-de"
                    v-model="user.country!.de"
                    label="Land (DE)"
                  />
                  <UiInput
                    id="profile-country-en"
                    v-model="user.country!.en"
                    label="Land (EN)"
                  />
                </div>
              </div>
            </div>
          </UiCardContainer>
        </UiCard>

        <!-- Actions -->
        <div class="flex justify-end pb-20 pt-4">
          <UiButton
            size="lg"
            variant="secondary"
            class="min-w-[200px]"
            :is-loading="isSaving"
            @click="saveProfile"
          >
            {{ isSaving ? "Speichern..." : "Änderungen speichern" }}
          </UiButton>
        </div>
      </div>

      <!-- TAB: SKILLS -->
      <div v-show="activeTab === 'skills'">
        <StudioProfileSkillList />
      </div>

      <!-- TAB: LANGUAGES -->
      <div v-show="activeTab === 'languages'">
        <StudioProfileLanguageList />
      </div>

      <!-- TAB: INTERESTS -->
      <div v-show="activeTab === 'interests'">
        <StudioProfileInterestList />
      </div>

      <!-- TAB: TIMELINE -->
      <div v-show="activeTab === 'timeline'">
        <StudioProfileTimelineList />
      </div>

      <!-- TAB: COURSES -->
      <div v-show="activeTab === 'courses'">
        <StudioProfileCourseList />
      </div>
    </div>

    <div v-else class="flex justify-center py-20">
      <div
        class="h-12 w-12 animate-spin rounded-full border-4 border-secondary-500 border-t-transparent"
      ></div>
    </div>
  </div>
</template>
