<template>
  <div class="bg-primary-900 min-h-screen text-white">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.05s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
