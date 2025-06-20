<template>
  <div class="overflow-hidden flex flex-col gap-2">
    <!-- Mit Scroll-Effekt -->
    <template v-if="scroll">
      <div
        v-for="(row, rowIndex) in rowItems"
        :key="'marquee-row-' + rowIndex"
        class="marquee-row w-full overflow-hidden"
        :style="{ height: '40px' }"
      >
        <div
          class="marquee flex gap-2 whitespace-nowrap"
          :style="{ animationDuration: animationDurations[rowIndex] + 's' }"
          :ref="el => setMarqueeRef(el, rowIndex)"
        >
          <Tag v-for="(item, index) in [...row, ...row]" :key="index" fill>
            <Icon v-if="techIcons[item]" :name="techIcons[item]" class="text-xl" />
            <span>{{ item }}</span>
          </Tag>
        </div>
      </div>
    </template>
    <!-- Ohne Scroll-Effekt -->
    <template v-else>
      <div
        v-for="(row, rowIndex) in rowItems"
        :key="'static-row-' + rowIndex"
        class="flex flex-wrap gap-2"
      >
        <Tag v-for="(item, index) in row" :key="index" fill>
          <Icon v-if="techIcons[item]" :name="techIcons[item]" class="text-xl" />
          <span>{{ item }}</span>
        </Tag>
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
  'GraphQL': 'simple-icons:graphql'
};

const props = defineProps<{
  items: string[],
  scroll?: boolean,
  rows?: number
}>();

const scroll = computed(() => props.scroll ?? false);
const rows = computed(() => props.rows ?? 1);

// Items gleichmäßig auf Zeilen verteilen
function chunkArray<T>(arr: T[], chunkCount: number): T[][] {
  const result: T[][] = Array.from({ length: chunkCount }, () => []);
  arr.forEach((item, idx) => {
    result[idx % chunkCount].push(item);
  });
  return result;
}

const rowItems = computed(() => chunkArray(props.items, rows.value));

// Refs und Animationsdauern für jede Zeile
const marqueeRefs = ref<(HTMLElement | null)[]>([]);
const animationDurations = ref<number[]>([]);

// Ref Setter für v-for
function setMarqueeRef(el: HTMLElement | null, idx: number) {
  marqueeRefs.value[idx] = el;
}

// Animationsdauer pro Zeile berechnen (nur im Client)
function updateDurations() {
  if (!scroll.value || typeof window === 'undefined') return;
  animationDurations.value = marqueeRefs.value.map((el, i) => {
    if (el) {
      const width = el.scrollWidth;
      // Optional: Geschwindigkeit pro Zeile leicht variieren
      return width / (20 + (i * 10));
    }
    return 20;
  });
}

onMounted(() => {
  if (scroll.value) {
    // Timeout für initiales Rendern, damit die DOM-Breiten stimmen
    setTimeout(updateDurations, 100);
  }
});

// Bei Änderung der Items/Zeilen neu berechnen
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
