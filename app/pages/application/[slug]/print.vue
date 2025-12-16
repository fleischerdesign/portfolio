<template>
  <div class="pdf-resume-container text-primary-950 font-sans">

    <div class="cover-page flex h-[371mm] w-full flex-col justify-between p-[25mm]">
      <UiCard class="relative h-auto w-full flex-grow overflow-hidden rounded-lg shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
      </UiCard >
        <UiHeading :level="1" symbol="logo:fleischerdesign" :title="personal.name" :subtitle="personal.subtitle" class="!mb-0 mt-10"/>
    </div>

    <div class="main-content-pages relative h-[371mm] px-[25mm] pb-[25mm] pt-[56.25mm]">

      <div class="text-xs">
        Philipp Fleischer, Hufelandstr. 55, 17036 Neubrandenburg
      </div>


      <div v-if="application" class="mt-4 grid grid-cols-3 gap-8">
        <div class="col-span-2">
          <p>{{ application.company.name }}</p>
          <p>{{ application.company.address.street }} {{ application.company.address.houseNumber }}</p>
          <p>{{ application.company.address.zipcode }} {{ application.company.address.city }}</p>
        </div>
        <div class="text-right">
          <p>Neubrandenburg, {{ applicationDate }}</p>
        </div>
      </div>

      
      <UiHeading v-if="application" :level="1" symbol="logo:fleischerdesign" :title="application.title" :subtitle="application.subtitle" class="!mb-0 mt-12"/>

      
      <p class="mt-12">
        {{ salutation }},
      </p>

      
      <div class="mt-4 space-y-4 text-base">
        <ContentRenderer class="prose prose-neutral max-w-none text-black dark:prose-invert" :value="application" />
        <p class="mt-12">
          Mit freundlichen Grüßen,
        </p>
        <p class="mt-4">
          Philipp Fleischer
        </p>
      </div>
      <ResumeFooter :current-page="1" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>
    
    <div class="main-content-pages relative h-[371mm] p-[25mm]">
      <div class="flex gap-2">
      <UiHeading
        :title="$t('about.overview.resume.title')"
        :subtitle="''"
        symbol="logo:fleischerdesign"
        class="!mb-5"
      />
      </div>
      <div class="flex gap-10">
        <div class="w-1/3">
          <section class="mb-8">
      <UiCard class="h-[230px] w-full overflow-hidden rounded-lg shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
      </UiCard >
      </section>
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ personal.name }}</h3>
            <div><span class="font-bold">{{ $t('resume.details.birthday') }}:</span> {{ personal.birth.date }}</div>
            <div><span class="font-bold">{{ $t('resume.details.birthplace') }}:</span> {{ personal.birth.location }}</div>
            <div><span class="font-bold">{{ $t('resume.details.marital_status_label') }}:</span> {{ personal.maritalStatus }}</div>
            <div><span class="font-bold">{{ $t('resume.details.drivers_license_label') }}:</span> {{ personal.driversLicense }}</div>
            <div><span class="font-bold">{{ $t('resume.details.address_label') }}:</span> {{ personal.address.street }}, {{ personal.address.postalCode }} {{ personal.address.city }}, {{ personal.address.county }}, {{ personal.address.country }}</div>
          </section>
          
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Softskills</h3>
            <TechstackList :items="softSkills" :scroll="false" :gradient="true" />
          </section>
            <section class="mb-8">
              <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('languages.title') }}</h3>
              <ul>
                <li v-for="lang in languages" :key="lang.name"><b>{{ lang.name }}:</b> {{ lang.level }}</li>
              </ul>
            </section>
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('home.contact.title') }}</h3>
            <div class="grid grid-cols-1">
              <div class="flex items-center gap-2">
                <Icon name="heroicons:envelope" class="text-primary-500" />
                <span>{{ contact.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:phone" class="text-primary-500" />
                <span>{{ contact.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="heroicons:globe-alt" class="text-primary-500" />
                <span>{{ contact.website }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:github" class="text-primary-500" />
                <span>{{ contact.github }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="mdi:linkedin" class="text-primary-500" />
                <span>{{ contact.linkedin }}</span>
              </div>
            </div>
          </section>
        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('common.summary') }}</h3>
            <p class="text-base leading-relaxed">{{ t("home.hero.summary") }}</p>
          </section>
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('home.overview.techstack.title') }}</h3>
            <TechstackList :items="techStack" :scroll="false" :gradient="true" />
          </section>
            <section v-if="projects" class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Projekte</h3>
            <div class="grid grid-cols-1 gap-4">
              <ProjectCard v-for="project in projects.slice(0,3)" :key="project.slug" :project="project" :compact="true" />
            </div>
<div class="mt-4 text-left">
              <UiButton to="/projects" class="justify-start gap-0">
                <span>Weitere Projekte auf <strong>fleischer.design/projects</strong></span>
              </UiButton>
            </div>
            </section>
        </div>
      </div>
      <ResumeFooter :current-page="1" :total-pages="2" class="absolute bottom-10 left-20 right-20" />
    </div>
      <div class="main-content-pages relative h-[371mm] break-inside-avoid-page p-[25mm]">
      <div class="flex gap-10">
        <div class="w-1/3">
            <section class="mb-8">
              <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('interests.title') }}</h3>
              <ul>
                <li><b>{{ $t('interests.technology.title') }}:</b> {{ interests.technology.join(', ') }}</li>
                <li><b>{{ $t('interests.culture.title') }}:</b> {{ interests.culture.join(', ') }}</li>
                <li><b>{{ $t('interests.health.title') }}:</b> {{ interests.health.join(', ') }}</li>
                <li><b>{{ $t('interests.education.title') }}:</b> {{ interests.education.join(', ') }}</li>
              </ul>
            </section>
            <section class="mb-8">
              <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Kurse</h3>
              <div>
                <div v-for="(skill, index) in courses" :key="skill.title" :class="{ 'mb-4': index < courses.length - 1 }">
                  <h4 class="text-base font-bold">{{ skill.title }}</h4>
                  <p class="text-sm">{{ skill.date }}</p>
                  <p class="text-sm">{{ skill.teacher.join(', ') }}</p>
                </div>
              </div>
            </section>
        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Bildungsweg</h3>
            <BaseTimeline :items="timeline.filter(item => item.type === 'education').splice(0, 4)" :is-print-view="true" />
          </section>
          
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('about.overview.careerPath.title') }}</h3>
            <BaseTimeline :items="timeline.filter(item => item.type === 'career')" :is-print-view="true" />
          </section>
        </div>
      </div>
      <ResumeFooter :current-page="2" :total-pages="2" class="absolute bottom-10 left-20 right-20" />
      </div>
  </div>
