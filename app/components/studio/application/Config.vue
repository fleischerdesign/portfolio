<script setup lang="ts">
import type { ApplicationUpdatePayload } from "#shared/schemas/application.schema";
import type { CompanyResponse } from "#shared/schemas/company.schema";
import type { ContactResponse } from "#shared/schemas/contact.schema";

const props = defineProps<{
  modelValue: any; // Should be EditableApplication
  allCompanies: CompanyResponse[];
  allContacts: ContactResponse[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ApplicationUpdatePayload): void;
  (e: "create-contact", name: string): void;
  (e: "edit-address"): void;
}>();

const application = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <UiCard class="border-secondary-500/10 shadow-xl shadow-secondary-500/5">
    <UiCardContainer class="p-8 md:p-10">
      <div class="mb-10 flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400"
        >
          <Icon name="heroicons:adjustments-horizontal" size="24" />
        </div>
        <div>
          <h3 class="text-2xl font-black text-primary-900 dark:text-white">
            {{ $t("applications.detail.config.title") }}
          </h3>
          <p class="text-xs font-medium text-primary-500">
            {{ $t("applications.detail.config.subtitle") }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        <!-- General Info -->
        <div class="space-y-8">
          <div class="flex items-center gap-2">
            <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              {{ $t("applications.detail.config.general") }}
            </p>
          </div>
          <div class="space-y-6">
            <UiInput
              id="edit-title"
              v-model="application.title"
              :label="$t('applications.detail.config.title_label')"
              required
              class="dashboard-input"
            />
            <UiInput
              id="edit-subtitle"
              v-model="application.subtitle"
              :label="$t('applications.detail.config.subtitle_label')"
              class="dashboard-input"
            />
            <UiInput
              id="edit-url"
              v-model="application.url"
              :label="$t('applications.detail.config.url_label')"
              class="dashboard-input"
            />
          </div>
        </div>

        <!-- Company Info -->
        <div
          class="space-y-8 border-primary-100 md:border-l md:pl-10 dark:border-primary-800"
        >
          <div class="flex items-center gap-2">
            <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              {{ $t("applications.detail.config.company") }}
            </p>
          </div>
          <div class="space-y-6">
            <UiSelect
              id="company-select"
              v-model="application.selectedCompany"
              :options="allCompanies"
              :label="$t('applications.detail.config.select_company')"
              by="id"
            >
              <template #display="{ option }">{{ option.name }}</template>
              <template #option="{ option }">{{ option.name }}</template>
            </UiSelect>

            <div
              v-if="application.selectedCompany?.address"
              class="group/addr relative rounded-2xl border border-primary-100 bg-primary-50/50 p-5 transition-colors hover:bg-white dark:border-primary-800 dark:bg-primary-900/50 dark:hover:bg-primary-900"
            >
              <div class="flex items-start justify-between">
                <div class="text-sm">
                  <p class="font-bold text-primary-900 dark:text-white">
                    {{ application.selectedCompany.name }}
                  </p>
                  <p class="mt-1 text-primary-500">
                    {{ application.selectedCompany.address.street }}
                    {{ application.selectedCompany.address.houseNumber }}
                  </p>
                  <p class="text-primary-500">
                    {{ application.selectedCompany.address.zipcode }}
                    {{ application.selectedCompany.address.city }}
                  </p>
                </div>
                <UiButton
                  size="sm"
                  variant="ghost"
                  class="h-8 w-8 rounded-xl !p-1 opacity-0 transition-opacity group-hover/addr:opacity-100"
                  @click="emit('edit-address')"
                >
                  <Icon name="mdi:pencil" class="h-4 w-4" />
                </UiButton>
              </div>
            </div>
            <UiButton
              v-else
              variant="ghost"
              size="sm"
              class="w-full border-dashed border-primary-200"
              @click="emit('edit-address')"
            >
              <Icon name="heroicons:map-pin" class="mr-2 h-4 w-4" />
              {{ $t("applications.detail.config.address_add") }}
            </UiButton>
          </div>
        </div>

        <!-- Contacts -->
        <div
          class="space-y-8 border-primary-100 lg:border-l lg:pl-10 dark:border-primary-800"
        >
          <div class="flex items-center gap-2">
            <div class="h-1 w-4 rounded-full bg-secondary-500"></div>
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              {{ $t("applications.detail.config.contacts") }}
            </p>
          </div>
          <UiSelect
            id="contact-select"
            v-model="application.selectedContacts"
            :options="allContacts"
            :label="$t('applications.detail.config.link_contacts')"
            by="id"
            multiple
            creatable
            @create="(name) => emit('create-contact', name)"
          >
            <template #display="{ option }">
              {{ option.name }}
              <span v-if="option.companyId" class="ml-1 opacity-50"
                >({{
                  allCompanies.find((c) => c.id === option.companyId)?.name
                }})</span
              >
            </template>
            <template #option="{ option }">
              {{ option.name }}
              <span v-if="option.companyId" class="ml-1 text-xs opacity-50"
                >({{
                  allCompanies.find((c) => c.id === option.companyId)?.name
                }})</span
              >
            </template>
          </UiSelect>
        </div>
      </div>
    </UiCardContainer>
  </UiCard>
</template>
