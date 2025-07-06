<template>
    <div class="container max-w-screen-xl mx-auto py-16">
        <div class="mb-24">
            <HeadingSite :title="$t('resume.title')" :subtitle="$t('resume.subtitle')" />
            <button @click="generatePdfAndDownload" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Lebenslauf generieren
            </button>
        </div>

        <div v-if="pdfUrl && isDevelopment" class="mt-8">
            <h2 class="text-xl font-bold mb-4">PDF Vorschau (Entwicklungsmodus)</h2>
            <iframe :src="pdfUrl" class="w-full h-[800px] border border-gray-300 rounded-lg"></iframe>
        </div>
    </div>
</template>

<script lang="ts" setup>
import jsPDF from 'jspdf';
import { ref, watchEffect, onUnmounted } from 'vue';
import PdfLayoutManager from '~/utils/PdfLayoutManager';

const { t } = useI18n();
const route = useRoute();
const { locale } = useI18n();

const pdfUrl = ref<string | null>(null);
const isDevelopment = process.client && process.env.NODE_ENV === 'development';

const resumeData = {
  personal: {
    name: "Philipp Fleischer",
    title: t("home.hero.summary"),
    location: "Neubrandenburg, DE",
    internshipStatus: t("home.overview.searching.subtitle"),
  },
  summary: t("about.subtitle"),
  techStack: [
    'Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter', 'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'REST', 'GraphQL'
  ],
  careerTimeline: [
    {
        date: "2025 - 2027",
        title: t("cv.timeline.wbs.title"),
        description: t("cv.timeline.wbs.description"),
        skills: ["Java", "Python", "C#", t("common.webdev"), "DevOps", t("common.databases")]
    },
    {
        date: "2022 - 2025",
        title: t("cv.timeline.ups.title"),
        description: t("cv.timeline.ups.description"),
        skills: [t("common.teamleading"), t("common.process_optimization"), t("common.project_management"), t("common.warehouse_operations"), t("common.troubleshooting")]
    },
    {
        date: "2020 - 2022",
        title: t("cv.timeline.lidl.title"),
        description: t("cv.timeline.lidl.description"),
        skills: [t("common.data_maintenance"), t("common.inventory_management"), t("common.retail_logistics"), t("common.customer_service"), t("common.process_optimization")]
    },
    {
        date: "2017 - 2019",
        title: t("cv.timeline.timeoff.title"),
        description: t("cv.timeline.timeoff.description"),
        skills: [t("common.self_improvement"), t("common.education"), t("common.analyze")]
    },
    {
        date: "2015 - 2017",
        title: t("cv.timeline.medienkolleg.title"),
        description: t("cv.timeline.medienkolleg.description"),
        skills: [t("common.audio_production"), t("common.video_production"), t("common.sound_design"), t("common.motion_graphics"), "Adobe Creative Cloud"]
    },
    {
        date: "2014 - 2015",
        title: t("cv.timeline.persch.title"),
        description: t("cv.timeline.persch.description"),
        skills: ["Printdesign", t("common.digital_media"), t("common.graphic_design"), "Layoutdesign", "Brand Identity", "Typography", "Webdesign"]
    },
    {
        date: "2012 - 2014",
        title: t("cv.timeline.putbus.title"),
        description: t("cv.timeline.putbus.description"),
        skills: ["Printdesign", t("common.digital_media"), "Layoutdesign", "Typography", "Webdesign"]
    },
    {
        date: "2007 - 2012",
        title: t("cv.timeline.secschool.title"),
        description: t("cv.timeline.secschool.description"),
        skills: []
    },
    {
        date: "2003 - 2007",
        title: t("cv.timeline.elementary.title"),
        description: t("cv.timeline.elementary.description"),
        skills: []
    }
  ]
};

