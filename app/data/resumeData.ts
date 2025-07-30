
import type { ComposerTranslation } from "#i18n"

export const resumeData = {
  personal: {
    name: "Philipp Fleischer",
    subtitle: (t: ComposerTranslation) => t("home.hero.summary"),
    location: (t: ComposerTranslation) => t("resume.personal.location"),
    internshipStatus: (t: ComposerTranslation) => t("resume.personal.internshipStatus"),
  },
  summary: (t: ComposerTranslation) => t("home.hero.summary"),
  techStack: [
    'Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter', 
    'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'REST', 'GraphQL'
  ],
  softSkills: [
    'Leadership', 'Teamwork', 'Problem Solving', 'Communication', 'Adaptability', 
    'Time Management', 'Critical Thinking', 'Creativity', 'Attention to Detail'
  ],
  careerTimeline: (t: ComposerTranslation) => [
    {
      date: "2025 - 2027",
      title: t("cv.timeline.wbs.title"),
      description: t("cv.timeline.wbs.description"),
      icon: "heroicons:academic-cap",
      type: "education",
      skills: ["Java", "Python", "C#", t("common.webdev"), "DevOps", t("common.databases")]
    },
    {
      date: "2022 - 2025",
      title: t("cv.timeline.ups.title"),
      description: t("cv.timeline.ups.description"),
      icon: "heroicons:briefcase",
      type: "career",
      skills: [t("common.teamleading"), t("common.process_optimization"), t("common.project_management"), t("common.warehouse_operations"), t("common.troubleshooting")]
    },
    {
      date: "2020 - 2022",
      title: t("cv.timeline.lidl.title"),
      description: t("cv.timeline.lidl.description"),
      icon: "heroicons:briefcase",
      type: "career",
      skills: [t("common.data_maintenance"), t("common.inventory_management"), t("common.retail_logistics"), t("common.customer_service"), t("common.process_optimization")]
    },
    {
      date: "2017 - 2019",
      title: t("cv.timeline.timeoff.title"),
      description: t("cv.timeline.timeoff.description"),
      icon: "mage:eye-closed",
      type: "career",
      skills: [t("common.self_improvement"), t("common.education"), t("common.analyze")]
    },
    {
      date: "2015 - 2017",
      title: t("cv.timeline.medienkolleg.title"),
      description: t("cv.timeline.medienkolleg.description"),
      icon: "heroicons:academic-cap",
      type: "education",
      skills: [t("common.audio_production"), t("common.video_production"), t("common.sound_design"), t("common.motion_graphics"), "Adobe Creative Cloud"]
    },
    {
      date: "2014 - 2015",
      title: t("cv.timeline.persch.title"),
      description: t("cv.timeline.persch.description"),
      icon: "heroicons:briefcase",
      type: "career",
      skills: ["Printdesign", t("common.digital_media"), t("common.graphic_design"), "Layoutdesign", "Brand Identity", "Typography", "Webdesign"]
    },
    {
      date: "2012 - 2014",
      title: t("cv.timeline.putbus.title"),
      description: t("cv.timeline.putbus.description"),
      icon: "heroicons:academic-cap",
      type: "education",
      skills: ["Printdesign", t("common.digital_media"), "Layoutdesign", "Typography", "Webdesign"]
    },
    {
      date: "2007 - 2012",
      title: t("cv.timeline.secschool.title"),
      description: t("cv.timeline.secschool.description"),
      icon: "heroicons:academic-cap",
      type: "education",
      skills: []
    },
    {
      date: "2003 - 2007",
      title: t("cv.timeline.elementary.title"),
      description: t("cv.timeline.elementary.description"),
      icon: "heroicons:academic-cap",
      type: "education",
      skills: []
    }
  ]
};