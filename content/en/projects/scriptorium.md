---
slug: scriptorium
locale: en
date: 2025-08-18
published: true
category: CLI & Backend
techstack:
  - Java 21
  - Gradle
  - SQLite
  - JDBC
  - Picocli
  - JLine3
  - Javalin
  - Jackson
  - JUnit 5
tags:
  - CLI
  - Interactive Shell
  - Java
  - Clean Architecture
  - API Integration
image:
  src: /img/olena-bohovyk-Ft_Wn-K5YH8-unsplash.jpg
  alt: "Placeholder image for the Scriptorium project"
title: "Scriptorium – Modular Library CLI"
subtitle: "A modern CLI tool built in Java with an interactive shell (JLine3), optional REST API server (Javalin), and Clean Architecture."
features:
  - Interactive REPL shell with history (JLine3)
  - Modular CLI command structure (Picocli)
  - Integrated, optional REST API server (Javalin)
  - Automated data import via Open Library API
  - Persistence via raw JDBC & SQLite (Repository Pattern)
  - Manual Dependency Injection (Composition Root)
learned:
  - Implementation of a robust CLI application with interactive mode (REPL)
  - Building a modular architecture ("Core" logic vs. CLI/Web interfaces)
  - Manual management of JDBC transactions without ORM frameworks
  - Integration of micro web frameworks (Javalin) into a CLI application
  - Robust handling of inconsistent JSON APIs with Jackson
challenges:
  - Synchronization of CLI and API access to the same database
  - Mapping relational SQL data to Java objects (ResultSet parsing)
  - Implementing a custom Dependency Injection mechanism without Spring
  - Error-resilient parsing of variable JSON structures (Open Library API)
url:
  project: https://github.com/fleischerdesign/Scriptorium
  repository: https://github.com/fleischerdesign/Scriptorium
---

### 1. Introduction and Motivation

Scriptorium is primarily a powerful command-line application (CLI) for managing a library. The project demonstrates how to create a user experience with modern Java libraries (Picocli, JLine3) that doesn't have to hide behind graphical interfaces. Additionally, it shows how a clean architecture ("Clean Architecture") enables the same application core to optionally be provided as a REST API (via Javalin).

### 2. Problem Statement and Goals

**Problem:** CLI tools are often clunky, don't support interactive input, and are difficult to extend. On the other hand, "enterprise" web applications are often over-engineered for local use cases.

**Goals:**
*   **Interactive Shell:** Starting the application in a REPL mode (Read-Eval-Print-Loop) with command history and autocomplete.
*   **Modularity:** Separation of input/output (CLI) and business logic (Core) to easily add a web interface later.
*   **Lightweight:** Avoiding heavy frameworks like Spring Boot in favor of focused libraries (Javalin, Picocli).
*   **Transparency:** Using JDBC instead of Hibernate to maintain full control over SQL queries.

### 3. System Architecture and Design

**Architecture Overview:**
The core of the application is independent of the presentation layer. This enabled the seamless integration of the API server as a mere "feature" of the CLI.

1.  **Interactive CLI (`org.scriptorium.application.Main`):** Uses **JLine3** for the REPL. If no arguments are passed, the interactive shell starts (`scriptorium> `).
2.  **Command Parsing (`org.scriptorium.cli`):** **Picocli** defines the command structure (`book import`, `server start`) and converts inputs into method calls.
3.  **API Server (`org.scriptorium.api`):** An integrated **Javalin** server that can be started via the CLI command `server start`. It uses the same services as the CLI.
4.  **Data Layer:** Pure **JDBC** and **SQLite** provide persistent data storage without installation overhead.

**Dependency Injection:**
A custom `DependencyFactory` acts as the Composition Root. It instantiates all repositories and services at startup and injects them into the Picocli commands. This avoids "magic" and makes the application startup extremely fast.

### 4. Implementation Highlights

**Import & Resilience:**
The `BookImportService` uses Jackson to load books from the Open Library API. Since the API can deliver unpredictable data structures (Array vs. Single Object), the service implements intelligent fallback strategies during JSON parsing.

**Hybrid Mode:**
The application is a hybrid solution. It can be used as a pure admin tool (`scriptorium book list`) or started as a server to provide data for other applications (e.g., a frontend) (`GET /api/books`).

### 5. Results and Outlook

**Achieved Goals:**
Scriptorium feels "snappy." The interactive shell is fun to use, and the ability to spawn a web server on demand makes the tool extremely flexible.

**Next Steps:**
*   **TUI Dashboard:** Extending the CLI with a text-based dashboard (using `lanterna`) for statistics.
*   **Native Image:** Thanks to the chosen libraries, compilation with GraalVM is possible to create a standalone binary without JVM dependency.

### 6. Personal Growth and Lessons Learned

**SQL & JDBC:**
Avoiding ORM frameworks sharpened my understanding of relational databases and transaction management. I had to learn how to map ResultSets efficiently and manually avoid N+1 problems.

**CLI UX:**
I learned that a good CLI is more than just parsing arguments. A consistent command structure, good help texts, and an interactive shell significantly increase the tool's acceptance.