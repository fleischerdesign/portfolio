# Personal Portfolio & Blog

Welcome to the official repository for my personal portfolio website, [fleischer.design](https://fleischer.design). This project serves as a central hub to showcase my work, share my thoughts through blog articles, and provide insights into my technical skills. It is built with a modern, content-driven technology stack to ensure a great developer and user experience.

## ✨ Features

*   **Nuxt 4:** Built with the latest version of the intuitive Vue framework.
*   **Content-Driven:** Uses `@nuxt/content` for managing blog posts and project descriptions with Markdown.
*   **Bilingual Content:** Fully internationalized (i18n) for German and English.
*   **Component-Based:** A modular and reusable component library built with Vue.
*   **Styling with Tailwind CSS:** Modern and utility-first CSS for a clean and responsive design.
*   **Dark & Light Mode:** Theme switcher for user preference.
*   **SEO Optimized:** Configured with `@nuxt/seo` for best search engine visibility.
*   **Dockerized Environment:** Comes with a `Dockerfile` and `compose.yaml` for easy and consistent deployment.
*   **Nix Flake:** A `flake.nix` file is included for a reproducible development environment using Nix.

## 🚀 Tech Stack

*   **Framework:** [Nuxt.js](https://nuxt.com/)
*   **UI Framework:** [Vue.js](https://vuejs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Content:** [@nuxt/content](https://content.nuxt.com/) (Markdown-based)
*   **Internationalization:** [@nuxtjs/i18n](https://i18n.nuxtjs.org/)
*   **Deployment:** [Docker](https://www.docker.com/), [GitHub Actions](https://github.com/features/actions)

## 📂 Project Structure

The repository is structured to follow Nuxt conventions, keeping a clean separation of concerns:

-   `app/`: The main application source, including pages, components, and layouts.
-   `components/`: Reusable Vue components.
-   `content/`: Markdown files for blog posts and project details (in `en` and `de`).
-   `composables/`: Reusable Vue composables (e.g., for SEO configuration).
-   `data/`: Static data, like my resume information.
-   `i18n/`: Locale files for translation.
-   `public/`: Static assets that are publicly available.
-   `server/`: Nitro server routes for API endpoints (e.g., contact form).
-   `.github/workflows/`: CI/CD pipeline for automated deployments.

## 🛠️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/fleischer-design/portfolio.git
    cd portfolio
    ```

2.  Set up your environment variables:
    ```bash
    cp .env.example .env
    ```
    Now, open the `.env` file and fill in your credentials for the mail server and translation APIs.

3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

There are three recommended ways to run the development environment. Choose the one that best fits your workflow.

#### 1. Standard (npm)

This is the standard method if you have a suitable version of [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed locally.

Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

#### 2. Using Nix

If you have [Nix](https://nixos.org/) installed, you can use the `flake.nix` file to create a reproducible shell with all the exact dependencies.

1.  Enter the development shell:
    ```bash
    nix develop
    ```
2.  Once inside the shell, start the server:
    ```bash
    npm run dev
    ```

#### 3. Using Docker

For a fully containerized environment that uses Nix under the hood, you can use the provided Docker setup. This is ideal if you prefer Docker or don't have Nix/Node.js on your host machine.

**Prerequisites:**
- [Docker](https.www.docker.com/) installed and running.

**Instructions:**
```bash
docker compose -f compose.dev.yaml up --build
```
The server will be available at `http://localhost:3000`. Hot-reloading is enabled.

### Production

Build the application for production:

```bash
npm run build
```

Locally preview the production build:

```bash
npm run preview
```

## Contact

If you have any questions or want to connect, feel free to reach out!