</template>

<script lang="ts" setup>
import { personalData } from '~/data/personal.data';
import { languagesData } from '~/data/languages.data';
import { interestsData } from '~/data/interests.data';
import { contactData } from '~/data/contact.data';
import { timelineData } from '~/data/timeline.data';
import { coursesData } from '~/data/courses.data';
import { softSkillsData } from '~/data/softSkills.data';
import { techStackData } from '~/data/techStack.data';

definePageMeta({
  layout: 'print',
  middleware: 'sidebase-auth'
});

const { t, locale } = useI18n();
const route = useRoute();
const { slug } = route.params;

const { data: application } = await useAsyncData(`application-${slug}`, () => 
  queryCollection('applications').where('slug', '=', slug as string).first()
);

if (!application.value) {
  throw createError({ statusCode: 404, statusMessage: 'Application not found' });
}

const personal = personalData(t);
const languages = languagesData(t);
const interests = interestsData(t);
const contact = contactData;
const timeline = timelineData(t);
const courses = coursesData;
const softSkills = softSkillsData(t);
const techStack = techStackData;

const applicationDate = computed(() => {
  if (!application.value?.dates?.application) return '';
  const date = new Date(application.value.dates.application);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
});

const salutation = computed(() => {
  const contactName = application.value?.company?.address?.contact?.name;
  if (contactName) {
    return `Sehr geehrte/r Frau/Herr ${contactName.split(' ').pop()}`;
  }
  return 'Sehr geehrte Damen und Herren';
});

const { data: projects } = await useAsyncData(`projects-resume-${locale.value}`, () =>
  queryCollection('projects')
    .where('locale', '=', locale.value)
    .select('title', 'subtitle', 'slug', 'image')
    .all()
);
</script>


