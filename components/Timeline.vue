<template>
  <div class="relative">
    <!-- Vertical line - mobile -->
    <div class="absolute left-5 top-0 h-full w-0.5 bg-secondary-400 md:hidden"></div>
    
    <!-- Vertical line - desktop -->
    <div class="absolute left-1/2 top-0 hidden h-full w-0.5 bg-secondary-400 md:block transform -translate-x-1/2"></div>

    <div v-for="(item, index) in items" :key="index" class="relative mb-12">
      <div class="flex">
        <!-- Mobile circle with icon -->
        <div class="absolute left-5 flex justify-center items-center w-10 h-10 rounded-full bg-secondary-400 z-10 transform -translate-x-1/2 md:hidden">
          <Icon :name="item.icon" size="20" class="text-white dark:text-gray-900" />
        </div>
        
        <!-- Desktop circle with icon -->
        <div class="absolute left-1/2 hidden justify-center items-center w-10 h-10 rounded-full bg-secondary-400 z-10 md:flex transform -translate-x-1/2">
          <Icon :name="item.icon" size="20" class="text-white dark:text-gray-900" />
        </div>
        
        <!-- Content container -->
        <Card :class="[
          'flex-col content-end ml-12 w-full p-5 md:ml-0 md:w-5/12',
          index % 2 === 0 ? 'md:mr-auto md:text-right justify-end' : 'md:ml-auto md:text-left',
          'transition-all hover:scale-[1.02]'
        ]">
          <span class="text-sm font-semibold text-secondary-400">{{ item.date }}</span>
          <h3 class="text-xl font-bold mt-1 flex gap-2" :class="index % 2 === 0 ? 'md:ml-auto' : 'la'">
            <Icon :name="item.icon" size="24" class="text-secondary-400 md:hidden" />
            {{ item.title }}
          </h3>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{{ item.description }}</p>
          <div v-if="item.skills" class="mt-3 flex flex-wrap gap-2" :class="index % 2 === 0 ? 'md:justify-end' : 'justify-start'">
            <Tag v-for="(skill, skillIndex) in item.skills" :key="skillIndex">
              {{ skill }}
          </Tag>
          </div>
        </Card>
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

const props = defineProps({
  items: {
    type: Array as PropType<TimelineItem[]>,
    required: true
  }
})
</script>