<script setup lang="ts">
import type { ProjectResponse } from "#shared/schemas/project.schema";
import type { BlogPostResponse } from "#shared/schemas/blog.schema";
import type { ApplicationResponsePayload } from "#shared/schemas/application.schema";
import type { Contact } from "#shared/schemas/contact.schema";

definePageMeta({
  title: "Design System",
});

const { showToast } = useToast();

// --- Surface Toggle ---
const activeSurface = ref("page");

const surfaces = [
  { key: "page", label: "Page" },
  { key: "card", label: "Card" },
  { key: "glass", label: "Glass" },
  { key: "accent", label: "Accent" },
  { key: "dark", label: "Dark" },
];

const surfaceClasses = computed(() => {
  const map: Record<string, string> = {
    page: "",
    card: "rounded-2xl border border-primary-100 bg-white dark:border-primary-800 dark:bg-primary-900/40",
    glass:
      "rounded-2xl border border-primary-200/60 bg-white/50 backdrop-blur-md dark:border-primary-800/60 dark:bg-primary-900/50",
    accent:
      "rounded-2xl border border-secondary-200/50 bg-secondary-50/50 dark:border-secondary-500/20 dark:bg-secondary-900/20",
    dark: "rounded-2xl border border-primary-800 bg-primary-950 dark",
  };
  return map[activeSurface.value] ?? "";
});

const surfacePadding = computed(() =>
  activeSurface.value !== "page" ? "p-8 md:p-12" : "",
);

// --- Demo States ---
const isLoading = ref(false);
const searchTerm = ref("");
const selectedStatus = ref("published");
const multiSelectValue = ref<string[]>(["Vue"]);
const creatableOptions = ref(["Vue", "Nuxt", "TypeScript"]);
const creatableValue = ref<string | null>(null);
const inputText = ref("Sample text");
const inputTextarea = ref("Multi-line content...\nLine two.");
const inputError = ref("This field is required");
const showSmallModal = ref(false);
const showDemoModal = ref(false);
const showPersistentModal = ref(false);
const editorContent = ref(
  "# Hello Markdown\n\n**ContentEditor** live preview.\n\n- Feature 1\n- Feature 2",
);

function toggleLoading() {
  isLoading.value = true;
  setTimeout(() => (isLoading.value = false), 2000);
}

function triggerToast(type: "success" | "error" | "info" | "warning") {
  showToast(`This is a ${type} toast message!`, { type });
}

function handleCreate(option: string) {
  creatableOptions.value.push(option);
  creatableValue.value = option;
}

// --- Mock Data (Zod-typed) ---
const demoTimeline = [
  {
    date: "2024",
    title: "Senior Developer",
    description: "Leading the frontend team at TechCorp.",
    icon: "heroicons:briefcase",
    skills: ["Vue", "Nuxt", "TypeScript"],
  },
  {
    date: "2022",
    title: "Fullstack Engineer",
    description: "Built highly scalable microservices.",
    icon: "heroicons:cpu-chip",
    skills: ["Node.js", "Go"],
  },
];

const demoContact: Contact = {
  id: 1,
  name: "John Doe",
  salutation: null,
  position: "Hiring Manager",
  email: "john@example.com",
  phone: "+49 123 456789",
  companyId: null,
};

const mockProject: ProjectResponse = {
  id: 1,
  translationKey: "proj-1",
  status: "published",
  publishedAt: null,
  coverImage: null,
  coverImageAlt: null,
  icon: "heroicons:globe-alt",
  repoUrl: null,
  projectUrl: null,
  authorId: null,
  categoryId: null,
  createdAt: null,
  updatedAt: null,
  title: "Portfolio Website",
  slug: "portfolio",
  subtitle: "Nuxt 4 & Tailwind CSS",
  body: "A modern portfolio built with Nuxt.",
  features: null,
  learned: null,
  challenges: null,
  category: null,
  tags: [{ id: 1, slug: "nuxt", name: "Nuxt" }],
  techstack: [{ id: 1, slug: "vue", name: "Vue" }],
  author: null,
};

