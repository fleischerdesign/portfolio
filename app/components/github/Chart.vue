<template>
  <div ref="container" class="relative w-full overflow-visible">
    <svg
      v-if="contributions && contributions.length"
      ref="svg"
      class="overflow-visible"
      :viewBox="`0 0 ${totalCalculatedWidth} ${totalHeight}`"
      :style="{ width: `${totalCalculatedWidth}px`, height: `${totalHeight}px` }"
      preserveAspectRatio="xMinYMin meet"
    >
      <g
        v-for="(week, weekIndex) in displayedWeeks"
        :key="weekIndex"
        :transform="`translate(${weekIndex * (currentSquareSize + currentGap)}, 0)`"
      >
        <rect
          v-for="(day, dayIndex) in week"
          :key="dayIndex"
          :x="0"
          :y="dayIndex * (currentSquareSize + currentGap)"
          :width="currentSquareSize"
          :height="currentSquareSize"
          :class="getColorClass(day.count)"
          :rx="roundedCorner"
          :ry="roundedCorner"
          style="transform-box: fill-box"
          @mouseenter="event => showTooltip(event, day)"
          @mousemove="event => showTooltip(event, day)"
          @mouseleave="hideTooltip"
        />
      </g>
    </svg>

    <!-- Premium Glass Tooltip -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-1"
      >
          <div
            v-if="tooltip.visible"
            :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
            class="pointer-events-none fixed z-[9999] rounded-xl border border-neutral-200/60 bg-white/80 px-4 py-2.5 text-sm font-bold shadow-2xl backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-900/80"
          >
            <!-- Tooltip Arrow/Accent -->
            <div class="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 border-b border-l border-neutral-200/60 bg-white/80 dark:border-neutral-800/60 dark:bg-neutral-900/80"></div>
            
            <div class="relative flex flex-col gap-0.5">
                <span class="text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{{ formatDateShort(tooltip.date) }}</span>
                <span class="text-neutral-900 dark:text-white">
                    <span class="text-secondary-500">{{ tooltip.count }}</span>
                    {{ tooltip.count === 1 ? 'Beitrag' : 'Beiträge' }}
                </span>
            </div>
          </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef, onMounted, onUnmounted, nextTick, watch } from 'vue';

const { t, locale } = useI18n();

interface Contribution {
  date: string
  count: number
}

const props = defineProps<{
  contributions: Contribution[] | null
  roundedCorner?: number
  gap?: number
  minSquareSize?: number
  maxSquareSize?: number
  initialWeeks?: number
}>()

const emit = defineEmits<{
  (e: 'displayedWeeksCountChanged', count: number): void
}>()

const roundedCorner = props.roundedCorner ?? 4
const gap = props.gap ?? 4
const minSquareSize = props.minSquareSize ?? 12
const maxSquareSize = props.maxSquareSize ?? 16
const initialWeeks = props.initialWeeks ?? 26

const container = ref<HTMLElement | null>(null)
const svg = ref<SVGSVGElement | null>(null)

const currentSquareSize = ref(maxSquareSize)
const currentGap = ref(gap)
const totalCalculatedWidth = ref(0)

const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  count: 0,
  date: ''
})

const formatDateShort = (isoDate: string) => {
  if (!isoDate) return ''
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale.value, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function showTooltip(event: MouseEvent, day: Contribution) {
  if (!container.value) return
  // Using clientX/Y directly for fixed positioning in Teleport
  tooltip.value = {
    visible: true,
    x: event.clientX + 15,
    y: event.clientY - 20, 
    count: day.count,
    date: day.date
  }
}
function hideTooltip() {
  tooltip.value.visible = false
}

const allWeeksData = computed(() => {
  const weeks: Contribution[][] = []
  const contributionMap = new Map(
    Array.isArray(props.contributions)
      ? props.contributions.map(c => [c.date.slice(0, 10), c.count])
      : []
  )

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 7 * 52 + 1)

  const startSunday = new Date(startDate)
  startSunday.setDate(startSunday.getDate() - ((startSunday.getDay() + 6) % 7))

  for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
    const week: Contribution[] = []
    const weekStart = new Date(startSunday)
    weekStart.setDate(weekStart.getDate() + 7 * weekIndex)
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const currentDate = new Date(weekStart)
      currentDate.setDate(currentDate.getDate() + dayIndex)

      if (weekIndex === 51 && currentDate > today) {
        break;
      }

      const isoDate = currentDate.toISOString().slice(0, 10)
      week.push({
        date: isoDate,
        count: contributionMap.get(isoDate) || 0
      })
    }
    weeks.push(week)
  }
  return weeks
})

const displayedWeeks = shallowRef<Contribution[][]>([])

const totalHeight = computed(() =>
  7 * (currentSquareSize.value + currentGap.value) - currentGap.value
)

function updateDisplayedWeeks() {
  if (!container.value || container.value.offsetWidth === 0) return
  
  const containerWidth = container.value.offsetWidth
  const availableWidthPerWeekWithMinSize = minSquareSize + gap
  const maxPossibleWeeks = Math.floor(containerWidth / availableWidthPerWeekWithMinSize)
  const optimalWeeks = Math.min(maxPossibleWeeks, allWeeksData.value.length)

  currentSquareSize.value = Math.max(
    minSquareSize,
    Math.min(
      maxSquareSize,
      (containerWidth - (optimalWeeks - 1) * gap) / optimalWeeks
    )
  )
  currentGap.value = gap
  displayedWeeks.value = allWeeksData.value.slice(-optimalWeeks)
  totalCalculatedWidth.value = displayedWeeks.value.length * (currentSquareSize.value + currentGap.value) - currentGap.value
  emit('displayedWeeksCountChanged', displayedWeeks.value.length)
  if (svg.value) {
    svg.value.style.width = `${containerWidth}px`
  }
}

function getColorLevel(count: number) {
  if (count === 0) return 0
  if (count < 3) return 1
  if (count < 6) return 2
  if (count < 9) return 3
  return 4
}

function getColorClass(count: number) {
  const level = getColorLevel(count)
  const baseClasses = 'transition-all duration-300 origin-center'
  
  const colors = [
    'fill-neutral-200 dark:fill-neutral-800/50', // Level 0: Subtle Grid
    'fill-secondary-300 dark:fill-secondary-900/40 hover:fill-secondary-400 hover:scale-125 hover:drop-shadow-glow',
    'fill-secondary-400 dark:fill-secondary-700/60 hover:fill-secondary-500 hover:scale-125 hover:drop-shadow-glow',
    'fill-secondary-500 dark:fill-secondary-500/80 hover:fill-secondary-400 hover:scale-125 hover:drop-shadow-glow',
    'fill-secondary-600 dark:fill-secondary-400 hover:fill-secondary-300 hover:scale-125 hover:drop-shadow-glow',
  ]
  return `${baseClasses} ${colors[level]}`
}

let resizeObserver: ResizeObserver | null = null
let resizeTimeout: ReturnType<typeof setTimeout>;

const debouncedUpdate = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateDisplayedWeeks, 150);
};

onMounted(() => {
  if(import.meta.client) {
    nextTick(() => {
      if (container.value) {
        updateDisplayedWeeks()
      }
      resizeObserver = new ResizeObserver(debouncedUpdate);
      resizeObserver.observe(container.value!)
    })
  }
})

onUnmounted(() => {
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value)
  }
})

watch(() => props.contributions, updateDisplayedWeeks, { immediate: true })
</script>