<template>
  <div :class="rootClasses">
    
    <template v-if="variant === 'glow'">
      <div
class="pointer-events-none absolute inset-0 -z-10 opacity-[0.15] mix-blend-overlay invert [mask-image:radial-gradient(closest-side,black,transparent)] dark:invert-0"
           style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)">
      </div>

      <div class="pointer-events-none absolute -left-32 -top-32 -z-20 h-96 w-96 rounded-full bg-secondary-500/20 blur-[100px] dark:bg-secondary-500/15"></div>
      <div class="pointer-events-none absolute -left-10 -top-10 -z-20 h-48 w-48 rounded-full bg-secondary-400/30 blur-[60px] dark:bg-secondary-400/20"></div>
    </template>
    
    <div v-if="variant === 'nebula'" class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-32 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-400/15 blur-[60px] dark:bg-secondary-500/15"></div>


    <div class="relative flex flex-col gap-6" :class="contentAlignClasses">
        
        <div v-if="variant !== 'none' && (symbol || variant === 'tech' || $slots.prefix)" class="flex items-center gap-4">
             <div v-if="variant === 'tech'" class="font-mono text-sm font-bold tracking-widest text-secondary-500">
                // 0{{ Math.floor(Math.random() * 9) + 1 }}
             </div>

             <slot name="prefix">
                 
                 <div v-if="variant === 'glow' && symbol" class="group relative">
                     <div class="absolute -inset-2 rounded-3xl bg-secondary-500/20 blur-xl transition duration-500 group-hover:bg-secondary-500/30"></div>
                     
                     <div class="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/50 bg-gradient-to-br from-white/80 to-white/40 shadow-xl backdrop-blur-xl transition-transform duration-500 group-hover:scale-105 dark:border-white/10 dark:from-white/10 dark:to-white/5">
                         <Icon :name="symbol" size="32" class="text-secondary-600 drop-shadow-sm dark:text-secondary-400" />
                     </div>
                 </div>

                 <Icon v-else-if="variant === 'tech' && symbol" :name="symbol" size="32" class="text-secondary-500" />

                 <div v-else-if="variant === 'nebula' && symbol" class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary-100/50 text-secondary-500 dark:bg-secondary-900/40">
                    <Icon :name="symbol" size="32" />
                 </div>
                 
                 <div v-else-if="symbol" class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-100 text-secondary-600 dark:bg-secondary-900/40 dark:text-secondary-400">
                    <Icon :name="symbol" size="24" />
                 </div>
             </slot>

             <div v-if="variant === 'tech'" class="h-px w-24 bg-gradient-to-r from-secondary-500 to-transparent opacity-50"></div>
        </div>

        <div class="flex flex-col gap-3">
            <component :is="tag" :class="titleClasses">
                <template v-if="variant === 'tech'">
                   <span class="mr-1 text-secondary-500">#</span>
                   {{ title }}
                   <span class="animate-pulse text-secondary-500">_</span>
                </template>
                <template v-else>
                   {{ title }}
                </template>
            </component>
            
            <div v-if="variant === 'glow'" class="mt-1 flex items-center">
                 <div class="h-1 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
            </div>

            <p v-if="subtitle" :class="subtitleClasses">
                {{ subtitle }}
            </p>
        </div>

    </div>
    
    <div v-if="$slots.suffix" class="mt-8">
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  subtitle?: string
  symbol?: string
  level?: 1 | 2,
  variant?: 'minimal' | 'glow' | 'tech' | 'nebula' | 'none'
  align?: string 
}>(), {
  level: 2,
  symbol: undefined,
  variant: 'glow',
  subtitle: undefined,
  align: 'left'
})

const tag = computed(() => `h${props.level}`)

const rootClasses = computed(() => {
    return [
        'relative flex flex-col',
        props.variant === 'none' ? 'mb-8' : 'mb-20',
        props.variant === 'nebula' ? 'items-center' : '',
    ]
})

const contentAlignClasses = computed(() => {
    switch (props.variant) {
        case 'nebula': return 'items-center text-center'
        case 'tech': return 'items-start'
        default: return 'items-start'
    }
})

const titleClasses = computed(() => [
  'font-bold tracking-tight text-neutral-900 dark:text-white',
  props.level === 1 ? 'text-5xl sm:text-7xl' : 'text-4xl sm:text-5xl',
  props.variant === 'tech' ? 'font-mono tracking-tighter' : ''
])

const subtitleClasses = useCva(
   { variant: props.variant },
   'text-lg leading-relaxed text-neutral-600 dark:text-neutral-400',
   {
      variant: {
         minimal: 'max-w-3xl',
         glow: 'max-w-2xl font-medium text-neutral-600 dark:text-neutral-300 mt-2',
         nebula: 'mx-auto max-w-2xl',
         tech: 'max-w-3xl font-mono text-sm uppercase tracking-wide opacity-80',
         none: 'max-w-3xl',
      }
   }
)
</script>