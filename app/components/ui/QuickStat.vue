<script setup lang="ts">
interface Props {
  icon?: string;
  label?: string;
  value?: string | number;
  layout?: 'stacked' | 'inline';
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'stacked',
});

const containerClasses = useCva(
  { layout: props.layout },
  'flex items-center transition-all duration-500',
  {
    layout: {
      stacked: 'gap-5',
      inline: 'justify-between w-full rounded-2xl border border-primary-200/50 bg-white/50 p-4 shadow-sm backdrop-blur-sm hover:border-secondary-500/30 hover:bg-secondary-50/50 dark:border-primary-800/50 dark:bg-primary-900/40 dark:hover:border-secondary-400/30 dark:hover:bg-secondary-900/20',
    }
  }
);

const iconWrapperClasses = useCva(
  { layout: props.layout },
  'flex flex-shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform',
  {
    layout: {
      stacked: 'h-14 w-14 border-secondary-200/50 bg-secondary-50 text-secondary-600 dark:border-secondary-500/20 dark:bg-secondary-900/30 dark:text-secondary-400',
      inline: 'h-10 w-10 border-transparent bg-secondary-100 text-secondary-600 group-hover:scale-110 dark:bg-secondary-900/40 dark:text-secondary-400',
    }
  }
);

const valueClasses = useCva(
  { layout: props.layout },
  'font-bold text-secondary-600 dark:text-secondary-400',
  {
    layout: {
      stacked: 'text-xl text-primary-900 dark:text-white',
      inline: 'text-xl',
    }
  }
);
</script>

<template>
  <div :class="containerClasses" class="group">
    <!-- Left side: Icon + Info (for both layouts) -->
    <div class="flex items-center" :class="layout === 'stacked' ? 'gap-5' : 'gap-4'">
      <!-- Icon -->
      <div v-if="icon || $slots.icon" :class="iconWrapperClasses">
        <slot name="icon">
          <Icon v-if="icon" :name="icon" :size="layout === 'stacked' ? '28' : '20'" />
        </slot>
      </div>

      <!-- Label & Value (Stacked) or Label (Inline) -->
      <div class="min-w-0 flex-1">
        <p
          v-if="label || $slots.label"
          class="font-black uppercase tracking-[0.2em] text-primary-400 dark:text-primary-500"
          :class="layout === 'stacked' ? 'text-[10px]' : 'text-base font-medium text-primary-700 dark:text-primary-300 !tracking-normal !normal-case'"
        >
          <slot name="label">{{ label }}</slot>
        </p>
        
        <div v-if="layout === 'stacked'" class="mt-0.5 flex flex-col">
          <div :class="valueClasses" class="truncate">
            <slot name="value">{{ value }}</slot>
          </div>
          <div v-if="$slots.footer" class="mt-0.5 text-xs font-medium text-primary-500 dark:text-primary-400">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>

    <!-- Right side: Value (only for Inline layout) -->
    <div v-if="layout === 'inline'" :class="valueClasses">
      <slot name="value">{{ value?.toLocaleString() }}</slot>
    </div>
  </div>
</template>
