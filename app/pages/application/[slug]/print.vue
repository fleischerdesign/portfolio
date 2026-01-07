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
const { formatDate, getDisplayDate } = useApplicationUtils();

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

const { data: projects } = await useAsyncData(`projects-resume-${locale.value}`, () =>
  queryCollection('projects')
    .where('locale', '=', locale.value)
    .select('title', 'subtitle', 'slug', 'image', 'icon')
    .all()
);
</script>

<template>
  <div class="pdf-resume-container text-neutral-900 font-sans print:bg-neutral-100">

    <!-- ==================== PAGE 1: COVER ==================== -->
    <div class="cover-page flex h-[371mm] w-full flex-col justify-between p-[25mm] relative overflow-hidden">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-secondary-400/20 rounded-full blur-[100px] print:block"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-secondary-100/30 to-transparent blur-3xl print:block"></div>

      <div class="relative z-10 flex flex-col h-full justify-center items-center gap-16">
        
        <!-- Profile Card -->
        <UiCard class="relative h-[400px] w-[400px] overflow-hidden rounded-full shadow-2xl border-4 border-white/50 print:shadow-none">
          <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
        </UiCard>

        <!-- Title & Name -->
        <div class="text-center space-y-6">
           <UiSectionHeader 
             :level="1" 
             symbol="logo:fleischerdesign" 
             :title="personal.name" 
             :subtitle="personal.subtitle" 
             variant="nebula"
             class="!mb-0"
           />
           <div class="h-1 w-32 bg-secondary-500 mx-auto rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>

        <!-- Contact Grid -->
        <UiCard class="w-full max-w-2xl backdrop-blur-md bg-white/60 border-neutral-200/50 shadow-lg print:shadow-none">
          <UiCardContainer class="grid grid-cols-2 gap-y-6 gap-x-8 p-8">
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
    <div class="main-content-pages relative h-[371mm] px-[25mm] pb-[25mm] pt-[45mm] flex flex-col overflow-hidden">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-secondary-400/10 rounded-full blur-[100px] print:block"></div>
      <div class="absolute bottom-1/4 -right-32 w-80 h-80 bg-secondary-500/5 rounded-full blur-[80px] print:block"></div>

      <!-- Address & Date Header (DIN 5008 style) -->
      <div v-if="application && application.company" class="flex justify-between items-start mb-20 relative z-10">
        
        <!-- Address Block -->
        <div class="space-y-1">
          <!-- Sender Line (Small above address) -->
          <div class="text-[9px] uppercase tracking-[0.2em] font-black text-secondary-600 mb-2 inline-block">
             Philipp Fleischer <span class="mx-0.5">•</span> Hufelandstr. 55 <span class="mx-0.5">•</span> 17036 Neubrandenburg
          </div>
          
          <!-- Recipient -->
          <div class="pt-2">
            <p class="font-bold text-lg text-neutral-900">{{ application.company.name }}</p>
            <p v-if="formattedContactNames" class="text-neutral-600">{{ formattedContactNames }}</p>
            <div v-if="application.company.address" class="text-neutral-600">
              <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
              <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
            </div>
          </div>
        </div>

        <!-- Date Block -->
        <div class="text-right pt-8">
          <p class="text-neutral-500 font-medium">Neubrandenburg, {{ printDate }}</p>
        </div>
      </div>

      <!-- Content Card -->
      <div class="flex-grow flex flex-col relative z-10">
         <!-- Document Background Glow -->
         <div class="absolute -inset-4 bg-secondary-500/5 rounded-3xl blur-2xl -z-10"></div>
         
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
               <p class="mb-6 font-bold text-lg">
                  {{ salutation }},
               </p>
               
               <!-- eslint-disable-next-line vue/no-v-html -->
               <div v-if="application" class="prose prose-neutral max-w-none prose-p:leading-relaxed prose-li:marker:text-secondary-500" v-html="renderMarkdown(application.body || '')" />
               
               <div class="mt-16">
                  <p class="mb-6 font-medium">Mit freundlichen Grüßen,</p>
                  <p class="font-bold text-lg mb-2">Philipp Fleischer</p>
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
    <div class="main-content-pages relative h-[371mm] p-[25mm] flex flex-col gap-6 overflow-hidden">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -top-32 -right-32 w-96 h-96 bg-secondary-400/10 rounded-full blur-[100px] print:block"></div>
      <div class="absolute bottom-1/4 -left-32 w-80 h-80 bg-secondary-500/5 rounded-full blur-[80px] print:block"></div>

      <!-- Header -->
      <div class="flex flex-col mb-2">
        <UiSectionHeader
          :title="$t('about.overview.resume.title')"
          variant="none"
          class="!mb-0"
        />
        <!-- Luminous Accent Line -->
        <div class="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
      </div>

      <div class="grid grid-cols-12 gap-6 h-full">
        
        <!-- Left Column (Personal, Skills, Languages) -->
        <div class="col-span-4 flex flex-col gap-5">
          
          <!-- Profile & Personal Card -->
          <UiCard class="shadow-none border-neutral-200/60 overflow-hidden">
             <!-- Profile Image: Modern Rectangular -->
             <div class="h-64 w-full relative">
                <img src="/img/profile.jpg" alt="Profile" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
             </div>
             
             <UiCardContainer class="px-5 pb-5 -mt-8 relative z-10">
                <h3 class="font-black text-xl text-neutral-900 tracking-tight mb-4">{{ personal.name }}</h3>
                
                <div class="space-y-3 text-sm text-neutral-600">
                   <div class="flex flex-col">
                      <span class="font-black text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">{{ $t('resume.details.birthday') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.birth.date }} <span class="text-secondary-400 mx-1">•</span> {{ personal.birth.location }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="font-black text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">{{ $t('resume.details.marital_status_label') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.maritalStatus }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="font-black text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">{{ $t('resume.details.drivers_license_label') }}</span>
                      <span class="font-medium text-neutral-800">{{ personal.driversLicense }}</span>
                   </div>
                   <div class="flex flex-col">
                      <span class="font-black text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">{{ $t('home.contact.title') }}</span>
                      <div class="flex items-center gap-2">
                         <Icon name="heroicons:envelope" size="14" class="text-secondary-500" />
                         <span class="font-medium text-neutral-800">{{ contact.email }}</span>
                      </div>
                      <div class="flex items-center gap-2 mt-1">
                         <Icon name="heroicons:phone" size="14" class="text-secondary-500" />
                         <span class="font-medium text-neutral-800">{{ contact.phone }}</span>
                      </div>
                   </div>
                </div>
             </UiCardContainer>
          </UiCard>

          <!-- Languages -->
          <UiCard class="shadow-none border-neutral-200/60">
             <UiCardContainer class="p-5">
               <div class="flex items-center gap-4 mb-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                     <Icon name="heroicons:language" size="20" />
                  </div>
                  <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">{{ $t('languages.title') }}</h3>
               </div>
               <div class="grid grid-cols-1 gap-3">
                 <div v-for="lang in languages" :key="lang.name" class="flex flex-col gap-1">
                   <div class="flex justify-between items-center">
                     <span class="text-sm font-bold text-neutral-800">{{ lang.name }}</span>
                     <span class="text-[10px] font-black uppercase text-secondary-600 tracking-wider">{{ lang.level }}</span>
                   </div>
                   <div class="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <div class="h-full bg-secondary-400 rounded-full" :style="{ width: lang.score + '%' }"></div>
                   </div>
                 </div>
               </div>
             </UiCardContainer>
          </UiCard>

          <!-- Soft Skills -->
          <UiCard class="shadow-none border-neutral-200/60 flex-grow">
             <UiCardContainer class="p-5">
               <div class="flex items-center gap-4 mb-4">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                     <Icon name="heroicons:sparkles" size="20" />
                  </div>
                  <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">Softskills</h3>
               </div>
               <TechstackList :items="softSkills" :scroll="false" :gradient="true" size="sm" hide-icons />
             </UiCardContainer>
          </UiCard>

        </div>

        <!-- Right Column (Summary, Tech Stack, Projects) -->
        <div class="col-span-8 flex flex-col gap-5">
          
          <!-- Summary -->
          <UiCard class="shadow-none border-neutral-200/60">
             <UiCardContainer class="p-6">
                <div class="flex items-center gap-4 mb-4">
                   <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                      <Icon name="heroicons:user-circle" size="20" />
                   </div>
                   <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">Zusammenfassung</h3>
                </div>
                <p class="text-sm leading-relaxed text-neutral-700 font-medium italic">"{{ t("home.hero.summary") }}"</p>
             </UiCardContainer>
          </UiCard>

          <!-- Tech Stack -->
          <UiCard class="shadow-none border-neutral-200/60">
             <UiCardContainer class="p-6">
                <div class="flex items-center gap-4 mb-4">
                   <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                      <Icon name="heroicons:cpu-chip" size="20" />
                   </div>
                   <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">{{ $t('home.overview.techstack.title') }}</h3>
                </div>
                <TechstackList :items="techStack" :scroll="false" :gradient="true" size="sm" />
             </UiCardContainer>
          </UiCard>

          <!-- Projects -->
          <div class="flex-grow flex flex-col">
             <div class="flex items-center gap-4 mb-4 px-1">
                <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                   <Icon name="heroicons:presentation-chart-bar" size="20" />
                </div>
                <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">Ausgewählte Projekte</h3>
             </div>
             <div class="grid grid-cols-1 gap-3">
               <div v-for="project in projects.slice(0,3)" :key="project.slug" class="group rounded-2xl border border-neutral-100 bg-white p-3 shadow-sm flex gap-4 items-center transition-all hover:border-secondary-200 hover:shadow-md">
                  <div class="h-14 w-14 flex-shrink-0 rounded-xl bg-neutral-50 overflow-hidden border border-neutral-100 relative">
                     <img v-if="project.image" :src="typeof project.image === 'string' ? project.image : project.image.src" class="h-full w-full object-cover grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                     <div class="absolute inset-0 flex items-center justify-center">
                        <Icon :name="project.icon || 'heroicons:folder'" mode="svg" class="[&_*]:!fill-current text-secondary-600 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size="24" />
                     </div>
                  </div>
                  <div class="flex-grow">
                     <h4 class="font-black text-sm text-neutral-900 tracking-tight">{{ project.title }}</h4>
                     <p class="text-xs text-neutral-500 line-clamp-1 mt-0.5">{{ project.subtitle }}</p>
                  </div>
                  <div class="text-[10px] font-black uppercase tracking-widest text-secondary-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     Details <Icon name="heroicons:arrow-right" size="10" />
                  </div>
               </div>
             </div>
             
             <div class="mt-4 mx-auto flex items-center gap-2 text-[10px] text-secondary-500 bg-secondary-50/50 px-3 py-1.5 rounded-full border border-secondary-100 font-medium w-fit">
                <Icon name="heroicons:cursor-arrow-rays" size="12" />
                <span>Mehr Projekte auf <span class="font-black">fleischer.design/projects</span></span>
             </div>
          </div>

        </div>
      </div>

      <ResumeFooter :current-page="2" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>

    <!-- ==================== PAGE 4: RESUME PART 2 ==================== -->
    <div class="main-content-pages relative h-[371mm] break-inside-avoid-page p-[25mm] flex flex-col gap-6 overflow-hidden">
      
      <!-- Decorative Background Elements -->
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-secondary-400/10 rounded-full blur-[100px] print:block"></div>
      <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-t from-secondary-100/20 to-transparent blur-3xl print:block"></div>

      <div class="grid grid-cols-12 gap-8 h-full pt-4">
         
         <!-- Left Column (Interests, Courses) -->
         <div class="col-span-4 flex flex-col gap-6">
            
            <!-- Interests -->
            <UiCard class="shadow-none border-neutral-200/60">
              <UiCardContainer class="p-6">
                 <div class="flex items-center gap-4 mb-4">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                       <Icon name="heroicons:heart" size="20" />
                    </div>
                    <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">{{ $t('interests.title') }}</h3>
                 </div>
                 <ul class="space-y-4 text-xs">
                   <li v-for="(items, key) in interests" :key="key">
                      <span class="block font-black text-[10px] uppercase tracking-wider text-secondary-500 mb-1">{{ $t(`interests.${key}.title`) }}</span>
                      <p class="text-neutral-700 font-medium leading-relaxed">{{ items.join(', ') }}</p>
                   </li>
                 </ul>
              </UiCardContainer>
            </UiCard>

            <!-- Courses -->
            <UiCard class="shadow-none border-neutral-200/60">
              <UiCardContainer class="p-6">
                 <div class="flex items-center gap-4 mb-4">
                    <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                       <Icon name="heroicons:academic-cap" size="20" />
                    </div>
                    <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">Kurse</h3>
                 </div>
                 <div class="space-y-3">
                    <div v-for="(skill, index) in courses.slice(0, 5)" :key="skill.title" class="flex flex-col rounded-xl border border-neutral-100 bg-neutral-50/50 p-3">
                       <h4 class="text-sm font-bold text-neutral-900 leading-tight">{{ skill.title }}</h4>
                       <div class="mt-2.5 flex flex-col gap-2">
                          <div class="flex">
                             <span class="text-[10px] font-bold text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded-md border border-secondary-100 whitespace-nowrap">
                                {{ skill.date }}
                             </span>
                          </div>
                          <span class="text-[11px] font-medium text-neutral-400 leading-tight">
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
               <div class="flex items-center gap-4 mb-3 px-1">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                     <Icon name="heroicons:book-open" size="20" />
                  </div>
                  <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">Bildungsweg</h3>
               </div>
               <BaseTimeline :items="timeline.filter(item => item.type === 'education').splice(0, 4)" :is-print-view="true" compact />
            </div>

            <!-- Career -->
            <div class="flex flex-col flex-grow">
               <div class="flex items-center gap-4 mb-3 px-1">
                  <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 border border-secondary-200/50">
                     <Icon name="heroicons:briefcase" size="20" />
                  </div>
                  <h3 class="font-black text-sm uppercase tracking-[0.2em] text-neutral-900">{{ $t('about.overview.careerPath.title') }}</h3>
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