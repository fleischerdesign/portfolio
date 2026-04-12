<template>
  <div class="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden pb-24 pt-24 lg:pt-48 2xl:min-h-[850px]">
    
    <div class="absolute inset-0 h-full w-full [mask-image:linear-gradient(to_bottom,black_70%,transparent_100%)]">
        
        <!-- Ambient Glows -->
        <div class="absolute -right-[10%] -top-[10%] z-0 h-[800px] w-[800px] rounded-full bg-secondary-500/10 blur-[150px] dark:bg-secondary-500/10"></div>
        <div class="absolute left-[60%] top-[40%] z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-400/5 blur-[120px]"></div>
        
        <!-- Dot Grid Pattern -->
        <div class="absolute inset-0 z-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]">
            <div class="h-full w-full bg-[radial-gradient(#80808066_1.5px,transparent_1.5px)] bg-[size:40px_40px] dark:bg-[radial-gradient(#ffffff15_1.5px,transparent_1.5px)]"></div>
        </div>

        <!-- Noise Texture -->
        <div
class="absolute inset-0 z-0 opacity-[0.05] mix-blend-overlay [mask-image:radial-gradient(closest-side,black,transparent)]" 
             style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.99%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E'); background-size: 150px 150px;">
        </div>
    </div>


    <div class="container relative z-10 mx-auto flex w-full max-w-screen-xl flex-col items-start gap-10 px-4 md:px-8">
      
      <!-- Status Badge -->
      <div class="animate-fade-in-up" style="animation-delay: 100ms;">
        <NowIndicator />
      </div>

      <!-- Headline -->
      <div class="flex flex-col gap-4">
          <h1 class="animate-fade-in-up max-w-4xl text-5xl font-black tracking-tight text-primary-950 sm:text-6xl lg:text-7xl dark:text-white" style="animation-delay: 200ms;">
            {{ $t("home.hero.greeting") }}
          </h1>
          <div class="animate-fade-in-up h-2 w-24 rounded-full bg-gradient-to-r from-secondary-500 to-transparent" style="animation-delay: 250ms;"></div>
      </div>

      <p class="animate-fade-in-up max-w-3xl text-xl leading-relaxed text-primary-600 sm:text-2xl dark:text-primary-400" style="animation-delay: 350ms;">
        {{ $t("home.hero.summary") }}
      </p>

      <!-- Actions / Socials -->
      <div class="animate-fade-in-up flex flex-wrap items-center gap-6 pt-4" style="animation-delay: 450ms;">
        <SocialLinks />
        
        <!-- Scroll Down Indicator -->
        <a href="#overview" class="group flex items-center gap-3 rounded-2xl border border-primary-200/60 bg-white/50 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-primary-500 backdrop-blur-md transition-all hover:border-secondary-500/40 hover:bg-white/80 hover:text-secondary-600 dark:border-primary-800/60 dark:bg-primary-950/50 dark:text-primary-400 dark:hover:bg-primary-900/80 dark:hover:text-secondary-400">
            <span>{{ $t("home.hero.explore") }}</span>
            <Icon name="mage:arrow-down" size="20" class="animate-bounce" />
        </a>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  opacity: 0;
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>