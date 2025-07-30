# Portfolio Improvements TODO

This list tracks potential improvements for the portfolio website.

## 🚀 Performance
Consider Static Site Generation (SSG):
       * Problem: Dein Projekt nutzt derzeit Server-Side Rendering (SSR) als Standard. Für eine
         Portfolio-Website, deren Inhalte sich nicht ständig ändern, ist SSR oft nicht die performanteste Option
         für die initiale Ladezeit.
       * Solution: Konfiguriere Nuxt für Static Site Generation (SSG). Dabei werden alle Seiten während des
         Build-Prozesses in statische HTML-Dateien umgewandelt. Diese können dann von einem CDN ausgeliefert
         werden, was zu extrem schnellen Ladezeiten führt, da kein Server zur Laufzeit die Seite rendern muss.
       * Benefit: Deutlich schnellere Time-to-First-Byte (TTFB) und First Contentful Paint (FCP), geringere
         Serverlast und einfachere Skalierung.
       * Implementation Hint: Dies würde die Anpassung der nuxt.config.ts erfordern, um ssr: true (Standard)
         beizubehalten, aber zusätzlich Routen für das Prerendering zu definieren oder den Output-Modus auf
         static zu setzen.

   3. Lazy Load Non-Critical Components:
       * Problem: Obwohl ClientOnly für GithubChart verwendet wird, könnten andere Komponenten, die nicht sofort
         im Viewport sichtbar sind (z.B. weiter unten auf der Seite oder in Tabs/Akkordeons), ebenfalls von Lazy
         Loading profitieren.
       * Solution: Identifiziere Komponenten, die nicht für den initialen Viewport benötigt werden, und lade sie
         dynamisch mit defineAsyncComponent oder durch bedingtes Rendern, wenn sie in den Viewport kommen (z.B.
         mit Intersection Observer).
       * Benefit: Reduziert die initiale JavaScript-Bundle-Größe und die Zeit bis zur Interaktivität (Time to
         Interactive - TTI).

## 🧹 Code Quality
- [ ] **Refactor Large Components:** Identify large Vue components (e.g., in `pages/`) and break them down into smaller, more focused, and reusable child components to improve readability, maintainability, and testability.

## SEO
- [ ] **Implement Structured Data (Schema.org):** Enhance SEO by adding structured data to content types like blog posts and projects. Use `unhead/vue` to dynamically generate JSON-LD schemas (`Article`, `Project`, etc.) to improve how search engines understand and display your content in search results.

## ♿ Accessibility (a11y)
- [ ] Install and configure `nuxt-a11y` to audit the application for common accessibility issues during development and get feedback directly in the browser console.

## 🔒 Security
- [ ] Secure the contact form API endpoint (`/api/contact`) against spam and abuse.
  - [ ] **Option A:** Integrate a user-friendly and privacy-respecting CAPTCHA like Cloudflare Turnstile (using `nuxt-turnstile`).
  - [ ] **Option B:** Implement server-side rate-limiting for the API route using `unstorage` to block IPs after too many requests.

## ✨ User Experience (UX)
- [ ] Implement scroll-reveal animations for elements like project cards, headlines, or images to make the page feel more dynamic and polished. This can be achieved using the `Intersection Observer` API, either via a custom composable or a library like `motion`.
- [ ] **Create a Custom Error Page:** Design and implement a custom `error.vue` to provide a branded, user-friendly experience for 404s and other errors, guiding users back to relevant content instead of a generic error screen.
- [ ] **Implement Client-Side Search:** Add a real-time search/filter input on the blog and project overview pages to allow users to easily find content. This can be implemented efficiently using Nuxt Content's query features and Vue's computed properties.

## ⚙️ Engineering & CI/CD
- [ ] **Modernize CI/CD Pipeline:** Refactor the `deploy.yml` workflow to be more efficient.
  - [ ] Build the Docker image within the GitHub Actions runner instead of on the destination server.
  - [ ] Push the built image to GitHub Container Registry (GHCR).
  - [ ] Modify the server-side script to simply `docker compose pull` the new image and restart the service, enabling faster, atomic deployments.
- [ ] **Implement a Testing Strategy:** Introduce a testing framework to improve code quality and long-term maintainability.
  - [ ] Integrate `vitest` for fast and modern unit/component testing that works well with Nuxt 3.
  - [ ] Write initial tests for critical utilities (e.g., `utils/formatDate.ts`) or components (e.g., `ContactForm.vue`).

## Refactoring
- [ ] **Abstract SEO Metadata (`useSeoMeta`):**
  - **Problem:** The `useSeoMeta` blocks in many pages (`pages/blog/index.vue`, `pages/projects/index.vue`, `pages/about.vue`, `pages/contact.vue`, `pages/legal.vue`, `pages/store.vue`, `pages/blog/[slug].vue`, `pages/projects/[slug].vue`) are very similar and repetitive.
  - **Solution:** Create a Nuxt composable (e.g., `composables/usePageSeo.ts`) that encapsulates the common logic and accepts dynamic values (title, description, etc.) as arguments.
  - **Benefit:** Reduces boilerplate code, centralizes SEO logic, and simplifies maintenance.
- [ ] **Generic Layout for Detail Pages (`[slug].vue`):**
  - **Problem:** `pages/blog/[slug].vue` and `pages/projects/[slug].vue` are almost identical in their template and script structure.
  - **Solution:** Create a component (e.g., `components/ContentDetailLayout.vue`) or a composable that handles the `ContentDoc` slot, `HeadingSite`, `NuxtImg`, and `ContentRenderer`. It would receive props for the content type (`blog` or `projects`) and the slug.
  - **Benefit:** Eliminates duplicates and simplifies the addition of new content types.
