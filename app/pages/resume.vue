<template>
  <div class="pdf-resume-container text-primary-950 font-sans">
    <!-- Cover Page -->
    <div class="cover-page flex h-[371mm] w-full flex-col justify-between px-20 py-10">
      <UiCard class="relative h-auto w-full flex-grow overflow-hidden rounded-lg shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
        <!-- <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white opacity-100 transition-opacity"></div> -->
      </UiCard >
        <UiHeading :level="1" symbol="logo:fleischerdesign" :title="personal.name" :subtitle="personal.subtitle" class="!mb-0 mt-10"/>
    </div>
    <!-- Writing -->
    <div class="main-content-pages relative h-[371mm] px-20 py-10">
      <div class="absolute right-20">Neubrandenburg, {{ currentDate }}</div>
      <div>
      <ul>
        <li>Philipp Fleischer</li>
        <li>Hufelandstr. 55</li>
        <li>17036 Neubrandenburg</li>
      </ul>

      <ul class="mt-20">
        <li>Sample GmbH</li>
        <li>Muster Allee 46-48a</li>
        <li>20435 Hamburg</li>
      </ul>
    </div>
    
      <UiHeading :level="1" symbol="logo:fleischerdesign" title="Bewerbung um ein Praktikum" subtitle="Umschüler zum Fachinformatiker für Anwendungsentwicklung" class="!mb-0 mt-20"/>
      <div class="mt-20">
Sehr geehrte/r Frau/Herr [Nachname des Ansprechpartners],<br><br>
mit großem Interesse habe ich Ihre Stellenanzeige auf [Name der Jobbörse oder Webseite] gelesen und bin überzeugt, dass meine Fähigkeiten und Erfahrungen ideal zu den Anforderungen der Position als [Bezeichnung der Stelle] passen.<br><br>
In meiner bisherigen beruflichen Laufbahn bei [Name des letzten Arbeitgebers] konnte ich umfassende Kenntnisse in [Nennen Sie hier 1-2 relevante Fachbereiche oder Tätigkeiten] erwerben. Zu meinen Hauptaufgaben gehörte unter anderem [Beschreiben Sie 1-2 konkrete Aufgaben oder Erfolge, die für die neue Stelle relevant sind]. Dabei habe ich gelernt, [Nennen Sie eine wichtige Fähigkeit, z.B. "eigenverantwortlich zu arbeiten", "im Team zu agieren" oder "prozessorientiert zu denken"].<br><br>
Die in der Stellenanzeige geforderten Qualifikationen, insbesondere [Nennen Sie eine spezifische Anforderung aus der Stellenanzeige], bringe ich durch meine Ausbildung/mein Studium in [Name der Ausbildung/Studienfach] und meine praktische Erfahrung vollumfänglich mit. Mich reizt an Ihrem Unternehmen besonders [Nennen Sie einen Grund, z.B. "die innovative Ausrichtung", "die Unternehmenskultur" oder "die Möglichkeit zur Weiterentwicklung"].<br><br>
Gerne überzeuge ich Sie in einem persönlichen Gespräch von meiner Motivation und meinen Fähigkeiten. Ich freue mich auf die Gelegenheit, mehr über die spannenden Aufgaben in Ihrem Unternehmen zu erfahren.<br><br>
Mit freundlichen Grüßen,<br><br>
[Ihr Vorname Ihr Nachname]
      </div>
      <ResumeFooter :current-page="1" :total-pages="3" class="absolute bottom-10 left-20 right-20" />
    </div>
    <!-- Resume Content Pages -->
    <div class="main-content-pages relative h-[371mm] px-20 py-10">
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
          <!-- Tech Stack Section -->
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
            </section>
        </div>
      </div>
      <ResumeFooter :current-page="1" :total-pages="2" class="absolute bottom-10 left-20 right-20" />
    </div>
      <div class="main-content-pages relative h-[371mm] break-inside-avoid-page px-20 py-10">
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
          <!-- Career Timeline Section -->
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

const { t, locale } = useI18n();
const personal = personalData(t);
const languages = languagesData(t);
const interests = interestsData(t);
const contact = contactData;
const timeline = timelineData(t);
const courses = coursesData;
const softSkills = softSkillsData(t);
const techStack = techStackData;

const currentDate = computed(() => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
});

const { data: projects } = await useAsyncData(`projects-resume-${locale.value}`, () =>
  queryCollection('projects')
    .where('locale', '=', locale.value)
    .select('title', 'subtitle', 'slug', 'image')
    .all()
);
</script>