const mockPost: BlogPostResponse = {
  id: 1,
  translationKey: "blog-1",
  status: "published",
  publishedAt: new Date(),
  coverImage: null,
  coverImageAlt: null,
  authorId: null,
  categoryId: null,
  createdAt: null,
  updatedAt: null,
  title: "Refactoring like a Pro",
  slug: "refactoring-pro",
  body: "A deep dive into clean code patterns.",
  excerpt: "A deep dive into clean code patterns.",
  readingTime: 5,
  category: null,
  tags: [{ id: 1, slug: "eng", name: "Engineering" }],
  author: null,
};

const mockApplication: ApplicationResponsePayload = {
  id: 1,
  companyId: 1,
  title: "Senior Frontend Developer",
  subtitle: null,
  slug: "senior-frontend-dev",
  url: null,
  notes: [],
  body: null,
  createdAt: null,
  updatedAt: new Date(),
  pdfGeneratedAt: null,
  company: {
    id: 1,
    name: "Tech Solutions",
    addressId: null,
    address: null,
  },
  contacts: [],
  documents: [],
  histories: [
    {
      id: 1,
      applicationId: 1,
      status: "applied",
      notes: null,
      scheduled_at: null,
      createdAt: new Date(),
    },
  ],
  currentStatus: "applied",
};

const tagStatuses = [
  "draft",
  "published",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
  "archived",
];
const tagColors = [
  "neutral",
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "purple",
];
const demoTechstack = [
  "Vue",
  "Nuxt",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "Go",
  "SQLite",
  "Docker",
];

const mockContributions = (() => {
  const items: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 365; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    items.push({
      date: d.toISOString().slice(0, 10),
      count: Math.random() > 0.4 ? Math.floor(Math.random() * 12) : 0,
    });
  }
  return items;
})();

const mockApplications: ApplicationResponsePayload[] = [
  mockApplication,
  {
    ...mockApplication,
    id: 2,
    title: "Fullstack Engineer",
    currentStatus: "interview",
    histories: [
      {
        id: 2,
        applicationId: 2,
        status: "interview",
        notes: null,
        scheduled_at: null,
        createdAt: new Date(),
      },
    ],
  },
  {
    ...mockApplication,
    id: 3,
    title: "Backend Developer",
    currentStatus: "offer",
    histories: [
      {
        id: 3,
        applicationId: 3,
        status: "offer",
        notes: null,
        scheduled_at: null,
        createdAt: new Date(),
      },
    ],
  },
];

const spacingTokens = [
  0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32,
];
</script>

