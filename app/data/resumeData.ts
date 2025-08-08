
import type { ComposerTranslation } from "#i18n"

export const getResumeData = (t: ComposerTranslation) => ({
  personal: {
    name: "Philipp Fleischer",
    subtitle: t("home.hero.summary"),
    location: t("resume.personal.location"),
    internshipStatus: t("resume.personal.internshipStatus"),
  },
  summary: t("home.hero.summary"),
  techStack: [
    'Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter',
    'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'Java', 'GraphQL', 'Linux'
  ],
  softSkills: [
    t('softskills.leadership'),
    t('softskills.teamwork'),
    t('softskills.problem_solving'),
    t('softskills.communication'),
    t('softskills.adaptability'),
    t('softskills.time_management'),
    t('softskills.critical_thinking'),
    t('softskills.creativity'),
    t('softskills.attention_to_detail')
  ],
  careerTimeline: [
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
  ],
  skills: [
    {
      title: "Berufspraktisches Deutsch",
      date: "23.05.2025 - 04.06.2025",
      teacher: ["Ute Hegemann"]
    },
    {
      title: "Moderne Arbeitswelt: Kommunikation & Lernmethoden",
      date: "07.06.2025 - 20.06.2025",
      teacher: ["Peter Gerlach"]
    },
    {
      title: "Berufspraktisches Englisch",
      date: "23.06.2025 - 04.07.2025",
      teacher: ["Gwendolyn Mikschy"]
    },
    {
      title: "IT Basics",
      date: "07.07.2025 - 01.08.2025",
      teacher: ["Alexander Schwartz", "Lutz Galling", "Sina Cirillo", "Tobias Winkelhorst"]
    },
    {
      title: "CAD and Digital Manufacturing",
      date: "12.04.2020 - 02.05.2020",
      teacher: ["Autodesk"]
    },
  ],
  details: {
    birthday: "16.12.1995",
    birthplace: "Demmin",
    maritalStatus: t('resume.details.marital_status'),
    driversLicense: t('resume.details.drivers_license'),
    address: "Hufelandstr. 55, 17036 Neubrandenburg"
  },
  contact: {
    email: "philipp@fleischer.design",
    phone: "+49 176 310 99 324",
    website: "fleischer.design",
    github: "github.com/fleischerdesign",
    linkedin: "linkedin.com/in/fleischerdesign"
  },
  languages: [
    { name: t('languages.german'), level: t('languages.native') },
    { name: t('languages.english'), level: 'C1' }
  ],
  interests: {
    technology: [t('interests.technology.programming'), t('interests.technology.ml'), t('interests.technology.ai'), t('interests.technology.additive_manufacturing'), t('interests.technology.cad'), t('interests.technology.video_games')],
    culture: [t('interests.culture.books'), t('interests.culture.music'), t('interests.culture.cuisine'), t('interests.culture.nature'), t('interests.culture.art'), t('interests.culture.design'), t('interests.culture.film')],
    health: [t('interests.health.running'), t('interests.health.fitness'), t('interests.health.mental'), t('interests.health.nutrition')],
    education: [t('interests.education.stem'), t('interests.education.psychology'), t('interests.education.history'), t('interests.education.politics'), t('interests.education.biology')]
  }
});