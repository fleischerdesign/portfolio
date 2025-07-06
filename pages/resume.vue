<template>
  <div class="pdf-resume-container font-sans text-primary-950">
    <!-- Cover Page -->
    <div class="cover-page w-full h-[370mm] flex flex-col justify-between px-20 py-10">
      <Card class="w-full h-auto flex-grow rounded-lg overflow-hidden shadow-lg">
        <img src="/img/profile.jpg" alt="Profile Picture" class="w-full h-full object-cover" />
      </Card>
      <HeadingSite :title="resumeData.personal.name" :subtitle="resumeData.personal.subtitle($t)" class="!mb-0 mt-10"/>
    </div>

    <!-- Main Content Pages -->
    <div class="main-content-pages py-10 px-20">
      <HeadingSite
        :title="$t('about.overview.resume.title')"
        :subtitle="''"
        class="!mb-0"
      />
      <div class="flex gap-10">
        <div class="w-1/3">
          <!-- Summary Section -->
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('common.summary') }}</h3>
            <p class="text-base leading-relaxed">{{ resumeData.summary($t) }}</p>
          </section>

          <!-- Tech Stack Section -->
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('home.overview.techstack.title') }}</h3>
            <TechstackList :items="resumeData.techStack" :scroll="false" />
          </section>
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">Softskills</h3>
            <TechstackList :items="resumeData.techStack" :scroll="false" />
          </section>
        </div>
        <div class="w-2/3 pl-4">
          <!-- Career Timeline Section -->
          <section class="mb-8">
            <h3 class="section-title text-2xl font-bold text-primary-700 border-l-4 border-secondary-400 pl-3 mb-4">{{ $t('about.overview.careerPath.title') }}</h3>
            <Timeline :items="resumeData.careerTimeline($t)" :isPrintView="true" />
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