export const useSeoConfig = (route, _meta) => {
  useSeoMeta({
  title: t("navigation.home"),
  ogTitle: t("navigation.home"),
  description: t("home.hero.summary"),
  ogDescription: t("home.hero.summary"),
  ogImage: 'https://example.com/image.png',
  ogUrl: route.fullPath,
  ogType: 'website', 
  ogLocale: locale.value,
  twitterTitle: t("navigation.home"),
  twitterCard: 'summary_large_image',
  twitterDescription: t("home.hero.summary"),
  twitterImage: 'https://example.com/image.png',
  robots: 'index, follow',
  });
};