- [ ] **Consolidate Heading Components (`HeadingSection` and `HeadingSite`):**
  - **Problem:** There are two very similar heading components.
  - **Solution:** Merge them into a single component (e.g., `components/BaseHeading.vue`). This component could accept a `level` prop (e.g., 'h1', 'h2') or a `type` prop (e.g., 'page', 'section') to control the HTML tag and styling. The `symbol` prop from `HeadingSite` and the `link` prop from `HeadingSection` would be optional props.
  - **Benefit:** Reduces the number of components, improves consistency, and simplifies heading style management.
- [ ] **Generic Page Wrapper (`PageWrapper`):**
  - **Problem:** Many pages (`pages/blog/index.vue`, `pages/projects/index.vue`, `pages/about.vue`, `pages/contact.vue`, `pages/legal.vue`, `pages/store.vue`) start with the same outer container classes (`<div class="container max-w-screen-xl mx-auto py-16">` and `<div class="mb-24">`).
  - **Solution:** Create a simple `components/PageWrapper.vue` component that provides these common container classes and includes a `<slot />`.
  - **Benefit:** Reduces HTML boilerplate in pages and centralizes common page layout.
- [ ] **Break down `pages/about.vue` into smaller components:**
  - **Problem:** `pages/about.vue` is a very large file containing multiple distinct sections (Overview, Early Life, Career Path, Personal Life).
  - **Solution:** Extract each of these sections into its own dedicated component (e.g., `components/about/OverviewSection.vue`, `components/about/EarlyLifeSection.vue`, etc.).
  - **Benefit:** Significantly improves readability, maintainability, and reusability of the `about` page.
- [ ] **Centralize `careerTimeline` data:**
  - **Problem:** The `careerTimeline` data is currently defined directly within `pages/about.vue`, but a similar timeline is also used in `pages/resume.vue` via `resumeData.ts`. This creates a potential for data duplication and inconsistency.
  - **Solution:** Move the `careerTimeline` definition from `pages/about.vue` into `data/resumeData.ts` (or a new dedicated data file if `resumeData.ts` becomes too large), and ensure both `about.vue` and `resume.vue` consume the data from this single source.
  - **Benefit:** Establishes a single source of truth for career timeline data, preventing inconsistencies and simplifying updates.
- [ ] **Decouple `resumeData.ts` from i18n translation:**
  - **Problem:** `resumeData.ts` directly uses the `t` (i18n translation) function within its data definitions (e.g., `subtitle: (t: any) => t("home.hero.summary")`, `careerTimeline: (t: any) => [...]`). This couples the data directly to the translation logic.
  - **Solution:** Modify `resumeData.ts` to store raw, untranslated strings. Components consuming this data (`pages/resume.vue`, `pages/about.vue`) should then apply the translation using `useI18n` where necessary.
  - **Benefit:** Makes the data truly independent and reusable in different contexts, even if i18n is not available or a different translation approach is used. It also better adheres to the principle of separation of concerns.
- [ ] **Centralize API Error Handling:**
  - **Problem:** Error handling (e.g., `createError({ statusCode: 400, statusMessage: '...' })`) is repeated across multiple API endpoints (`contact.post.ts`, `now/index.get.ts`, `now/index.post.ts`).
  - **Solution:** Create a utility function or a custom `defineEventHandler` wrapper that centralizes common error handling logic. This could involve a function like `handleApiError(statusCode, message)` that consistently formats and throws errors.
  - **Benefit:** Reduces code duplication, ensures consistent error responses, and makes it easier to modify error handling globally.
- [ ] **Abstract Environment Variable Access:**
  - **Problem:** Environment variables (e.g., `process.env.SMTP_HOST`, `process.env.GITHUB_TOKEN`) are accessed directly within the API handlers. While this is common, for larger applications, centralizing access can be beneficial.
  - **Solution:** Create a `server/utils/config.ts` file that exports a configuration object with validated environment variables. For example, `getConfig().smtpHost`. This could also include checks for missing variables.
  - **Benefit:** Improves testability, provides a single place to manage and validate environment variables, and makes the code cleaner.
- [ ] **Consider a dedicated service layer for external API calls (GitHub, Nodemailer):**
  - **Problem:** The GitHub API call in `contributions/index.get.ts` and Nodemailer logic in `contact.post.ts` are directly embedded in the API handlers.
  - **Solution:** Create `server/services/github.ts` and `server/services/email.ts` (or similar) that encapsulate the logic for interacting with these external services. The API handlers would then simply call these service functions.
  - **Benefit:** Decouples external dependencies from API routes, improves testability of the API handlers, and makes it easier to swap out or modify external service integrations.
- [ ] **Refactor Hardcoded Configuration in `scripts/generate-pdf.ts`:**
  - **Problem:** `apiBaseUrl` and `executablePath` are hardcoded, making the script less portable.
  - **Solution:** Make these values configurable via environment variables or command-line arguments.
  - **Benefit:** Increases flexibility and allows the script to run in different environments (e.g., CI/CD).
  - **Further Consideration:** If PDF generation becomes a dynamic feature (e.g., triggered by an API endpoint), consider moving this logic to a Nuxt server API route to leverage Nuxt's environment management and server utilities.