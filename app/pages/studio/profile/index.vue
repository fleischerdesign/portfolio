<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DbUser } from '#shared/schemas/user.schema';

definePageMeta({
  middleware: 'authorize',
  ability: isAdmin,
  layout: 'default'
});

const { showToast } = useToast();

const user = ref<Partial<DbUser>>({});
const isLoading = ref(true);
const isSaving = ref(false);

async function fetchProfile() {
  isLoading.value = true;
  try {
    const response = await $fetch<{ user: DbUser }>('/api/studio/profile');
    user.value = response.user;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    showToast('Profil konnte nicht geladen werden.', { type: 'error' });
  } finally {
    isLoading.value = false;
  }
}

async function saveProfile() {
  isSaving.value = true;
  try {
    const payload = {
      name: user.value.name,
      email: user.value.email,
      phone: user.value.phone,
      website: user.value.website,
      github: user.value.github,
      linkedin: user.value.linkedin,
      instagram: user.value.instagram,
    };

    await $fetch('/api/studio/profile', {
      method: 'PUT',
      body: payload
    });

    showToast('Profil erfolgreich aktualisiert!', { type: 'success' });
  } catch (error) {
    console.error('Failed to save profile:', error);
    showToast('Fehler beim Speichern des Profils.', { type: 'error' });
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});
</script>

<template>
  <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
    <div class="mb-12 flex flex-col gap-8">
        <UiSectionHeader 
            :level="1" 
            title="Profil & Stammdaten" 
            subtitle="Verwalte deine persönlichen Informationen und Kontaktmöglichkeiten." 
            symbol="heroicons:user-circle" 
        />
    </div>

    <UiCard v-if="!isLoading" class="border-secondary-500/10 shadow-xl shadow-secondary-500/5">
        <UiCardContainer class="space-y-8 p-8 md:p-10">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div class="space-y-6">
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500">Allgemein</h3>
                    <UiInput id="profile-name" v-model="user.name" label="Anzeigename" placeholder="Dein Name" required />
                    <UiInput id="profile-email" v-model="user.email" label="E-Mail Adresse" type="email" placeholder="beispiel@domain.de" required />
                    <UiInput id="profile-phone" v-model="user.phone" label="Telefon" placeholder="+49 ..." />
                </div>

                <div class="space-y-6">
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-secondary-500">Links & Social</h3>
                    <UiInput id="profile-website" v-model="user.website" label="Website" placeholder="domain.de" />
                    <UiInput id="profile-github" v-model="user.github" label="GitHub" placeholder="github.com/username" />
                    <UiInput id="profile-linkedin" v-model="user.linkedin" label="LinkedIn" placeholder="linkedin.com/in/username" />
                    <UiInput id="profile-instagram" v-model="user.instagram" label="Instagram" placeholder="instagram.com/username" />
                </div>
            </div>

            <div class="flex justify-end pt-4">
                <UiButton :is-loading="isSaving" variant="secondary" size="lg" class="min-w-[200px]" @click="saveProfile">
                    {{ isSaving ? 'Speichern...' : 'Änderungen speichern' }}
                </UiButton>
            </div>
        </UiCardContainer>
    </UiCard>

    <div v-else class="flex justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-4 border-secondary-500 border-t-transparent"></div>
    </div>
  </div>
</template>
