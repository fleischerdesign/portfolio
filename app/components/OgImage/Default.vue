<script setup lang="ts">

const props = withDefaults(defineProps<{
  colorMode?: 'dark' | 'light'
  title?: string
  description?: string
  icon?: string | boolean
  siteName?: string
  siteLogo?: string
  theme?: string
}>(), {
  theme: '#00dc82',
  title: 'title',
  colorMode: 'light',
  description: '',
  icon: false,
  siteName: '',
  siteLogo: '',
})

const HexRegex = /^#(?:[0-9a-f]{3}){1,2}$/i

const colorMode = computed(() => {
  return props.colorMode || 'light'
})

const themeHex = computed(() => {
  if (HexRegex.test(props.theme))
    return props.theme

  if (HexHexRegex.test(`#${props.theme}`))
    return `#${props.theme}`

  if (props.theme.startsWith('rgb')) {
    const rgb = props.theme
      .replace('rgb(', '')
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
      .map(v => Number.parseInt(v.trim(), 10))
    const hex = rgb
      .map((v) => {
        const hex = v.toString(16)
        return hex.length === 1 ? `0${hex}` : hex
      })
      .join('')
    return `#${hex}`
  }
  return '#FFFFFF'
})

const themeRgb = computed(() => {
  return themeHex.value
    .replace('#', '')
    .match(/.{1,2}/g)
    ?.map(v => Number.parseInt(v, 16))
    .join(', ')
})

const siteName = computed(() => {
  return props.siteName
})
const siteLogo = computed(() => {
  return props.siteLogo
})
</script>

<template>
  <div
    class="relative flex h-full w-full justify-between p-[60px]"
    :class="[
      colorMode === 'light' ? ['bg-white', 'text-gray-900'] : ['bg-gray-900', 'text-white'],
    ]"
  >
    <div
      class="absolute right-[-100%] top-0 flex" :style="{
        width: '200%',
        height: '200%',
        backgroundImage: `radial-gradient(circle, rgba(${themeRgb}, 0.5) 0%,  ${colorMode === 'dark' ? 'rgba(5, 5, 5,0.3)' : 'rgba(255, 255, 255, 0.7)'} 50%, ${props.colorMode === 'dark' ? 'rgba(5, 5, 5,0)' : 'rgba(255, 255, 255, 0)'} 70%)`,
      }"
    />
    <div class="relative h-full w-full justify-between">
      <div class="flex flex-row items-start justify-start gap-x-12">
        <div v-if="Boolean(icon)" class="flex justify-start" style="width: 400px; height: 400px;">
          <Icon :name="icon" style="width: 100%; height: 100%; opacity: 0.7;" />
        </div>
        <div class="flex w-full flex-col">
          <h1 class="m-0 mb-[30px] text-[75px] font-bold" style="display: block; text-overflow: ellipsis;" :style="{ lineClamp: description ? 2 : 3 }">
            {{ title }}
          </h1>
          <p
            v-if="description"
            class="leading-12 border-l-8 border-secondary-400 pl-6 text-[35px]"
            :class="[
              colorMode === 'light' ? ['text-gray-700'] : ['text-gray-300'],
            ]"
            style="display: block; line-clamp: 3; text-overflow: ellipsis;"
          >
            {{ description }}
          </p>
        </div>
      </div>
      <div class="flex w-full flex-row items-center justify-center text-left">
        <img v-if="siteLogo" :src="siteLogo" height="30">
        <template v-else>
          <Icon name="logo:fleischerdesign" class="mr-4 h-14 w-10" mode="svg"/>
          <p style="font-size: 25px;" class="font-bold">
            Fleischer.design
          </p>
        </template>
      </div>
    </div>
  </div>
</template>