<script setup lang="ts">
import { personalData } from '~/data/personal.data';
import { languagesData } from '~/data/languages.data';
import { interestsData } from '~/data/interests.data';
import { contactData } from '~/data/contact.data';
import { timelineData } from '~/data/timeline.data';
import { coursesData } from '~/data/courses.data';
import { softSkillsData } from '~/data/softSkills.data';
import { techStackData } from '~/data/techStack.data';
import type { ApplicationResponsePayload } from '#shared/schemas/application.schema';

definePageMeta({
  layout: 'print',
  middleware: 'authorize',
  ability: isAdmin,
  colorMode: 'light',
});

const { t, locale } = useI18n();
const route = useRoute();
const { slug } = route.params as { slug: string };

const { data: application, error } = await useFetch<ApplicationResponsePayload>(`/api/applications/${slug}`);

if (error.value || !application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found', fatal: true });
}

const personal = personalData(t);
const languages = languagesData(t);
const interests = interestsData(t);
const contact = contactData;
const timeline = timelineData(t);
const courses = coursesData;
const softSkills = softSkillsData(t);
const techStack = techStackData;

const { renderMarkdown } = useMarkdown();
const { getDisplayDate } = useApplicationUtils();

const printDate = computed(() => {
  return getDisplayDate(application.value);
});


const { getSalutation, formatName } = useSalutation();

const salutation = computed(() => {
  return getSalutation(application.value?.contacts, { format: 'lastname', multiple: 'individual' });
});

const formattedContactNames = computed(() => {
  if (!application.value?.contacts || application.value.contacts.length === 0) {
    return '';
  }
  return application.value.contacts.map(c => formatName(c, 'full')).join(', ');
});

const { data: projectsData } = await useFetch('/api/projects', {
  query: { locale: locale.value }
});
const projects = computed(() => projectsData.value?.projects || []);
</script>

