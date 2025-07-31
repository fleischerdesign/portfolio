<template>
  <div class="relative">
    <!-- Vertical line - mobile -->
    <div class="absolute left-5 top-0 h-full w-0.5 bg-secondary-400" :class="{'md:hidden': !isPrintView, 'hidden': isPrintView}"></div>
    
    <!-- Vertical line - desktop -->
    <div class="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 transform bg-secondary-400" :class="{'hidden': isPrintView, 'md:block': !isPrintView}"></div>

    <div v-for="(item, index) in items" :key="index" class="relative" :class="isPrintView ? 'mb-6' : 'mb-12'">
      <div class="flex">
        <!-- Mobile circle with icon -->
        <div class="absolute left-5 z-10 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-secondary-400" :class="{'md:hidden': !isPrintView, 'hidden': isPrintView}">
          <Icon :name="item.icon" size="20" class="text-white dark:text-gray-900" />
        </div>
        
        <!-- Desktop circle with icon -->
        <div class="absolute left-1/2 z-10 hidden h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-full bg-secondary-400" :class="{'hidden': isPrintView, 'md:flex': !isPrintView}">
          <Icon :name="item.icon" size="20" class="text-white dark:text-gray-900" />
        </div>
        
        <!-- Content container -->
        <UiCard
:class="[
          'flex-col content-end p-5',
          // Base mobile classes
          isPrintView ? 'ml-0' : 'ml-12', // Conditional margin-left
          'w-full',
          // Desktop overrides, only if not in print view
          {'md:ml-0': !isPrintView},
          {'md:w-5/12': !isPrintView},
          // Alignment classes
          index % 2 === 0
            ? (isPrintView ? 'justify-start text-left' : 'justify-end md:mr-auto md:text-right')
            : (isPrintView ? 'justify-start text-left' : 'md:ml-auto md:text-left'),
          'transition-all hover:scale-[1.02]'
        ]">
          <span class="text-sm font-semibold text-secondary-400">{{ item.date }}</span>
          <h3 class="mt-1 flex gap-2 text-xl font-bold" :class="{'md:ml-auto': !isPrintView && index % 2 === 0}">
            <Icon :name="item.icon" size="24" class="text-secondary-400" :class="{'hidden': !isPrintView, 'block': isPrintView}" />
            {{ item.title }}
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{{ item.description }}</p>
          <div v-if="item.skills && item.skills.length && !isPrintView" class="mt-3 flex flex-wrap gap-2" :class="index % 2 === 0 ? (isPrintView ? 'justify-start' : 'md:justify-end') : 'justify-start'">
            <UiTag v-for="(skill, skillIndex) in item.skills" :key="skillIndex">
              {{ skill }}
          </UiTag>
          </div>
        </UiCard >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

interface TimelineItem {
  date: string
  title: string
  description: string
  icon: string // Icon name from Nuxt Icon
  skills?: string[]
}

defineProps({
  items: {
    type: Array as PropType<TimelineItem[]>,
    required: true
  },
  isPrintView: {
    type: Boolean,
    default: false
  }
})
</script>