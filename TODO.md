# Portfolio Improvements TODO

This list tracks potential improvements for the portfolio website.

## 🚀 Performance

## 🧹 Code Quality
- [ ] Integrate ESLint with `@nuxt/eslint-config` to enforce a consistent code style and catch potential errors early.
- [ ] Add a `lint` script to `package.json` to easily run the linter from the command line.
- [ ] Consider adding Prettier for automated code formatting to work alongside ESLint.
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
