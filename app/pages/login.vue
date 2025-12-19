<template>
    <div class="flex h-screen w-full items-center justify-center">
        <div class="flex flex-col items-center gap-6">
            <h1 class="text-4xl font-bold">{{ $t('login.title') }}</h1>
            <p class="text-neutral-500">{{ $t('login.description') }}</p>
            <div class="mt-4">
                <UiButton :to="redirectUrl" variant="secondary" external>
                    <Icon name="mage:user-circle" size="24" />
                    <span>{{ $t('login.button') }}</span>
                </UiButton>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, definePageMeta } from '#imports';

const route = useRoute();
const redirectUrl = computed(() => {
  const redirect = route.query.redirect;
  if (typeof redirect === 'string' && redirect.startsWith('/')) {
    return `/auth/authentik?redirect=${encodeURIComponent(redirect)}`;
  }
  return '/auth/authentik';
});

definePageMeta({
    layout: 'default',
});
</script>
