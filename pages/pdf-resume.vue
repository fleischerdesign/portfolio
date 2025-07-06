<template>
  <PdfResume :resume-data="resumeData" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import PdfResume from '~/components/Pdf/Resume.vue';

const route = useRoute();

// Initialize with a default structure to prevent errors
const resumeData = ref({
  personal: {
    name: '',
    title: '',
    location: '',
    internshipStatus: '',
  },
  summary: '',
  techStack: [],
  careerTimeline: [],
});

// Parse data immediately if available
if (route.query.resumeData) {
  try {
    const parsed = JSON.parse(route.query.resumeData as string);
    // Merge parsed data with default to ensure all properties exist
    resumeData.value = { ...resumeData.value, ...parsed };
  } catch (e) {
    console.error("Error parsing resumeData query parameter:", e);
    // Keep default empty object on error
  }
}
</script>