<template>
  <div>
    <div ref="container" class="mermaid"></div>
    <div ref="slotRef" style="display:none">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import mermaid from 'mermaid'

const container = ref<HTMLDivElement | null>(null)
const slotRef = ref<HTMLElement | null>(null)
let lastDiagramCode = ''
// Eindeutige Diagramm-ID für jedes Diagramm
const diagramId = `mermaid-diagram-${Math.random().toString(36).substr(2, 9)}`

const renderDiagram = async (code: string) => {
  if (!container.value || code === lastDiagramCode) return
  lastDiagramCode = code
  container.value.innerHTML = ''
  if (!code.trim()) return
  try {
    mermaid.initialize({ startOnLoad: false })
    const { svg } = await mermaid.render(diagramId, code)
    container.value.innerHTML = svg
  } catch (error) {
    console.error("Mermaid rendering error:", error)
    if (container.value) {
      container.value.textContent = 'Diagramm konnte nicht gerendert werden'
    }
  }
}

const extractAndRender = () => {
  const code = slotRef.value?.textContent || ''
  nextTick(() => renderDiagram(code))
}

watch(slotRef, extractAndRender, { immediate: true })
onMounted(extractAndRender)
</script>
