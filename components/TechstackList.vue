<template>
    <div class="flex flex-wrap gap-2">
        <Tag v-for="(item, index) in items" :key="index">
            <Icon v-if="techIcons[item]" :name="techIcons[item]" class="text-xl" />
            <span>{{ item }}</span>
        </Tag>
    </div>
</template>

<script setup>
const techIcons = {
  'Linux': 'uil:linux',
  'Docker': 'mdi:docker',
  'Caddy': 'file-icons:caddy',
  'Authentik': 'simple-icons:authentik',
  'Grafana': 'devicon-plain:grafana',
  'Home Assistant': 'simple-icons:homeassistant',
  'Git': 'simple-icons:git',
  'React': 'simple-icons:react',
  'Vue': 'teenyicons:vue-solid',
  'Flutter': 'simple-icons:flutter',
  'Typescript': 'simple-icons:typescript',
}

const props = defineProps({
  items: { type: Array, default: () => [] } // Default: Leeres Array
})
</script>