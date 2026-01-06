<template>
  <div class="flex flex-col gap-0 overflow-hidden py-2">
    <template v-if="scroll">
      <div
        v-for="(row, rowIndex) in rowItems" :key="'marquee-row-' + rowIndex"
        class="marquee-row w-full overflow-hidden py-1">
        <div
          :ref="el => setMarqueeRef(el as HTMLElement | null, rowIndex)"
          class="marquee flex gap-3 whitespace-nowrap"
          :style="{ animationDuration: animationDurations[rowIndex] + 's' }">
          
          <!-- Modern Tech Module -->
          <div 
            v-for="(item, index) in [...row, ...row]" 
            :key="index" 
            class="group relative flex items-center gap-3 rounded-xl border border-neutral-200/50 bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-secondary-500/30 hover:bg-white/80 dark:border-neutral-800/50 dark:bg-neutral-900/40 dark:hover:border-secondary-400/30 dark:hover:bg-neutral-900/80"
          >
            <!-- Background Glow -->
            <div class="absolute inset-0 -z-10 bg-gradient-to-br from-secondary-500/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
            
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 p-1.5 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-800 dark:group-hover:bg-secondary-900/30">
                <Icon 
                    v-if="techIcons[item]" 
                    :name="techIcons[item]" 
                    class="text-xl text-neutral-600 transition-colors group-hover:text-secondary-500 dark:text-neutral-400 dark:group-hover:text-secondary-400" 
                />
                <Icon v-else name="mage:box-3d" class="text-xl text-neutral-400" />
            </div>
            
            <span class="text-sm font-bold tracking-tight text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
                {{ item }}
            </span>
          </div>

        </div>
      </div>
    </template>

    <template v-else>
      <div v-for="(row, rowIndex) in rowItems" :key="'static-row-' + rowIndex" class="flex flex-wrap gap-3 py-1">
        <!-- Modern Tech Module (Static) -->
        <div 
          v-for="(item, index) in row" 
          :key="index" 
          class="group relative flex items-center gap-3 rounded-xl border border-neutral-200/50 bg-white/40 px-4 py-2 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-secondary-500/30 hover:bg-white/80 dark:border-neutral-800/50 dark:bg-neutral-900/40 dark:hover:border-secondary-400/30 dark:hover:bg-neutral-900/80"
        >
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 p-1.5 transition-colors group-hover:bg-secondary-50 dark:bg-neutral-800 dark:group-hover:bg-secondary-900/30">
              <Icon 
                  v-if="techIcons[item]" 
                  :name="techIcons[item]" 
                  class="text-xl text-neutral-600 transition-colors group-hover:text-secondary-500 dark:text-neutral-400 dark:group-hover:text-secondary-400" 
              />
              <Icon v-else name="mage:box-3d" class="text-xl text-neutral-400" />
          </div>
          <span class="text-sm font-bold tracking-tight text-neutral-700 transition-colors group-hover:text-neutral-900 dark:text-neutral-300 dark:group-hover:text-white">
              {{ item }}
          </span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

const techIcons: Record<string, string> = {
  'Linux': 'uil:linux',
  'Docker': 'mdi:docker',
  'Caddy': 'file-icons:caddy',
  'Authentik': 'simple-icons:authentik',
  'Grafana': 'devicon-plain:grafana',
  'Home Assistant': 'simple-icons:homeassistant',
  'Git': 'simple-icons:git',
  'React': 'simple-icons:react',
  'Vue': 'teenyicons:vue-solid',
  'Flutter': 'simple-icons:flutter',
  'Typescript': 'simple-icons:typescript',
  'Dart': 'simple-icons:dart',
  'Rust': 'simple-icons:rust',
  'Tailwind': 'simple-icons:tailwindcss',
  'Nuxt': 'simple-icons:nuxt',
  'Markdown': 'simple-icons:markdown',
  'Vite': 'simple-icons:vite',
  'SQL': 'mage:database',
  'GitHub Actions': 'devicon-plain:githubactions',
  'LLM': 'simple-icons:openai',
  'Firebase': 'simple-icons:firebase',
  'Node.js': 'simple-icons:nodedotjs',
  'Deno': 'simple-icons:deno',
  'Python': 'simple-icons:python',
  'PostgreSQL': 'simple-icons:postgresql',
  'MongoDB': 'simple-icons:mongodb',
  'REST': 'mdi:api',
  'GraphQL': 'simple-icons:graphql',
  'Java': 'devicon-plain:java',
  'Gradle': 'simple-icons:gradle',
};

const props = defineProps<{
  items: string[],
  scroll?: boolean,
  rows?: number
}>();

const scroll = computed(() => props.scroll ?? false);
const rows = computed(() => props.rows ?? 1);

function chunkArray<T>(arr: T[], chunkCount: number): T[][] {
  const result: T[][] = Array.from({ length: chunkCount }, () => []);
  arr.forEach((item, idx) => {
    result[idx % chunkCount]!.push(item);
  });
  return result;
}

const rowItems = computed(() => chunkArray(props.items, rows.value));

const marqueeRefs = ref<(HTMLElement | null)[]>([]);
const animationDurations = ref<number[]>([]);

function setMarqueeRef(el: HTMLElement | null, idx: number) {
  marqueeRefs.value[idx] = el;
}

function updateDurations() {
  if (!scroll.value || typeof window === 'undefined') return;
  animationDurations.value = marqueeRefs.value.map((el, i) => {
    if (el) {
      const width = el.scrollWidth;
      return width / (20 + (i * 10));
    }
    return 20;
  });
}

onMounted(() => {
  if (scroll.value) {
    setTimeout(updateDurations, 100);
  }
});

watch([rowItems, scroll], () => {
  if (scroll.value) {
    setTimeout(updateDurations, 100);
  }
});
</script>

<style scoped>
.marquee {
  display: inline-flex;
  animation: marquee-scroll linear infinite;
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}

@keyframes marquee-scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}

.marquee-row {
  width: 100%;
  overflow: hidden;
}
</style>
