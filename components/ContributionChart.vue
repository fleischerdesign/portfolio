<template>
  <div ref="container" class="w-full overflow-visible">
    <svg
      ref="svg"
      class="overflow-visible"
      :viewBox="`0 0 ${totalCalculatedWidth} ${totalHeight}`"
      :style="{ width: `${totalCalculatedWidth}px`, height: `${totalHeight}px` }"
      preserveAspectRatio="xMinYMin meet"
    >
      <g v-for="(week, weekIndex) in displayedWeeks" :key="weekIndex" :transform="`translate(${weekIndex * (currentSquareSize + currentGap)}, 0)`">
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
          class=""
        >
          <title class="text-sm font-medium">
            {{ day.count }} contributions on {{ formatDate(day.date) }}
          </title>
        </rect>
      </g>
    </svg>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  props: {
    contributions: {
      type: Array,
      required: true,
      validator: (value) =>
        value.every(
          (item) =>
            item.date &&
            typeof item.date === 'string' &&
            typeof item.count === 'number'
        ),
    },
    roundedCorner: {
      type: Number,
      default: 5,
    },
    gap: {
      type: Number,
      default: 4,
    },
    minSquareSize: {
      type: Number,
      default: 14,
    },
    maxSquareSize: {
      type: Number,
      default: 18,
    },
    initialWeeks: {
      type: Number,
      default: 26,
    },
  },

  emits: ['displayedWeeksCountChanged'],

  setup(props, { emit }) {
    const container = ref(null);
    const svg = ref(null);
    const totalHeight = computed(() => 7 * (currentSquareSize.value + currentGap.value) - currentGap.value);
    const allWeeksData = computed(() => {
      const weeks = Array.from({ length: 52 }, () => Array(7).fill(null));
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth() - 12,
        today.getDate()
      );
      const startSunday = new Date(startDate);
      startSunday.setDate(startSunday.getDate() - startSunday.getDay());

      const contributionMap = props.contributions.reduce((acc, curr) => {
        acc[curr.date] = curr.count;
        return acc;
      }, {});

      for (let weekIndex = 51; weekIndex >= 0; weekIndex--) {
        const weekDate = new Date(startSunday);
        weekDate.setDate(weekDate.getDate() + 7 * weekIndex);

        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
          const currentDate = new Date(weekDate);
          currentDate.setDate(currentDate.getDate() + dayIndex);
          const isoDate = currentDate.toISOString().split('T')[0];

          weeks[weekIndex][dayIndex] = {
            date: isoDate,
            count: contributionMap[isoDate] || 0,
          };
        }
      }
      return weeks;
    });

    const displayedWeeks = ref([]);
    const totalCalculatedWidth = ref(0);
    const currentSquareSize = ref(props.maxSquareSize); // Initialwert
    const currentGap = ref(props.gap);

const updateDisplayedWeeks = () => {
  if (!container.value) {
    displayedWeeks.value = allWeeksData.value.slice(-props.initialWeeks);
    currentSquareSize.value = props.maxSquareSize;
    currentGap.value = props.gap;
    totalCalculatedWidth.value = displayedWeeks.value.length * (currentSquareSize.value + currentGap.value) - currentGap.value;
    emit('displayedWeeksCountChanged', displayedWeeks.value.length);
    return;
  }

  const containerWidth = container.value.offsetWidth;
  const availableWidthPerWeekWithMinSize = props.minSquareSize + props.gap;
  const maxPossibleWeeks = Math.floor(containerWidth / availableWidthPerWeekWithMinSize);
  const optimalWeeks = Math.min(maxPossibleWeeks, allWeeksData.value.length);

  // Berechne die Quadratgröße so, dass alle optimalen Wochen + Gaps in den Container passen
  currentSquareSize.value = Math.max(
    props.minSquareSize,
    Math.min(
      props.maxSquareSize,
      (containerWidth - (optimalWeeks - 1) * props.gap) / optimalWeeks
    )
  );
  currentGap.value = props.gap; // Verwende einen festen Gap

  displayedWeeks.value = allWeeksData.value.slice(-optimalWeeks);
  totalCalculatedWidth.value = displayedWeeks.value.length * (currentSquareSize.value + currentGap.value) - currentGap.value;
  emit('displayedWeeksCountChanged', displayedWeeks.value.length);
  if (svg.value) {
    svg.value.style.width = `${containerWidth}px`; // Breite des SVG an Container anpassen
  }
};

    const getColorLevel = (count) => {
      if (count === 0) return 0;
      if (count < 3) return 1;
      if (count < 6) return 2;
      if (count < 9) return 3;
      return 4;
    };

    const getColorClass = (count) => {
      const level = getColorLevel(count);
      const colors = [
        'fill-primary-900 dark:fill-primary-900/60',
        'fill-green-300 dark:fill-green-800 hover:scale-125 hover:shadow-lg transition-transform origin-center',
        'fill-green-400 dark:fill-green-600 hover:scale-125 hover:shadow-lg transition-transform origin-center',
        'fill-green-500 dark:fill-green-400 hover:scale-125 hover:shadow-lg transition-transform origin-center',
        'fill-green-600 dark:fill-green-200 hover:scale-125 hover:shadow-lg transition-transform origin-center',
      ];
      return colors[level];
    };

    const formatDate = (isoDate) => {
      const date = new Date(isoDate);
      return date.toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    onMounted(() => {
      updateDisplayedWeeks();
      window.addEventListener('resize', updateDisplayedWeeks);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', updateDisplayedWeeks);
    });

    return {
      container,
      svg,
      totalHeight,
      allWeeksData,
      displayedWeeks,
      totalCalculatedWidth,
      currentSquareSize,
      currentGap,
      getColorClass,
      formatDate,
    };
  },
};
</script>

<style scoped>
svg {
  display: block;
  height: auto;
  max-width: 100%; /* Wichtig, damit SVG nicht breiter als Container wird */
}
</style>