<script lang="ts">
export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon?: string;
  skills?: string[];
  id?: number | string;
  type?: string;
  _deleted?: boolean;
  [key: string]: any;
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  items: TimelineItem[];
  isPrintView?: boolean;
  compact?: boolean;
}>(), {
  isPrintView: false,
  compact: false,
});

const timelineClasses = useCva(
  { compact: props.compact },
  'relative',
  {
    compact: {
      true: 'py-4',
      false: 'py-10',
    }
  }
);

const lineClasses = useCva(
  { isPrintView: props.isPrintView, compact: props.compact },
  'absolute w-px bg-gradient-to-b from-transparent via-secondary-500/50 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]',
  {
    isPrintView: {
      true: 'hidden',
      false: 'block'
    },
    compact: {
      true: 'left-5 top-0 h-full',
      false: 'left-1/2 top-0 h-full -translate-x-1/2 transform hidden md:block',
    }
  },
  [
    { isPrintView: true, class: '!hidden' }
  ]
);

const itemClasses = useCva(
  { isPrintView: props.isPrintView, compact: props.compact },
  'relative',
  {
    isPrintView: { true: 'is-print', false: 'is-not-print' },
    compact: { true: 'is-compact', false: 'is-not-compact' }
  },
  [
    { isPrintView: true, compact: true, class: 'mb-4' },
    { isPrintView: true, compact: false, class: 'mb-8' },
    { isPrintView: false, compact: true, class: 'mb-8' },
    { isPrintView: false, compact: false, class: 'mb-16' },
  ]
);
</script>

<template>
  <div :class="timelineClasses">
    <!-- Center Line (With Glow) -->
    <div v-if="!isPrintView && !compact" class="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-secondary-500/50 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)] md:hidden"></div>
    <div :class="lineClasses"></div>

    <div v-for="(item, index) in items" :key="index" :class="itemClasses">
      <div class="flex items-center">
        
        <!-- Timeline Dot/Icon (Mobile) -->
        <div 
          v-if="!compact && !isPrintView"
          class="absolute left-5 z-10 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-xl border border-secondary-500/30 bg-white shadow-xl shadow-secondary-500/10 backdrop-blur-md dark:bg-neutral-900 md:hidden" 
        >
          <Icon v-if="item.icon" :name="item.icon" size="20" class="text-secondary-600 dark:text-secondary-400" />
          <div class="absolute inset-0 animate-pulse rounded-xl bg-secondary-500/5 blur-sm"></div>
        </div>
        
        <!-- Timeline Dot/Icon (Desktop) -->
        <div 
          v-if="!compact && !isPrintView"
          class="absolute left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-2xl border border-secondary-500/30 bg-white shadow-2xl shadow-secondary-500/10 backdrop-blur-md dark:bg-neutral-900 md:flex" 
        >
          <Icon v-if="item.icon" :name="item.icon" size="24" class="text-secondary-600 dark:text-secondary-400" />
          <div class="absolute inset-0 animate-pulse rounded-2xl bg-secondary-500/10 blur-md"></div>
        </div>
        
        <!-- Timeline Card -->
        <UiCard
          shadow="md"
          hover
          :class="[
            'flex-col',
            compact ? 'p-4' : 'p-6 lg:p-8',
            (isPrintView || compact) ? 'ml-0' : 'ml-14',
            'w-full',
            {'md:ml-0': !isPrintView && !compact},
            {'md:w-[42%]': !isPrintView && !compact},
            index % 2 === 0
              ? (isPrintView || compact ? 'justify-start text-left' : 'md:mr-auto md:text-right')
              : (isPrintView || compact ? 'justify-start text-left' : 'md:ml-auto md:text-left'),
          ]"
        >
          <slot :item="item" :index="index">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold uppercase tracking-widest text-secondary-500" :class="{'text-[10px]': compact}">{{ item.date }}</span>
              <h3 class="flex items-center gap-3 font-bold text-neutral-900 dark:text-white" :class="[compact ? 'text-lg' : 'text-2xl', {'md:flex-row-reverse': !isPrintView && !compact && index % 2 === 0}]">
                <Icon v-if="compact && item.icon" :name="item.icon" class="text-secondary-500 opacity-50" size="18" />
                {{ item.title }}
              </h3>
            </div>
            
            <p class="mt-2 leading-relaxed text-neutral-600 dark:text-neutral-400" :class="compact ? 'text-sm' : 'text-lg'">{{ item.description }}</p>
            
            <div 
              v-if="item.skills && item.skills.length && !isPrintView" 
              class="mt-6 flex flex-wrap gap-2" 
              :class="index % 2 === 0 ? (isPrintView || compact ? 'justify-start' : 'md:justify-end') : 'justify-start'"
            >
              <UiTag v-for="(skill, skillIndex) in item.skills" :key="skillIndex" variant="glow">
                {{ skill }}
              </UiTag>
            </div>
          </slot>
        </UiCard >
      </div>
    </div>
  </div>
</template>