<template>
  <div
    class="container mx-auto max-w-screen-xl px-4 pb-32 pt-32 font-sans md:px-8 lg:pt-44"
  >
    <!-- Header -->
    <section class="mb-16">
      <UiSectionHeader
        symbol="heroicons:paint-brush"
        title="Design System"
        subtitle="Visual language and component reference for the portfolio."
      />
    </section>

    <!-- Surface Toggle -->
    <div class="mb-32 flex flex-wrap items-center gap-3">
      <p
        class="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400"
      >
        Surface
      </p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="surface in surfaces"
          :key="surface.key"
          :class="
            activeSurface === surface.key
              ? 'bg-secondary-500 text-white shadow-sm'
              : 'bg-primary-100 text-primary-600 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-400 dark:hover:bg-primary-700'
          "
          class="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-bold transition-all"
          @click="activeSurface = surface.key"
        >
          {{ surface.label }}
        </button>
      </div>
    </div>

    <!-- 0. DESIGN TOKENS -->
    <section class="mb-32">
      <UiSectionHeader
        title="Design Tokens"
        subtitle="Colors, typography, spacing, shadows & radius."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="space-y-20">
          <!-- Color Palette — Primary (Neutral) -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Color Palette — Primary (Neutral)
            </p>
            <div class="grid grid-cols-11 gap-2">
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-50 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">50</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-100 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">100</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-200 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">200</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-300 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">300</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-400 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">400</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-500 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">500</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-600 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">600</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-700 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">700</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-800 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">800</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-900 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">900</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-primary-950 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">950</span>
              </div>
            </div>
          </div>

          <!-- Color Palette — Secondary (Emerald) -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Color Palette — Secondary (Emerald)
            </p>
            <div class="grid grid-cols-11 gap-2">
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-50 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">50</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-100 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">100</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-200 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">200</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-300 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">300</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-400 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">400</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-500 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">500</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-600 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">600</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-700 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">700</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-800 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">800</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-900 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">900</span>
              </div>
              <div class="group flex flex-col items-center gap-2">
                <div
                  class="aspect-square w-full rounded-xl bg-secondary-950 transition-transform group-hover:scale-105"
                />
                <span class="text-[10px] font-bold text-primary-500">950</span>
              </div>
            </div>
          </div>

          <!-- Typography Scale -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Typography Scale
            </p>
            <div class="space-y-4">
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >xs</span
                >
                <span class="text-xs font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >sm</span
                >
                <span class="text-sm font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >base</span
                >
                <span class="text-base font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >lg</span
                >
                <span class="text-lg font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >xl</span
                >
                <span class="text-xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >2xl</span
                >
                <span class="text-2xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >3xl</span
                >
                <span class="text-3xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >4xl</span
                >
                <span class="text-4xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >5xl</span
                >
                <span class="text-5xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >6xl</span
                >
                <span class="text-6xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >7xl</span
                >
                <span class="text-7xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >8xl</span
                >
                <span class="text-8xl font-bold">Portfolio</span>
              </div>
              <div class="flex items-baseline gap-6">
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >9xl</span
                >
                <span class="text-9xl font-bold">Portfolio</span>
              </div>
            </div>
          </div>

          <!-- Font Weights -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Font Weights
            </p>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-thin">Aa</p>
                <p class="mt-2 text-xs text-primary-400">thin (100)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-extralight">Aa</p>
                <p class="mt-2 text-xs text-primary-400">extralight (200)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-light">Aa</p>
                <p class="mt-2 text-xs text-primary-400">light (300)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-normal">Aa</p>
                <p class="mt-2 text-xs text-primary-400">normal (400)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-medium">Aa</p>
                <p class="mt-2 text-xs text-primary-400">medium (500)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-semibold">Aa</p>
                <p class="mt-2 text-xs text-primary-400">semibold (600)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-bold">Aa</p>
                <p class="mt-2 text-xs text-primary-400">bold (700)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-extrabold">Aa</p>
                <p class="mt-2 text-xs text-primary-400">extrabold (800)</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-4 text-center dark:border-primary-800"
              >
                <p class="text-3xl font-black">Aa</p>
                <p class="mt-2 text-xs text-primary-400">black (900)</p>
              </div>
            </div>
          </div>

          <!-- Font Family -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Font Family
            </p>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                class="rounded-xl border border-primary-100 p-6 dark:border-primary-800"
              >
                <p class="font-sans text-xl font-bold">
                  Roboto (sans) — The quick brown fox
                </p>
                <p class="mt-2 text-xs text-primary-400">font-sans</p>
              </div>
              <div
                class="rounded-xl border border-primary-100 p-6 dark:border-primary-800"
              >
                <p class="font-mono text-xl font-bold">
                  JetBrains (mono) — The quick brown fox
                </p>
                <p class="mt-2 text-xs text-primary-400">font-mono</p>
              </div>
            </div>
          </div>

          <!-- Custom Drop Shadows -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Custom Drop Shadows
            </p>
            <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="h-24 w-24 rounded-2xl bg-secondary-500 drop-shadow-emit"
                />
                <span class="text-xs font-bold text-primary-500"
                  >drop-shadow-emit</span
                >
              </div>
              <div class="flex flex-col items-center gap-3">
                <div
                  class="h-24 w-24 rounded-2xl bg-secondary-500 drop-shadow-emit-lg"
                />
                <span class="text-xs font-bold text-primary-500"
                  >drop-shadow-emit-lg</span
                >
              </div>
              <div class="flex flex-col items-center gap-3">
                <div
                  class="h-24 w-24 rounded-2xl bg-secondary-400 drop-shadow-glow"
                />
                <span class="text-xs font-bold text-primary-500"
                  >drop-shadow-glow</span
                >
              </div>
            </div>
          </div>

          <!-- Border Radius -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Border Radius
            </p>
            <div class="flex flex-wrap gap-6">
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-none border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">none</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-sm border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">sm</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">DEFAULT</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-md border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">md</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-lg border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">lg</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-xl border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">xl</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-2xl border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">2xl</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-3xl border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">3xl</span>
              </div>
              <div class="flex flex-col items-center gap-2">
                <div
                  class="h-20 w-20 rounded-full border-2 border-secondary-500 bg-secondary-50 dark:bg-secondary-900/30"
                />
                <span class="text-xs font-bold text-primary-500">full</span>
              </div>
            </div>
          </div>

          <!-- Spacing Scale -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Spacing Scale
            </p>
            <div class="space-y-2">
              <div
                v-for="s in spacingTokens"
                :key="s"
                class="flex items-center gap-4"
              >
                <span
                  class="w-12 shrink-0 text-right font-mono text-xs text-primary-400"
                  >{{ s }}</span
                >
                <div
                  :style="{ width: `${s * 4}px` }"
                  class="h-3 rounded-full bg-secondary-500 transition-all"
                />
                <span class="text-[10px] text-primary-400">{{ s * 4 }}px</span>
              </div>
            </div>
          </div>

          <!-- Prose (Typography Plugin) -->
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Prose (@tailwindcss/typography)
            </p>
            <div
              class="rounded-2xl border border-primary-100 bg-white p-8 dark:border-primary-800 dark:bg-primary-900"
            >
              <article class="prose prose-primary dark:prose-invert max-w-none">
                <h2>Prose Heading</h2>
                <p>
                  This is a <strong>prose</strong> paragraph with
                  <em>italic text</em>, <a href="#">a link</a>, and
                  <code>inline code</code>. The @tailwindcss/typography plugin
                  provides beautiful default styles.
                </p>
                <ul>
                  <li>Unordered list item one</li>
                  <li>Unordered list item two</li>
                  <li>Unordered list item three</li>
                </ul>
                <blockquote>
                  <p>A blockquote with some text.</p>
                </blockquote>
                <pre><code>const greeting = "Hello World";</code></pre>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 1. BUTTONS -->
    <section class="mb-32">
      <UiSectionHeader
        title="Buttons"
        subtitle="Interactive triggers."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Variants
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <UiButton>Default</UiButton>
              <UiButton variant="secondary">Secondary</UiButton>
              <UiButton variant="glass">Glass</UiButton>
              <UiButton variant="danger">Danger</UiButton>
              <UiButton variant="ghost">Ghost</UiButton>
              <UiButton variant="link">Link</UiButton>
            </div>
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Sizes
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <UiButton size="sm">Small</UiButton>
              <UiButton size="md">Medium</UiButton>
              <UiButton size="lg">Large</UiButton>
              <UiButton size="icon"><Icon name="heroicons:plus" /></UiButton>
            </div>
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              With Icons
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <UiButton>
                <template #icon-left
                  ><Icon name="heroicons:arrow-left"
                /></template>
                Back
              </UiButton>
              <UiButton variant="secondary">
                Continue
                <template #icon-right
                  ><Icon name="heroicons:arrow-right"
                /></template>
              </UiButton>
            </div>
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Async & States
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <UiButton :is-loading="isLoading" @click="toggleLoading"
                >Click to Load</UiButton
              >
              <UiButton disabled>Disabled</UiButton>
              <UiButton to="/" variant="glass">Link Button</UiButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. CARDS -->
    <section class="mb-32">
      <UiSectionHeader
        title="Cards & Elevation"
        subtitle="Surface containers."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <UiCard shadow="none"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >none</UiCardContainer
            ></UiCard
          >
          <UiCard shadow="sm"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >sm</UiCardContainer
            ></UiCard
          >
          <UiCard shadow="md"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >md</UiCardContainer
            ></UiCard
          >
          <UiCard shadow="lg"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >lg</UiCardContainer
            ></UiCard
          >
          <UiCard shadow="xl"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >xl</UiCardContainer
            ></UiCard
          >
        </div>
        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <UiCard interactive
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >interactive</UiCardContainer
            ></UiCard
          >
          <UiCard hover
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >hover</UiCardContainer
            ></UiCard
          >
          <UiCard direction="row"
            ><UiCardContainer class="p-10 text-center text-sm font-bold"
              >direction=row</UiCardContainer
            ></UiCard
          >
        </div>
        <div class="mt-8 max-w-md">
          <UiContactCard :contact="demoContact" />
        </div>
      </div>
    </section>

    <!-- 3. FORMS -->
    <section class="mb-32">
      <UiSectionHeader
        title="Forms & Inputs"
        subtitle="Data entry."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div class="space-y-8">
            <UiInput
              id="f1"
              v-model="inputText"
              label="Standard Input"
              placeholder="Type something..."
            />
            <UiInput id="f2" label="With Prefix & Suffix">
              <template #prefix
                ><Icon name="heroicons:envelope" size="18"
              /></template>
              <template #suffix
                ><Icon
                  name="heroicons:check-circle"
                  size="18"
                  class="text-secondary-500"
              /></template>
            </UiInput>
            <UiInput
              id="f3"
              label="Required Field"
              placeholder="Obligatory..."
              required
            />
            <UiInput
              id="f4"
              label="Error State"
              :error="inputError"
              has-error
            />
          </div>
          <div class="space-y-8 lg:pl-16">
            <UiInput
              id="f5"
              v-model="inputTextarea"
              label="Textarea"
              as="textarea"
            />
            <UiSelect
              id="s1"
              v-model="selectedStatus"
              label="Single Select"
              :options="['published', 'draft', 'archived']"
            />
            <UiSelect
              id="s2"
              v-model="multiSelectValue"
              label="Multi Select"
              :options="['Vue', 'Nuxt', 'TypeScript', 'Tailwind CSS', 'Go']"
              multiple
            />
            <UiSelect
              id="s3"
              v-model="creatableValue"
              label="Creatable Select"
              :options="creatableOptions"
              creatable
              @create="handleCreate"
            />
            <div class="space-y-2">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Search Filter
              </p>
              <UiSearchFilter v-model:search-term="searchTerm" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. TAGS -->
    <section class="mb-32">
      <UiSectionHeader
        title="Tags & Status"
        subtitle="Classification."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="space-y-8">
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              All Statuses
            </p>
            <div class="flex flex-wrap gap-3">
              <UiTag
                v-for="s in tagStatuses"
                :key="s"
                :status="s"
                variant="status"
                shape="rounded"
                >{{ s }}</UiTag
              >
            </div>
          </div>
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Variants
            </p>
            <div class="flex flex-wrap gap-3">
              <UiTag variant="default">Default</UiTag>
              <UiTag variant="glow">Glow</UiTag>
              <UiTag variant="outline">Outline</UiTag>
              <UiTag variant="fill" color="primary">Fill Primary</UiTag>
            </div>
          </div>
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Colors
            </p>
            <div class="flex flex-wrap gap-3">
              <UiTag
                v-for="c in tagColors"
                :key="c"
                variant="fill"
                :color="c as any"
                >{{ c }}</UiTag
              >
            </div>
          </div>
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Sizes & Interactive
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <UiTag size="xs" variant="glow">Extra Small</UiTag>
              <UiTag size="sm" variant="glow">Small</UiTag>
              <UiTag size="md" variant="glow">Medium</UiTag>
              <UiTag variant="outline" interactive>Interactive</UiTag>
            </div>
          </div>
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Chips
            </p>
            <div class="flex flex-wrap gap-3">
              <UiChip closable @close="() => {}">Default Chip</UiChip>
              <UiChip variant="gradient">Gradient</UiChip>
              <UiChip variant="danger">Danger</UiChip>
              <UiChip variant="success">Success</UiChip>
              <UiChip variant="warning">Warning</UiChip>
              <UiChip variant="secondary">Secondary</UiChip>
              <UiChip interactive>Interactive</UiChip>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. FEEDBACK -->
    <section class="mb-32">
      <UiSectionHeader
        title="Feedback"
        subtitle="Alerts and Modals."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div class="space-y-4">
            <UiAlert variant="info" title="Info"
              >This is an information.</UiAlert
            >
            <UiAlert variant="success" title="Success"
              >Operation completed successfully.</UiAlert
            >
            <UiAlert variant="warning" title="Warning"
              >Please be careful.</UiAlert
            >
            <UiAlert variant="error" title="Error" closable
              >Something went wrong. Dismiss me!</UiAlert
            >
          </div>
          <div class="flex flex-col gap-6 lg:pl-16">
            <div class="space-y-3">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Toasts
              </p>
              <div class="flex flex-wrap gap-3">
                <UiButton size="sm" @click="triggerToast('success')"
                  >Success</UiButton
                >
                <UiButton size="sm" @click="triggerToast('info')"
                  >Info</UiButton
                >
                <UiButton size="sm" @click="triggerToast('warning')"
                  >Warning</UiButton
                >
                <UiButton
                  size="sm"
                  variant="danger"
                  @click="triggerToast('error')"
                  >Error</UiButton
                >
              </div>
            </div>
            <div class="space-y-3">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Modals
              </p>
              <div class="flex flex-wrap gap-3">
                <UiButton
                  size="sm"
                  variant="secondary"
                  @click="showSmallModal = true"
                  >Small</UiButton
                >
                <UiButton
                  size="sm"
                  variant="secondary"
                  @click="showDemoModal = true"
                  >Medium</UiButton
                >
                <UiButton
                  size="sm"
                  variant="secondary"
                  @click="showPersistentModal = true"
                  >Persistent</UiButton
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <UiModal v-model="showSmallModal" size="sm">
      <template #header
        ><h3 class="text-xl font-black">Small Modal</h3></template
      >
      <template #body><p>A compact modal dialog.</p></template>
      <template #footer
        ><UiButton @click="showSmallModal = false">Close</UiButton></template
      >
    </UiModal>
    <UiModal v-model="showDemoModal">
      <template #header
        ><h3 class="text-2xl font-black">Medium Modal</h3></template
      >
      <template #body
        ><p>Demonstration of the global modal component.</p></template
      >
      <template #footer
        ><UiButton @click="showDemoModal = false">Close</UiButton></template
      >
    </UiModal>
    <UiModal v-model="showPersistentModal" persistent>
      <template #header
        ><h3 class="text-2xl font-black">Persistent Modal</h3></template
      >
      <template #body
        ><p>
          This modal cannot be closed by clicking the backdrop or pressing
          Escape.
        </p></template
      >
      <template #footer
        ><UiButton @click="showPersistentModal = false"
          >Close</UiButton
        ></template
      >
    </UiModal>

    <!-- 6. CONTENT -->
    <section class="mb-32">
      <UiSectionHeader
        title="Content Tools"
        subtitle="Rich text and data."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="space-y-16">
          <div class="space-y-8">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Section Header Variants
            </p>
            <div class="space-y-12">
              <UiSectionHeader
                title="Glow Variant"
                subtitle="Default glow style."
                variant="glow"
              />
              <UiSectionHeader
                title="Tech Variant"
                subtitle="Monospace tech style."
                variant="tech"
              />
              <UiSectionHeader
                title="Nebula Variant"
                subtitle="Centered nebula style."
                variant="nebula"
              />
              <UiSectionHeader
                title="Minimal Variant"
                subtitle="Clean minimal style."
                variant="minimal"
              />
            </div>
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Content Editor
            </p>
            <UiContentEditor v-model="editorContent" />
          </div>
          <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div class="space-y-6">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Markdown
              </p>
              <div
                class="rounded-2xl border border-primary-100 bg-white p-8 dark:border-primary-800 dark:bg-primary-900"
              >
                <BaseMarkdown
                  content="**Bold**, *italic*, and [links](https://google.com) work here."
                />
              </div>
            </div>
            <div class="space-y-6 lg:pl-16">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Timeline
              </p>
              <UiTimeline :items="demoTimeline" />
            </div>
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Techstack (Static)
            </p>
            <TechstackList :items="demoTechstack" />
          </div>
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Techstack (Scrolling)
            </p>
            <TechstackList :items="demoTechstack" :rows="2" scroll />
          </div>
        </div>
      </div>
    </section>

    <!-- 7. STATS -->
    <section class="mb-32">
      <UiSectionHeader title="Stats" subtitle="Key figures." class="mb-16" />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div class="space-y-6">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Stacked Layout
            </p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UiQuickStat
                icon="heroicons:briefcase"
                label="Projects"
                value="12"
                layout="stacked"
              />
              <UiQuickStat
                icon="heroicons:document-text"
                label="Blog Posts"
                value="34"
                layout="stacked"
              />
            </div>
          </div>
          <div class="space-y-6 lg:pl-16">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Inline Layout
            </p>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UiQuickStat
                icon="heroicons:code-bracket"
                label="Technologies"
                value="8"
                layout="inline"
              />
              <UiQuickStat
                icon="heroicons:star"
                label="GitHub Stars"
                value="128"
                layout="inline"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. DISPLAY -->
    <section class="mb-32">
      <UiSectionHeader
        title="Display Components"
        subtitle="Frontend cards."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div class="space-y-12">
            <div class="space-y-4">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Project Card
              </p>
              <ProjectCard :project="mockProject" />
            </div>
            <div class="space-y-4">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Blog Card
              </p>
              <BlogPostCard :post="mockPost" />
            </div>
          </div>
          <div class="space-y-12 lg:pl-16">
            <div class="space-y-4">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Application Card
              </p>
              <ApplicationCard :application="mockApplication" />
            </div>
            <div class="space-y-4">
              <p
                class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
              >
                Status & Social
              </p>
              <div
                class="flex items-center justify-between rounded-2xl border border-primary-100 bg-white p-8 dark:border-primary-800 dark:bg-primary-900"
              >
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold text-primary-500"
                    >Status:</span
                  >
                  <NowIndicator />
                </div>
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16 space-y-12">
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Application Stats
            </p>
            <ApplicationStats :applications="mockApplications" />
          </div>
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              GitHub Contribution Chart
            </p>
            <GithubChart :contributions="mockContributions" />
          </div>
        </div>
      </div>
    </section>

    <!-- 9. NAVIGATION & UTILS -->
    <section class="mb-32 pb-32">
      <UiSectionHeader
        title="Navigation & Utils"
        subtitle="Utility components."
        class="mb-16"
      />
      <div
        :class="[surfaceClasses, surfacePadding]"
        class="transition-all duration-500"
      >
        <div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div class="space-y-4">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Image Uploader
            </p>
            <UiImageUploader label="Upload Image" />
          </div>
          <div class="space-y-4 lg:pl-10">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Back Actions
            </p>
            <UiBackButton to="/" />
          </div>
          <div class="space-y-4 lg:pl-10">
            <p
              class="text-[10px] font-black uppercase tracking-[0.3em] text-secondary-500"
            >
              Locale Switcher
            </p>
            <StudioLocaleSwitcher
              model-value="en"
              @update:model-value="() => {}"
            />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
