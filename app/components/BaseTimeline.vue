<template>
  <div class="relative py-10">
    <!-- Center Line (With Glow) -->
    <div 
      class="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-transparent via-secondary-500/50 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
      :class="{'md:hidden': !isPrintView, 'hidden': isPrintView}"
    ></div>
    
    <div 
      class="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 transform bg-gradient-to-b from-transparent via-secondary-500/50 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
      :class="{'hidden': isPrintView, 'md:block': !isPrintView}"
    ></div>

    <div v-for="(item, index) in items" :key="index" class="relative" :class="isPrintView ? 'mb-8' : 'mb-16'">
      <div class="flex items-center">
        
        <!-- Timeline Dot/Icon (Mobile) -->
        <div 
          class="absolute left-5 z-10 flex h-10 w-10 -translate-x-1/2 transform items-center justify-center rounded-xl border border-secondary-500/30 bg-white shadow-xl shadow-secondary-500/10 backdrop-blur-md dark:bg-neutral-900" 
          :class="{'md:hidden': !isPrintView, 'hidden': isPrintView}"
        >
          <Icon :name="item.icon" size="20" class="text-secondary-600 dark:text-secondary-400" />
          <div class="absolute inset-0 animate-pulse rounded-xl bg-secondary-500/5 blur-sm"></div>
        </div>
        
        <!-- Timeline Dot/Icon (Desktop) -->
        <div 
          class="absolute left-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 transform items-center justify-center rounded-2xl border border-secondary-500/30 bg-white shadow-2xl shadow-secondary-500/10 backdrop-blur-md dark:bg-neutral-900" 
          :class="{'hidden': isPrintView, 'md:flex': !isPrintView}"
        >
          <Icon :name="item.icon" size="24" class="text-secondary-600 dark:text-secondary-400" />
          <div class="absolute inset-0 animate-pulse rounded-2xl bg-secondary-500/10 blur-md"></div>
        </div>
        
        <!-- Timeline Card -->
        <UiCard
          shadow="md"
          hover
          :class="[
            'flex-col p-6 lg:p-8',
            isPrintView ? 'ml-0' : 'ml-14',
            'w-full',
            {'md:ml-0': !isPrintView},
            {'md:w-[42%]': !isPrintView},
            index % 2 === 0
              ? (isPrintView ? 'justify-start text-left' : 'md:mr-auto md:text-right')
              : (isPrintView ? 'justify-start text-left' : 'md:ml-auto md:text-left'),
          ]"
        >
          <slot :item="item" :index="index">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold uppercase tracking-widest text-secondary-500">{{ item.date }}</span>
              <h3 class="flex items-center gap-3 text-2xl font-bold text-neutral-900 dark:text-white" :class="{'md:flex-row-reverse': !isPrintView && index % 2 === 0}">
                {{ item.title }}
              </h3>
            </div>
            
            <p class="mt-4 text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">{{ item.description }}</p>
            
            <div 
              v-if="item.skills && item.skills.length && !isPrintView" 
              class="mt-6 flex flex-wrap gap-2" 
              :class="index % 2 === 0 ? (isPrintView ? 'justify-start' : 'md:justify-end') : 'justify-start'"
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

<script lang="ts" setup>
interface TimelineItem {
  date: string
  title: string
  description: string
  icon: string
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
