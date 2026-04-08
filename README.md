# Personal Portfolio & Application Manager

Welcome to the official repository for my personal portfolio website, [fleischer.design](https://fleischer.design). This project serves a dual purpose: it's a public-facing portfolio and blog, and a private, authenticated backend for managing job applications.

It is built with a modern, full-stack technology stack to ensure a great developer and user experience, with a focus on reproducible environments and a clean separation of concerns.

## Features

- **Full-Stack with Nuxt:** Built with Nuxt and the intuitive Vue framework, handling both the frontend and a powerful server backend.
- **Content-Driven Portfolio:** Uses database-driven content management for blog posts and project descriptions.
- **Private Application Management:**
  - Authenticated section to create, view, and manage job applications.
  - CRUD functionality for applications, including status updates and deletion.
  - On-demand, secure generation of application documents as PDFs using **Puppeteer**.
- **Relational Database:** Uses **Drizzle ORM** with a SQLite database (`libsql`) to manage all application, company, and user data.
- **Reproducible Environments:**
  - **Nix Flake:** A `flake.nix` file provides a fully reproducible development environment.
  - **Docker Container:** Built from Nix for deployment.
- **Modern Frontend:**
  - Styling with **Tailwind CSS** for a clean, responsive, utility-first design.
  - Bilingual content support (DE/EN) with `@nuxtjs/i18n`.
  - Dark & Light Mode.
  - Rich data visualizations, including a GitHub contribution chart.
- **Authentication:** Secure authentication powered by `nuxt-auth-utils`.
- **CI/CD:** Automated build and deployment pipeline using **GitHub Actions**.

## Tech Stack

| Category      | Technology                                                                       |
| ------------- | -------------------------------------------------------------------------------- |
| **Framework** | [Nuxt.js](https://nuxt.com/) (v4), [Vue.js](https://vuejs.org/)                  |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                                    |
| **Backend**   | [Nitro Server Engine](https://nitro.unjs.io/)                                    |
| **Database**  | [Drizzle ORM](https://orm.drizzle.team/), [SQLite (libSQL)](https://turso.tech/) |
| **Styling**   | [Tailwind CSS](https://tailwindcss.com/)                                         |
| **Content**   | Database-driven content management                                               |
| **PDFs**      | [Puppeteer](https://pptr.dev/)                                                   |
| **Auth**      | [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils)                     |
| **i18n**      | [@nuxtjs/i18n](https://i18n.nuxtjs.org/)                                         |
| **Dev Env**   | [Nix](https://nixos.org/)                                                        |
| **CI/CD**     | [GitHub Actions](https://github.com/features/actions)                            |

## Project Structure

The repository is structured to follow Nuxt conventions while maintaining a clear separation between public and private concerns.

- `app/`: The main Nuxt application source, including pages, components, and layouts.
- `server/`: Nitro server backend.
  - `api/`: API endpoints for handling contact forms, authentication, and CRUD operations for applications.
  - `db/`: Drizzle ORM schema, migrations, and database connection utilities.
- `shared/`: Code shared between the client and server (e.g., Zod schemas for validation).
- `public/`: Static assets like favicons and images.
- `.github/workflows/`: CI/CD pipeline for automated Docker image builds and deployments.
- `flake.nix`: Defines the reproducible development environment, build, and Docker container using Nix.

## Getting Started

### Prerequisites

This project is designed to be run within a Nix shell. Manual installation of dependencies on the host machine is not recommended to ensure consistency.

- [Nix](https://nixos.org/download.html) with flakes enabled

### Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/fleischer-design/portfolio.git
   cd portfolio
   ```

2. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   _Open the `.env` file and fill in your credentials._

3. Enter the development shell. This will automatically install all necessary dependencies if they aren't already present in your Nix store.

   ```bash
   nix develop
   ```

4. Once inside the shell, run the Nuxt development server:
   ```bash
   npm run start:dev
   ```
   The application will be available at `http://localhost:3000`.

### Database

The project uses Drizzle ORM for database management.

- **Generate a migration:**
  ```bash
  npm run db:generate
  ```
- **Apply migrations:**
  ```bash
  npm run db:migrate
  ```
- **Push schema changes (Directly to DB):**
  ```bash
  npm run db:push
  ```
- **Explore the database with Drizzle Studio:**
  ```bash
  npm run db:studio
  ```

## Production

### Build & Run with Nix

The application can be built and run directly with Nix:

```bash
# Build the application
nix build

# Run the built application
./result/bin/portfolio
```

### Docker Container

Build and run as a Docker container:

```bash
# Build the container image
nix build .#dockerImage

# Load the image into Docker
docker load < result/result.tar.gz

# Run the container (with data volume)
docker run -v /path/to/data:/app/data -p 3000:3000 portfolio:latest
```

### GitHub Actions CI/CD

The CI/CD pipeline automatically builds and pushes the Docker image to GitHub Container Registry on every push to master.

## Contact

If you have any questions or want to connect, feel free to reach out!
