# Personal Portfolio & Application Manager

Welcome to the official repository for my personal portfolio website, [fleischer.design](https://fleischer.design). This project serves a dual purpose: it's a public-facing portfolio and blog, and a private, authenticated backend for managing job applications.

It is built with a modern, full-stack technology stack to ensure a great developer and user experience, with a focus on reproducible environments and a clean separation of concerns.

## ✨ Features

*   **Full-Stack with Nuxt 4:** Built with the latest version of the intuitive Vue framework, handling both the frontend and a powerful server backend.
*   **Content-Driven Portfolio:** Uses `@nuxt/content` for managing blog posts and project descriptions with Markdown.
*   **Private Application Management:**
    *   Authenticated section to create, view, and manage job applications.
    *   CRUD functionality for applications, including status updates and deletion.
    *   On-demand, secure generation of application documents as PDFs using **Puppeteer**.
*   **Relational Database:** Uses **Drizzle ORM** with a SQLite database (`libsql`) to manage all application, company, and user data.
*   **Reproducible Environments:**
    *   **Nix Flake:** A `flake.nix` file provides a fully reproducible development environment.
    *   **Dockerized:** Includes `Dockerfile` for production and `Dockerfile.dev` for a containerized Nix environment, with `docker-compose` for orchestration.
*   **Modern Frontend:**
    *   Styling with **Tailwind CSS** for a clean, responsive, utility-first design.
    *   Bilingual content support (DE/EN) with `@nuxtjs/i18n`.
    *   Dark & Light Mode.
    *   Rich data visualizations, including a GitHub contribution chart.
*   **Authentication:** Secure authentication powered by `nuxt-auth-utils`.
*   **CI/CD:** Automated build and deployment pipeline using **GitHub Actions**.

## 🚀 Tech Stack

| Category      | Technology                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------|
| **Framework** | [Nuxt.js](https://nuxt.com/) (v4), [Vue.js](https://vuejs.org/)                                          |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                                                            |
| **Backend**   | [Nitro Server Engine](https://nitro.unjs.io/)                                                            |
| **Database**  | [Drizzle ORM](https://orm.drizzle.team/), [SQLite (libSQL)](https://turso.tech/)                           |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/)                                                                 |
| **Content**   | [@nuxt/content](https://content.nuxt.com/) (Markdown-based)                                              |
| **PDFs**      | [Puppeteer](https://pptr.dev/)                                                                           |
| **Auth**      | [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)                                             |
| **i18n**      | [@nuxtjs/i18n](https://i18n.nuxtjs.org/)                                                                 |
| **Dev Env**   | [Nix](https://nixos.org/), [Docker](https://www.docker.com/)                                              |
| **CI/CD**     | [GitHub Actions](https://github.com/features/actions)                                                    |

## 📂 Project Structure

The repository is structured to follow Nuxt conventions while maintaining a clear separation between public and private concerns.

-   `app/`: The main Nuxt application source, including pages, components, and layouts.
-   `content/`: Markdown files for the public-facing blog and project showcases.
-   `server/`: Nitro server backend.
    -   `api/`: API endpoints for handling contact forms, authentication, and CRUD operations for applications.
    -   `db/`: Drizzle ORM schema, migrations, and database connection utilities.
-   `shared/`: Code shared between the client and server (e.g., Zod schemas for validation).
-   `i18n/`: Locale files for German and English translations.
-   `public/`: Static assets like favicons and images.
-   `.github/workflows/`: CI/CD pipeline for automated Docker image builds and deployments.
-   `flake.nix`: Defines the reproducible development environment using Nix.
-   `Dockerfile` & `compose.yaml`: Define the production and development container environments.

## 🛠️ Getting Started

### Prerequisites

This project is designed to be run within either a Nix shell or a Docker container. Manual installation of dependencies on the host machine is not recommended to ensure consistency.

-   [Nix](https://nixos.org/download.html) (Recommended for development)
-   OR [Docker](https://www.docker.com/get-started)

### Development Setup

Choose one of the following methods to set up your development environment.

#### 1. Nix Shell (Recommended)

The Nix flake provides a complete, reproducible environment with the correct versions of Node.js, Chromium (for Puppeteer), and other dependencies.

1.  Clone the repository:
    ```bash
    git clone https://github.com/fleischer-design/portfolio.git
    cd portfolio
    ```

2.  Set up your environment variables:
    ```bash
    cp .env.example .env
    ```
    *Open the `.env` file and fill in your credentials.*

3.  Enter the development shell. This will automatically install all necessary dependencies if they aren't already present in your Nix store.
    ```bash
    nix develop
    ```

4.  Once inside the shell, run the Nuxt development server:
    ```bash
    npm run start:dev
    ```
    The application will be available at `http://localhost:3000`.

#### 2. Docker (Alternative)

For a fully containerized setup that mirrors the Nix environment.

1.  Clone the repository and set up your `.env` file as described above.
2.  Build and run the development containers:
    ```bash
    docker compose -f compose.dev.yaml up --build
    ```
    The application will be available at `http://localhost:3000` with hot-reloading enabled.

### Database

The project uses Drizzle ORM for database management.

-   **Generate a migration:**
    ```bash
    # Inside the Nix shell or Docker container
    npm run db:generate
    ```
-   **Apply migrations:**
    ```bash
    npm run db:migrate
    ```
-   **Explore the database with Drizzle Studio:**
    ```bash
    npm run db:studio
    ```

## 🚢 Production

The application is deployed as a Docker container. The production image is built in multiple stages for an optimized, smaller final image.

-   **Build the production image:**
    ```bash
    docker build . -t my-portfolio
    ```
-   **Run in production mode:**
    The `compose.yaml` file is configured to run the pre-built image from a container registry. For local testing, you can adapt it or use `docker run`.

## Contact

If you have any questions or want to connect, feel free to reach out!