<template>
  <div class="pdf-resume-container font-sans text-neutral-900 print:bg-neutral-100">

    <!-- ==================== PAGE 1: COVER ==================== -->
    <div class="cover-page relative flex h-[371mm] w-full flex-col justify-between overflow-hidden p-[25mm]">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/20 blur-[100px] print:block"></div>
      <div class="absolute bottom-0 right-0 h-[500px] w-[500px] bg-gradient-to-t from-secondary-100/30 to-transparent blur-3xl print:block"></div>

      <div class="relative z-10 flex h-full flex-col items-center justify-center gap-16">
        
        <!-- Profile Card -->
        <UiCard class="relative h-[400px] w-[400px] overflow-hidden rounded-full border-4 border-white/50 shadow-2xl print:shadow-none">
          <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
        </UiCard>

        <!-- Title & Name -->
        <div class="space-y-6 text-center">
           <UiSectionHeader 
             :level="1" 
             :title="personal.name" 
             :subtitle="personal.subtitle" 
             variant="nebula"
             class="!mb-0"
           >
             <template #prefix>
                <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-secondary-200/50 bg-secondary-100 text-secondary-600 shadow-sm">
                    <Icon 
                        name="logo:fleischerdesign" 
                        size="40" 
                        mode="svg"
                        class="[&_*]:!fill-current"
                    />
                </div>
             </template>
           </UiSectionHeader>
           <div class="mx-auto h-1 w-32 rounded-full bg-secondary-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>

        <!-- Contact Grid -->
        <UiCard class="w-full max-w-2xl border-neutral-200/50 bg-white/60 shadow-lg backdrop-blur-md print:shadow-none">
          <UiCardContainer class="grid grid-cols-2 gap-x-8 gap-y-6 p-8">
             <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                  <Icon name="heroicons:envelope" size="20" />
                </div>
                <span class="text-sm font-medium">{{ contact.email }}</span>
             </div>
             <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                  <Icon name="heroicons:phone" size="20" />
                </div>
                <span class="text-sm font-medium">{{ contact.phone }}</span>
             </div>
             <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                  <Icon name="heroicons:globe-alt" size="20" />
                </div>
                <span class="text-sm font-medium">{{ contact.website.replace('https://', '') }}</span>
             </div>
             <div class="flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600">
                  <Icon name="heroicons:map-pin" size="20" />
                </div>
                <span class="text-sm font-medium">{{ personal.address.city }}, {{ personal.address.country }}</span>
             </div>
          </UiCardContainer>
        </UiCard>

      </div>
    </div>

    <!-- ==================== PAGE 2: LETTER ==================== -->
    <div class="main-content-pages relative flex h-[371mm] flex-col overflow-hidden px-[25mm] pb-[25mm] pt-[25mm]">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/10 blur-[100px] print:block"></div>
      <div class="absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-secondary-500/5 blur-[80px] print:block"></div>

      <!-- Address & Date Header (DIN 5008 style) -->
      <div v-if="application && application.company" class="relative z-10 mb-20 flex items-start justify-between">
        
        <!-- Address Block -->
        <div class="space-y-1">
          <!-- Sender Line (Small above address) -->
          <div class="mb-2 inline-block text-[9px] font-black uppercase tracking-[0.2em] text-secondary-600">
             Philipp Fleischer <span class="mx-0.5">•</span> Hufelandstr. 55 <span class="mx-0.5">•</span> 17036 Neubrandenburg
          </div>
          
          <!-- Recipient -->
          <div class="pt-2">
            <p class="text-lg font-bold text-neutral-900">{{ application.company.name }}</p>
            <p v-if="formattedContactNames" class="text-neutral-600">{{ formattedContactNames }}</p>
            <div v-if="application.company.address" class="text-neutral-600">
              <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
              <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
            </div>
          </div>
        </div>

        <!-- Date Block -->
        <div class="pt-8 text-right">
          <p class="font-medium text-neutral-500">Neubrandenburg, {{ printDate }}</p>
        </div>
      </div>

      <!-- Content Card -->
      <div class="relative z-10 flex flex-grow flex-col">
         <!-- Document Background Glow -->
         <div class="absolute -inset-4 -z-10 rounded-3xl bg-secondary-500/5 blur-2xl"></div>
         
         <div class="flex-grow bg-transparent">
             
             <!-- Subject -->
             <div class="mb-10">
               <UiSectionHeader 
                  v-if="application" 
                  :level="2" 
                  :title="application.title" 
                  :subtitle="application.subtitle" 
                  variant="none"
                  class="!mb-0"
               />
               <!-- Luminous Accent Line -->
               <div class="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
             </div>

             <!-- Body -->
             <div class="text-base leading-relaxed text-neutral-800">
               <p class="mb-6 text-lg font-bold">
                  {{ salutation }},
               </p>
               
               <!-- eslint-disable-next-line vue/no-v-html -->
               <div v-if="application" class="prose prose-neutral max-w-none prose-p:leading-relaxed prose-li:marker:text-secondary-500" v-html="renderMarkdown(application.body || '')" />
               
               <div class="mt-16">
                  <p class="mb-6 font-medium">Mit freundlichen Grüßen,</p>
                  <p class="mb-2 text-lg font-bold">Philipp Fleischer</p>
                  <!-- Colorized Signature using Mask -->
                  <div 
                    class="h-20 w-64 bg-secondary-700 print:bg-secondary-700" 
                    style="-webkit-mask-image: url('/img/signature.png'); -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: left center; mask-image: url('/img/signature.png'); mask-size: contain; mask-repeat: no-repeat; mask-position: left center;"
                  ></div>
               </div>
             </div>
         </div>
      </div>

      <ResumeFooter :current-page="1" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>
    
    <!-- ==================== PAGE 3: RESUME PART 1 ==================== -->
    <div class="main-content-pages relative flex h-[371mm] flex-col gap-6 overflow-hidden p-[25mm]">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/10 blur-[100px] print:block"></div>
      <div class="absolute -left-32 bottom-1/4 h-80 w-80 rounded-full bg-secondary-500/5 blur-[80px] print:block"></div>

      <!-- Header -->
      <div class="mb-2 flex flex-col">
        <UiSectionHeader
          :title="$t('about.overview.resume.title')"
          variant="none"
          class="!mb-0"
        />
        <!-- Luminous Accent Line -->
        <div class="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
      </div>

      <div class="grid h-full grid-cols-12 gap-6">
        
        <!-- Left Column (Personal, Skills, Languages) -->
        <div class="col-span-4 flex flex-col gap-5">
          
          <!-- Profile & Personal Card -->
          <UiCard class="overflow-hidden border-neutral-200/60 shadow-none">
             <!-- Profile Image: Modern Rectangular -->
             <div class="relative h-64 w-full">
                <img src="/img/profile.jpg" alt="Profile" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
             </div>
             
             <UiCardContainer class="relative z-10 -mt-8 px-5 pb-5">
                <h3 class="mb-4 text-xl font-black tracking-tight text-neutral-900">{{ personal.name }}</h3>
                
                <div class="space-y-3 text-sm text-neutral-600">
                   <div class="flex flex-col">
                      <span class="mb-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">{{ $t('resume.details.birthday') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.birth.date }} <span class="mx-1 text-secondary-400">•</span> {{ personal.birth.location }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="mb-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">{{ $t('resume.details.marital_status_label') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.maritalStatus }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="mb-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">{{ $t('resume.details.drivers_license_label') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.driversLicense }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="mb-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-400">{{ $t('home.contact.title') }}</span>
                      <div class="flex items-center gap-2">
                         <Icon name="heroicons:envelope" size="14" class="text-secondary-500" />
                         <span class="font-medium text-neutral-800">{{ contact.email }}</span>
                      </div>
                      <div class="mt-1 flex items-center gap-2">
                         <Icon name="heroicons:phone" size="14" class="text-secondary-500" />
                         <span class="font-medium text-neutral-800">{{ contact.phone }}</span>
                      </div>
                   </div>
                </div>
             </UiCardContainer>
          </UiCard>

          <!-- Languages -->
          <UiCard class="border-neutral-200/60 shadow-none">
             <UiCardContainer class="p-5">
               <div class="mb-4 flex items-center gap-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                     <Icon name="heroicons:language" size="20" />
                  </div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">{{ $t('languages.title') }}</h3>
               </div>
               <div class="grid grid-cols-1 gap-3">
                 <div v-for="lang in languages" :key="lang.name" class="flex flex-col gap-1">
                   <div class="flex items-center justify-between">
                     <span class="text-sm font-bold text-neutral-800">{{ lang.name }}</span>
                     <span class="text-[10px] font-black uppercase tracking-wider text-secondary-600">{{ lang.level }}</span>
                   </div>
                   <div class="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div class="h-full rounded-full bg-secondary-400" :style="{ width: lang.score + '%' }"></div>
                   </div>
                 </div>
               </div>
             </UiCardContainer>
          </UiCard>

          <!-- Soft Skills -->
          <UiCard class="flex-grow border-neutral-200/60 shadow-none">
             <UiCardContainer class="p-5">
               <div class="mb-4 flex items-center gap-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                     <Icon name="heroicons:sparkles" size="20" />
                  </div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Softskills</h3>
               </div>
               <TechstackList :items="softSkills" :scroll="false" :gradient="true" size="sm" hide-icons />
             </UiCardContainer>
          </UiCard>

        </div>

        <!-- Right Column (Summary, Tech Stack, Projects) -->
        <div class="col-span-8 flex flex-col gap-5">
          
          <!-- Summary -->
          <UiCard class="border-neutral-200/60 shadow-none">
             <UiCardContainer class="p-6">
                <div class="mb-4 flex items-center gap-4">
                   <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                      <Icon name="heroicons:user-circle" size="20" />
                   </div>
                   <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Zusammenfassung</h3>
                </div>
                <p class="text-sm font-medium italic leading-relaxed text-neutral-700">"{{ t("home.hero.summary") }}"</p>
             </UiCardContainer>
          </UiCard>

          <!-- Tech Stack -->
          <UiCard class="border-neutral-200/60 shadow-none">
             <UiCardContainer class="p-6">
                <div class="mb-4 flex items-center gap-4">
                   <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                      <Icon name="heroicons:cpu-chip" size="20" />
                   </div>
                   <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">{{ $t('home.overview.techstack.title') }}</h3>
                </div>
                <TechstackList :items="techStack" :scroll="false" :gradient="true" size="sm" />
             </UiCardContainer>
          </UiCard>

          <!-- Projects -->
          <div class="flex flex-grow flex-col">
             <div class="mb-4 flex items-center gap-4 px-1">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                   <Icon name="heroicons:presentation-chart-bar" size="20" />
                </div>
                <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Ausgewählte Projekte</h3>
             </div>
             <div class="grid grid-cols-1 gap-3">
               <div v-for="project in projects.slice(0,3)" :key="project.slug" class="group flex items-center gap-4 rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm transition-all hover:border-secondary-200 hover:shadow-md">
                  <div class="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50">
                     <img v-if="project.image" :src="typeof project.image === 'string' ? project.image : project.image.src" class="h-full w-full object-cover opacity-30 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0" />
                     <div class="absolute inset-0 flex items-center justify-center">
                        <Icon :name="project.icon || 'heroicons:folder'" mode="svg" class="text-secondary-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] [&_*]:!fill-current" size="24" />
                     </div>
                  </div>
                  <div class="flex-grow">
                     <h4 class="text-sm font-black tracking-tight text-neutral-900">{{ project.title }}</h4>
                     <p class="mt-0.5 line-clamp-1 text-xs text-neutral-500">{{ project.subtitle }}</p>
                  </div>
                  <div class="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-secondary-400 opacity-0 transition-opacity group-hover:opacity-100">
                     Details <Icon name="heroicons:arrow-right" size="10" />
                  </div>
               </div>
             </div>
             
             <div class="mx-auto mt-4 flex w-fit items-center gap-2 rounded-full border border-secondary-100 bg-secondary-50/50 px-3 py-1.5 text-[10px] font-medium text-secondary-500">
                <Icon name="heroicons:cursor-arrow-rays" size="12" />
                <span>Mehr Projekte auf <span class="font-black">fleischer.design/projects</span></span>
             </div>
          </div>

        </div>
      </div>

      <ResumeFooter :current-page="2" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>

    <!-- ==================== PAGE 4: RESUME PART 2 ==================== -->
    <div class="main-content-pages relative flex h-[371mm] break-inside-avoid-page flex-col gap-6 overflow-hidden p-[25mm]">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary-400/10 blur-[100px] print:block"></div>
      <div class="absolute bottom-0 right-0 h-[500px] w-[500px] bg-gradient-to-t from-secondary-100/20 to-transparent blur-3xl print:block"></div>

      <div class="grid h-full grid-cols-12 gap-8 pt-4">
         
         <!-- Left Column (Interests, Courses) -->
         <div class="col-span-4 flex flex-col gap-6">
            
            <!-- Interests -->
            <UiCard class="border-neutral-200/60 shadow-none">
              <UiCardContainer class="p-6">
                 <div class="mb-4 flex items-center gap-4">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                       <Icon name="heroicons:heart" size="20" />
                    </div>
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">{{ $t('interests.title') }}</h3>
                 </div>
                 <ul class="space-y-4 text-xs">
                   <li v-for="(items, key) in interests" :key="key">
                      <span class="mb-1 block text-[10px] font-black uppercase tracking-wider text-secondary-500">{{ $t(`interests.${key}.title`) }}</span>
                      <p class="font-medium leading-relaxed text-neutral-700">{{ items.join(', ') }}</p>
                   </li>
                 </ul>
              </UiCardContainer>
            </UiCard>

            <!-- Courses -->
            <UiCard class="border-neutral-200/60 shadow-none">
              <UiCardContainer class="p-6">
                 <div class="mb-4 flex items-center gap-4">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                       <Icon name="heroicons:academic-cap" size="20" />
                    </div>
                    <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Kurse</h3>
                 </div>
                 <div class="space-y-3">
                    <div v-for="(skill) in courses.slice(0, 5)" :key="skill.title" class="flex flex-col rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
                       <h4 class="text-sm font-bold leading-tight text-neutral-900">{{ skill.title }}</h4>
                       <div class="mt-2.5 flex flex-col gap-2">
                          <div class="flex">
                             <span class="whitespace-nowrap rounded-md border border-secondary-100 bg-secondary-50 px-2 py-0.5 text-[10px] font-bold text-secondary-600">
                                {{ skill.date }}
                             </span>
                          </div>
                          <span class="text-[11px] font-medium leading-tight text-neutral-400">
                             {{ skill.teacher.join(', ') }}
                          </span>
                       </div>
                    </div>
                 </div>
              </UiCardContainer>
            </UiCard>

         </div>

         <!-- Right Column (Timeline) -->
         <div class="col-span-8 flex flex-col gap-6">
            
            <!-- Education -->
            <div class="flex flex-col">
               <div class="mb-3 flex items-center gap-4 px-1">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                     <Icon name="heroicons:book-open" size="20" />
                  </div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">Bildungsweg</h3>
               </div>
               <BaseTimeline :items="timeline.filter(item => item.type === 'education').splice(0, 4)" :is-print-view="true" compact />
            </div>

            <!-- Career -->
            <div class="flex flex-grow flex-col">
               <div class="mb-3 flex items-center gap-4 px-1">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-secondary-200/50 bg-secondary-100 text-secondary-600">
                     <Icon name="heroicons:briefcase" size="20" />
                  </div>
                  <h3 class="text-sm font-black uppercase tracking-[0.2em] text-neutral-900">{{ $t('about.overview.careerPath.title') }}</h3>
               </div>
               <BaseTimeline :items="timeline.filter(item => item.type === 'career')" :is-print-view="true" compact />
            </div>

         </div>

      </div>

      <ResumeFooter :current-page="3" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>

  </div>
</template>

<style scoped>
/* Ensure background colors and shadows are printed */
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  /* Ensure proper page breaks */
  .cover-page,
  .main-content-pages {
    break-after: always;
    page-break-after: always;
  }
  
  .main-content-pages:last-child {
    break-after: avoid;
    page-break-after: avoid;
  }
}
</style>