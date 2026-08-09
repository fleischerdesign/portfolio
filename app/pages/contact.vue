<template>
    <div class="container mx-auto max-w-screen-xl px-4 pb-16 pt-32 md:px-8 lg:pt-44">
        <SectionContact heading-type="page" />
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

useAppSeo({
  title: t("seo.contact_title"),
  description: t("home.contact.subtitle"),
  type: 'website'
});
</script>