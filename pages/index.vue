<template>
  <div class="min-h-screen flex items-center 2xl:min-h-[600px]">
    <div class="flex flex-col items-start gap-4">
      <Chip>
        <svg class="inline overflow-visible m-auto" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <circle class="drop-shadow-emit fill-green-400" r="8" cx="8" cy="8" />
          <circle class="drop-shadow-emit animate-ping origin-center fill-green-400" r="8" cx="8" cy="8" />
        </svg><span>Now Programming</span>
      </Chip>
      <h1 class="text-5xl font-semibold">Hi, I'm Philipp Fleischer</h1>
      <p class="text-neutral-400 w-full lg:w-2/3">I’m an aspiring Computer Science Expert who thrives on clean code,
        seamless user experiences, and innovative solutions that bring ideas to life.</p>
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
        <a class="flex my-auto" href="#overview">
          <Icon name="mdi:arrow-down" size="30" class="animate-pulse hover:animate-none" />
        </a>
      </div>
    </div>
  </div>
  <div id="overview" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-24">
    <Card class="flex flex-col col-span-1 md:col-span-2 gap-1">
      <CardContainer class="flex-col">
        <h3 class="text-3xl font-medium">GitHub Activity</h3>
        <p class="text-neutral-400">{{ subtitle }}</p>
        <ContributionChart :contributions="contributions" @displayedWeeksCountChanged="onDisplayedWeeksCountChanged" />
      </CardContainer>
    </Card>
    <Card class="!p-0 overflow-hidden min-h-60 group">
      <div
        class="!bg-[url(/img/profile.jpg)] bg-center bg-cover w-full h-full opacity-80 hover:opacity-100 transition group-hover:scale-110">
      </div>
    </Card>
    <Card class="flex flex-col col-span-1">
      <CardContainer class="flex-col">
        <h3 class="text-3xl font-medium">Tech Stack</h3>
        <p class="text-neutral-400">Technologies i’m using.</p>
        <div class="flex flex-wrap gap-2">
          <Tag>
            <Icon name="lineicons:typescript" size="20" /><span>TypeScript</span>
          </Tag>
          <Tag>
            <Icon name="lineicons:react" size="20" /><span>React</span>
          </Tag>
          <Tag>
            <Icon name="lineicons:git" size="20" /><span>Git</span>
          </Tag>
          <Tag>
            <Icon name="lineicons:docker" size="20" /><span>Docker</span>
          </Tag>
          <Tag>
            <Icon name="gravity-ui:target-dart" size="20" /><span>Dart</span>
          </Tag>
          <Tag>
            <Icon name="teenyicons:rust-outline" size="20" /><span>Rust</span>
          </Tag>
          <Tag>
            <Icon name="lineicons:tailwindcss" size="20" /><span>Tailwind</span>
          </Tag>
          <Tag>
            <Icon name="flowbite:vue-solid" size="20" /><span>Vue</span>
          </Tag>
          <Tag>
            <Icon name="material-symbols:flutter" size="20" /><span>Flutter</span>
          </Tag>
        </div>
      </CardContainer>
    </Card>
    <Card class="flex flex-col col-span-1">
      <CardContainer class="flex-col">
        <h3 class="text-3xl font-medium">Statistics</h3>
        <p class="text-neutral-400">Statistics of me.</p>
      </CardContainer>
    </Card>
    <Card class="flex flex-col col-span-1">
      <CardContainer class="flex-col">
        <h3 class="text-3xl font-medium">I'm searching!</h3>
        <p class="text-neutral-400">Aspiring Application Developer (FIAE) seeking a 6-month internship to:

          Apply coding skills in real-world projects
          Collaborate with experienced teams
          Interested in connecting?</p>
      </CardContainer>
    </Card>
  </div>
  <div class="mb-24">
    <div class="flex flex-col gap-4">
      <h1 class="text-5xl font-semibold">Projects</h1>
      <p class="text-neutral-400 w-full lg:w-2/4">Explore a collection of my web development projects, ranging from
        dynamic e-commerce sites to custom tools. Each showcases my expertise in creating functional and user-friendly
        solutions.</p>
    </div>
    <div class="grid grid-cols-1 gap-3 mt-4">
      <Card class="group h-60 overflow-hidden">
        <div class="w-1/3 overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
      <Card class="group h-60 overflow-hidden">
        <div class="w-1/3 overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
      <Card class="group h-60 overflow-hidden">
        <div class="w-1/3 overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
    </div>
  </div>
  <div class="mb-24">
    <div class="flex flex-col gap-4">
      <h1 class="text-5xl font-semibold">Posts</h1>
      <p class="text-neutral-400 w-full lg:w-2/4">Discover a collection of my blog posts where I share learnings,
        experiences, and practical advice related to Coding, Hacking, UI & UX. Join me as I explore and document my
        journey in Computer Science.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
      <Card class="group overflow-hidden !flex-col">
        <div class="h-60 w-full overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
      <Card class="group overflow-hidden !flex-col">
        <div class="h-60 w-full overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
      <Card class="group overflow-hidden !flex-col">
        <div class="h-60 w-full overflow-hidden">
          <img src="/img/profile.jpg"
            class="h-full w-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition" />
        </div>
        <CardContainer class="flex-col">
          <h3 class="text-3xl font-medium">Junction</h3>
          <p class="text-neutral-400">One integration, structured patient data, dedicated support. Minimal operational
            headaches for users with whatever.</p>
        </CardContainer>
      </Card>
    </div>
  </div>
  <div class="mb-24">
    <div class="flex flex-col gap-4">
      <h1 class="text-5xl font-semibold">Contact</h1>
      <p class="text-neutral-400 w-full lg:w-2/4">Get in touch! Whether you have a project in mind, want to explore
        ideas, or simply want to connect, I'd love to hear from you.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contributions: this.generateDemoContributions(),
      displayedWeeks: 0,
    };
  },
  computed: {
    subtitle() {
      if (this.displayedWeeks === 52) {
        return 'Contributions in the last year.';
      } else if (this.displayedWeeks > 4 && this.displayedWeeks < 52) {
        return `Contributions in the last ${Math.round(this.displayedWeeks / 4)} months.`;
      } else if (this.displayedWeeks <= 4 && this.displayedWeeks > 1) {
        return `Contributions in the last ${this.displayedWeeks} weeks.`;
      } else if (this.displayedWeeks === 1) {
        return 'Contributions in the last week.';
      } else {
        return 'Contribution overview.';
      }
    },
  },
  methods: {
    generateDemoContributions() {
      const contributions = [];
      const today = new Date();

      // Generiere ca. 1 Jahr Demo-Daten
      for (let i = 360; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        contributions.push({
          date: date.toISOString().split('T')[0],
          count: Math.floor(Math.random() * 15),
        });
      }
      return contributions;
    },
    onDisplayedWeeksCountChanged(count) {
      this.displayedWeeks = count;
    },
  },
};
</script>