const generatePdfContent = () => {
  const doc = new jsPDF();
  
  const colors = {
    primary: [55, 65, 81],
    secondary: [5, 150, 105],
    cardBg: [243, 244, 246],
    cardBorder: [212, 212, 212]
  };
  
  const titleConfig = {
    showBar: true,
    barWidth: 1.6,
    barOffset: 4
  };

  const layoutManager = new PdfLayoutManager(doc, colors, titleConfig);
  
  try {
    if (!resumeData?.personal?.name) {
      throw new Error('Resume data is incomplete');
    }
    
    // Cover Page
    const coverMargin = layoutManager.getMargin();
    const pageWidth = layoutManager.getPageWidth();
    const pageHeight = layoutManager.getPageHeight();

    // Calculate height of name and summary for precise positioning
    layoutManager.getDoc().setFontSize(28);
    layoutManager.getDoc().setFont('helvetica', 'bold');
    const nameTextLines = layoutManager.getDoc().splitTextToSize(resumeData.personal.name, pageWidth - (coverMargin * 2) - titleConfig.barWidth - titleConfig.barOffset);
    const nameHeight = nameTextLines.length * 7; // Assuming 7 units per line

    layoutManager.getDoc().setFontSize(12);
    layoutManager.getDoc().setFont('helvetica', 'normal');
    const summaryTextLines = layoutManager.getDoc().splitTextToSize(t("home.hero.summary"), pageWidth - (coverMargin * 2) - 20);
    const summaryHeight = summaryTextLines.length * 7; // Assuming 7 units per line

    const textBlockPadding = 10; // Padding between name and summary
    const totalTextBlockHeight = nameHeight + textBlockPadding + summaryHeight;

    const spaceBetweenCardAndText = 10; // Additional space between card and text block

    const coverCardWidth = pageWidth - (coverMargin * 2);
    const coverCardHeight = pageHeight - (coverMargin * 2) - totalTextBlockHeight - spaceBetweenCardAndText;

    layoutManager.getDoc().setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]);
    layoutManager.getDoc().roundedRect(coverMargin, coverMargin, coverCardWidth, coverCardHeight, 5, 5, 'F');
    layoutManager.getDoc().setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    layoutManager.getDoc().roundedRect(coverMargin, coverMargin, coverCardWidth, coverCardHeight, 5, 5, 'S');

    // Calculate image dimensions to fill the card while maintaining aspect ratio
    const originalImgWidth = 1457;
    const originalImgHeight = 1942;
    const imageAspectRatio = originalImgWidth / originalImgHeight;

    let finalImgWidth = coverCardWidth;
    let finalImgHeight = coverCardWidth / imageAspectRatio;
    // The image will always fill the width. If it's too tall, it will be clipped by the roundedRect clipping path.

    const imgX = coverMargin; // Always start at the left edge of the card
    const imgY = coverMargin + (coverCardHeight - finalImgHeight) / 2; // Center image vertically within the card

    // Save the current graphics state
    layoutManager.getDoc().saveGraphicsState();

    // Draw the rounded rectangle path for clipping (style: null)
    layoutManager.getDoc().roundedRect(coverMargin, coverMargin, coverCardWidth, coverCardHeight, 5, 5, null);
    layoutManager.getDoc().clip();
    layoutManager.getDoc().discardPath(); // Discard the path after clipping

    // Add image to fill the card (it will be clipped)
    layoutManager.getDoc().addImage('/img/profile.jpg', 'JPEG', imgX, imgY, finalImgWidth, finalImgHeight);

    // Restore the graphics state so subsequent drawings are not clipped
    layoutManager.getDoc().restoreGraphicsState();

    // Optionally, draw the rounded rectangle again with a stroke to have a visible border
    layoutManager.getDoc().setDrawColor(colors.cardBorder[0], colors.cardBorder[1], colors.cardBorder[2]);
    layoutManager.getDoc().roundedRect(coverMargin, coverMargin, coverCardWidth, coverCardHeight, 5, 5, 'S');

    // Position text below the card, at the bottom of the page using addPageTitle
    const titleY = pageHeight - coverMargin - (summaryTextLines.length - 1) * 7 - textBlockPadding - nameHeight + 5;
    
    layoutManager.setYPos(titleY); // Set yPos for the title
    layoutManager.addPageTitle(
      resumeData.personal.name, 
      t("home.hero.summary"), 
      true, // showBar
      titleConfig.barWidth, 
      titleConfig.barOffset,
      28, // titleFontSize
      12  // subtitleFontSize
    );

    layoutManager.getDoc().addPage(); // Add a new page for the rest of the content
    layoutManager.setYPos(layoutManager.getMargin()); // Reset yPos for the new page

    // Header (on the second page) - only location and internship status
    layoutManager.addText(
      `${resumeData.personal.location} | ${resumeData.personal.internshipStatus}`, 
      10,
      'normal',
      colors.primary,
      0 // xOffset
    );
    layoutManager.setYPos(layoutManager.getYPos() + 10); // Add some space

    // Summary
    layoutManager.addSectionTitle('Zusammenfassung');
    layoutManager.addText(resumeData.summary, 10);
    layoutManager.setYPos(layoutManager.getYPos() + 10);

    // Tech Stack
    layoutManager.addSectionTitle('Tech Stack');
    layoutManager.addText(resumeData.techStack.join(', '), 10);
    layoutManager.setYPos(layoutManager.getYPos() + 10);
    
    // Career Timeline
    layoutManager.addSectionTitle('Werdegang');
    
    resumeData.careerTimeline.forEach(item => {
      layoutManager.addCard((layout, startY) => {
        let currentTextY = startY;
        currentTextY += layout.addText(item.date, 10, 'normal', colors.secondary);
        currentTextY += layout.addText(item.title, 12, 'bold', colors.primary);
        currentTextY += layout.addText(item.description, 10, 'normal', colors.primary);
        
        if (item.skills?.length > 0) {
          currentTextY += layout.addText(
            `Fähigkeiten: ${item.skills.join(', ')}`, 
            9, 
            'normal', 
            colors.primary
          );
        }
        return currentTextY;
      });
      layoutManager.setYPos(layoutManager.getYPos() + 5); // Add some space between cards
    });
    
    return layoutManager.getDoc();
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    return null;
  }
};

const generatePdfAndDownload = () => {
  const doc = generatePdfContent();
  if (doc) {
    doc.save('Lebenslauf_Philipp_Fleischer.pdf');
  }
};

watchEffect(() => {
  if (isDevelopment) {
    const doc = generatePdfContent();
    if (doc) {
      const blob = doc.output('blob');
      if (pdfUrl.value) {
        URL.revokeObjectURL(pdfUrl.value);
      }
      pdfUrl.value = URL.createObjectURL(blob);
    }
  }
});

onUnmounted(() => {
  if (pdfUrl.value) {
    URL.revokeObjectURL(pdfUrl.value);
  }
});

useSeoMeta({
  title: t("navigation.resume"),
  ogTitle: t("navigation.resume"),
  description: t("resume.title"),
  ogDescription: t("resume.subtitle"),
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.resume"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("resume.subtitle"),
  robots: 'index, follow',
})
</script>
