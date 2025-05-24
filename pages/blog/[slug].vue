<template>
    <div>
    <ContentRenderer v-if="post" :value="post" />
</div>
</template>

<script lang="ts" setup>
const route = useRoute()
const { data: post } = await useAsyncData(() => {
  return queryCollection("posts").where("slug", "=", route.params.slug).first()
})
</script>