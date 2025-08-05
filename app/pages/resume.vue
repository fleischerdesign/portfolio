<template>
  <div class="pdf-resume-container text-primary-950 font-sans">
    <!-- Cover Page -->
    <div class="cover-page flex h-[370mm] w-full flex-col justify-between px-20 py-10">
      <UiCard class="relative h-auto w-full flex-grow overflow-hidden rounded-lg shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="h-full w-full object-cover" />
        <!-- <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white opacity-100 transition-opacity"></div> -->
      </UiCard >
        <UiHeading :level="1" symbol="logo:fleischerdesign" :title="resumeData.personal.name" :subtitle="resumeData.personal.subtitle" class="!mb-0 mt-10"/>
    </div>

    <!-- Main Content Pages -->
    <div class="main-content-pages px-20 py-10">
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
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Philipp Fleischer</h3>
            <div><span class="font-bold">Geburtstag:</span> 16.12.1995</div>
            <div><span class="font-bold">Geburtsort:</span> Demmin</div>
            <div><span class="font-bold">Familienstand:</span> Ledig</div>
            <div><span class="font-bold">Führerschein:</span> Klasse B</div>
            <div><span class="font-bold">Wohnort:</span> Hufelandstr. 55, 17036 Neubrandenburg</div>
          </section>

          <!-- Tech Stack Section -->
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Softskills</h3>
            <TechstackList :items="resumeData.softSkills" :scroll="false" />
          </section>
        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('common.summary') }}</h3>
            <p class="text-base leading-relaxed">{{ resumeData.summary }}</p>
          </section>
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('home.overview.techstack.title') }}</h3>
            <TechstackList :items="resumeData.techStack" :scroll="false" />
          </section>
          <!-- Career Timeline Section -->
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">{{ $t('about.overview.careerPath.title') }}</h3>
            <BaseTimeline :items="resumeData.careerTimeline.filter(item => item.type === 'career')" :is-print-view="true" />
          </section>
        </div>
      </div>
    </div>
      <div class="main-content-pages break-inside-avoid-page px-20 py-10">
      <div class="flex gap-10">
        <div class="w-1/3">
            <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Interessen</h3>
            <ul>
              <li><b>Technologie:</b> Programmieren, Maschinelles Lernen, Künstliche Intelligenz, Additive Fertigung, CAD, Videospiele</li>
              <li><b>Kultur:</b> Bücher, Musik, Cuisine, Natur, Kunst, Design, Film</li>
              <li><b>Gesundheit:</b> Laufen, Fitness, Mental, Ernährung</li>
              <li><b>Bildung:</b> MINT, Psychologie, Geschichte, Politik, Biologie</li>
            </ul>
            </section>
            <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Sprachen</h3>
            <ul>
              <li><b>Deutsch:</b> Muttersprachler</li>
              <li><b>Englisch:</b> C1 Niveau</li>
            </ul>
            </section>
        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Bildungsweg</h3>
            <BaseTimeline :items="resumeData.careerTimeline.filter(item => item.type === 'education')" :is-print-view="true" />
          </section>
            <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Kurse</h3>
            <TechstackList :items="resumeData.softSkills" :scroll="false" />
            </section>
            <section class="mb-8">
            <h3 class="section-title text-primary-700 mb-4 border-l-4 border-secondary-400 pl-3 text-2xl font-bold">Projekte</h3>
            <ul>
              <li><b>Fleischer.design:</b> Bla</li>
              <li><b>Ancoris:</b> Bla</li>
              <li><b>Riffle:</b> Bla</li>
              <li><b>Scriptorium:</b> Bla</li>
            </ul>
            </section>
        </div>
      </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { getResumeData } from '~/data/resumeData';

const { t } = useI18n();
const resumeData = getResumeData(t);
</script>