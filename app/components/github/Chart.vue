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
    <div
      v-if="tooltip.visible"
      :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      class="pointer-events-none absolute z-50 rounded-lg border border-neutral-300/40 bg-gradient-to-br from-neutral-100/40 to-neutral-200/40 px-3 py-2 text-neutral-950 shadow-lg backdrop-blur-md transition-opacity duration-200 dark:border-neutral-700/40 dark:from-neutral-900/40 dark:to-neutral-800/40 dark:text-white"
    >
      {{ tooltip.content }}
    </div>
  </div>
</template>

<script setup lang="ts">
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

const roundedCorner = props.roundedCorner ?? 5
const gap = props.gap ?? 4
const minSquareSize = props.minSquareSize ?? 14
const maxSquareSize = props.maxSquareSize ?? 18
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
  content: ''
})

const formatDate = (isoDate: string) => {
  const date = new Date(isoDate)
  return date.toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Tooltip-Handler
function showTooltip(event: MouseEvent, day: Contribution) {
  if (!container.value || day.count == 0) return
  const rect = container.value.getBoundingClientRect()
  tooltip.value = {
    visible: true,
    x: event.clientX - rect.left + 12,
    y: event.clientY - rect.top + 12,
    content: day.count === 1 ? t("home.overview.github.tooltip.single", { count: day.count, date: formatDate(day.date) }) : t("home.overview.github.tooltip.many", { count: day.count, date: formatDate(day.date) })
  }
}
function hideTooltip() {
  tooltip.value.visible = false
}

// Datenaufbereitung
const allWeeksData = computed(() => {
  const weeks: Contribution[][] = []
  const contributionMap = new Map(
    Array.isArray(props.contributions)
      ? props.contributions.map(c => [c.date.slice(0, 10), c.count])
      : []
  )

  // Startdatum: Heute vor 52 Wochen
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 7 * 52 + 1)

  // Zum letzten Sonntag vor dem Startdatum springen
  const startSunday = new Date(startDate)
  startSunday.setDate(startSunday.getDate() - ((startSunday.getDay() + 6) % 7))

  // 52 Wochen aufbauen
  for (let weekIndex = 0; weekIndex < 52; weekIndex++) {
    const week: Contribution[] = []
    const weekStart = new Date(startSunday)
    weekStart.setDate(weekStart.getDate() + 7 * weekIndex)
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const currentDate = new Date(weekStart)
      currentDate.setDate(currentDate.getDate() + dayIndex)

      // Nur Tage bis zum heutigen Datum in der letzten Woche hinzufügen
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
  if (!container.value) {
    displayedWeeks.value = allWeeksData.value.slice(-initialWeeks)
    currentSquareSize.value = maxSquareSize
    currentGap.value = gap
    totalCalculatedWidth.value = displayedWeeks.value.length * (currentSquareSize.value + currentGap.value) - currentGap.value
    emit('displayedWeeksCountChanged', displayedWeeks.value.length)
    return
  }
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
  const colors = [
    'dark:fill-neutral-900 fill-neutral-100 dark:stroke-neutral-800 stroke-neutral-200',
    'dark:fill-secondary-300 fill-secondary-700 hover:scale-125 hover:shadow-lg transition-transform origin-center',
    'dark:fill-secondary-400 fill-secondary-600 hover:scale-125 hover:shadow-lg transition-transform origin-center',
    'dark:fill-secondary-500 fill-secondary-500 yhover:scale-125 hover:shadow-lg transition-transform origin-center',
    'dark:fill-secondary-600 fill-secondary-400 hover:scale-125 hover:shadow-lg transition-transform origin-center',
  ]
  return colors[level]
}

let resizeObserver: ResizeObserver | null = null
let resizeTimeout: ReturnType<typeof setTimeout>;

const debouncedUpdate = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateDisplayedWeeks, 150);
};
// Lifecycle
onMounted(() => {
  // Warte auf den ersten Render-Zyklus
  if(import.meta.client) {
  nextTick(() => {
    // Initiale Berechnung nur wenn Container existiert
    if (container.value) {
      updateDisplayedWeeks()
    }
    
    // ResizeObserver initialisieren
    resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(container.value!)
  })
}
})
onUnmounted(() => {
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value)
  }
  window.removeEventListener('resize', updateDisplayedWeeks)
})

// Aktualisiere bei Änderung der Contributions
watch(() => props.contributions, updateDisplayedWeeks, { immediate: true })

</script>
