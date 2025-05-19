<template>
  <footer class="py-5 bg-gradient-to-br from-neutral-900 to-neutral-800 border-t border-neutral-700">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="flex flex-col gap-4">
          <h3 class="text-3xl font-medium">Philipp Fleischer</h3>
          <p class="text-neutral-400">I’m an aspiring Computer Science Expert who thrives on clean code, seamless user
            experiences, and innovative solutions that bring ideas to life.</p>
          <div class="flex gap-3 w-full">
            <Button href="https://linkedin.com/" target="_blank">
              <Icon name="mdi:linkedin" size="30" />
            </Button>
            <Button href="https://github.com/fleischerdesign" target="_blank">
              <Icon name="mdi:github" size="30" />
            </Button>
            <Button href="https://instagram.com/fleischer.design/" target="_blank">
              <Icon name="mdi:instagram" size="30" />
            </Button>
          </div>
        </div>
        <div class="md:ml-auto lg:mx-auto">
          <h3 class="text-xl font-medium pb-4">Contact</h3>
          <p class="text-neutral-400">+49 123 456789</p>
          <p class="text-neutral-400">hello@fleischer.design</p>
          <p class="text-neutral-400">17036 Neubrandenburg</p>
        </div>
        <div class="ml-0 lg:ml-auto">
          <h3 class="text-xl font-medium pb-4">Sitemap</h3>
          <ul class="text-neutral-400 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 gap-y-2 gap-x-6">
            <li><a>Home</a></li>
            <li><a>Store</a></li>
            <li><a>Projects</a></li>
            <li><a>Blog</a></li>
            <li><a>About</a></li>
            <li><a>Resume</a></li>
            <li><a>Legal</a></li>
          </ul>
        </div>
      </div>
    </div>
    <p class="text-neutral-600 text-sm container mx-auto pt-4 pb-16">&copy; 2025 Philipp Fleischer. All rights reserved.
    </p>
  </footer>
</template>