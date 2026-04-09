<template>
  <div 
    ref="markdownRef" 
    :class="[
      !unstyled && 'prose max-w-none dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-a:text-secondary-500 prose-a:no-underline hover:prose-a:underline prose-blockquote:rounded-r-2xl prose-blockquote:border-secondary-500 prose-blockquote:bg-secondary-500/5 prose-blockquote:px-6 prose-blockquote:py-2 prose-img:rounded-3xl prose-img:shadow-2xl'
    ]" 
    v-html="renderedHtml"
  ></div>
</template>

<script setup lang="ts">
/**
 * @component BaseMarkdown
 * @description Centralized markdown renderer with support for Mermaid diagrams.
 */
const props = defineProps<{
  content: string,
  unstyled?: boolean
}>()

const { render } = useMarkdown()
const markdownRef = ref<HTMLElement | null>(null)

/**
 * @computed renderedHtml
 * @description Parsed HTML from markdown content.
 */
 
const renderedHtml = computed(() => render(props.content))

/**
 * @method initMermaid
 * @description Finds all .mermaid blocks and renders them using the mermaid library.
 */
const initMermaid = async () => {
  if (import.meta.env.SSR || !markdownRef.value) return
  
  const mermaidBlocks = markdownRef.value.querySelectorAll('.mermaid')
  if (mermaidBlocks.length > 0) {
    try {
      const { default: mermaid } = await import('mermaid')
      
      // Configure mermaid for optimal look in our theme
      mermaid.initialize({ 
        startOnLoad: false, 
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'Roboto, sans-serif'
      })
      
      await mermaid.run({
        nodes: Array.from(mermaidBlocks) as HTMLElement[]
      })
    } catch (error) {
      console.error("Failed to initialize Mermaid:", error)
    }
  }
}

// Re-initialize mermaid when content changes
watch(() => props.content, () => {
  nextTick(initMermaid)
})

onMounted(() => {
  initMermaid()
})
</script>
