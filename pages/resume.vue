<template>
  <div class="pdf-resume-container font-sans text-primary-950">
    <!-- Cover Page -->
    <div class="cover-page w-full h-[370mm] flex flex-col justify-between px-20 py-10">
      <Card class="w-full h-auto flex-grow rounded-lg overflow-hidden shadow-lg relative">
        <img src="/img/profile.jpg" alt="Profile Picture" class="w-full h-full object-cover" />
        <!-- <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4 text-white opacity-100 transition-opacity"></div> -->
      </Card>
      <HeadingSite symbol="logo:fleischerdesign" :title="resumeData.personal.name" :subtitle="resumeData.personal.subtitle($t)" class="!mb-0 mt-10"/>
    </div>

    <!-- Main Content Pages -->
    <div class="main-content-pages py-10 px-20">
      <div class="flex gap-2">
      <HeadingSite
        :title="$t('about.overview.resume.title')"
        :subtitle="''"
        symbol="logo:fleischerdesign"
        class="!mb-5"
      />
      </div>
      <div class="flex gap-10">
        <div class="w-1/3">
          <section class="mb-8">
      <Card class="w-full h-[230px] rounded-lg overflow-hidden shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="w-full h-full object-cover" />
      </Card>
      </section>
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">Philipp Fleischer</h3>
            <div><span class="font-bold">Geburtstag:</span> 16.12.1995</div>
            <div><span class="font-bold">Geburtsort:</span> Demmin</div>
            <div><span class="font-bold">Familienstand:</span> Ledig</div>
            <div><span class="font-bold">Führerschein:</span> Klasse B</div>
            <div><span class="font-bold">Wohnort:</span> Hufelandstr. 55, 17036 Neubrandenburg</div>
          </section>

          <!-- Tech Stack Section -->
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">Softskills</h3>
            <TechstackList :items="resumeData.softSkills" :scroll="false" />
          </section>
        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('common.summary') }}</h3>
            <p class="text-base leading-relaxed">{{ resumeData.summary($t) }}</p>
          </section>
          <!-- Career Timeline Section -->
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('about.overview.careerPath.title') }}</h3>
            <Timeline :items="resumeData.careerTimeline($t).filter(item => item.type === 'career')" :isPrintView="true" />
          </section>
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('home.overview.techstack.title') }}</h3>
            <TechstackList :items="resumeData.techStack" :scroll="false" />
          </section>
        </div>
      </div>
    </div>
      <div class="main-content-pages py-10 px-20 break-inside-avoid-page">
      <div class="flex gap-10">
        <div class="w-1/3">

        </div>
        <div class="w-2/3">
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">Bildungsweg</h3>
            <Timeline :items="resumeData.careerTimeline($t).filter(item => item.type === 'education')" :isPrintView="true" />
          </section>
        </div>
      </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import { resumeData } from '~/data/resumeData';

const route = useRoute();
</script>