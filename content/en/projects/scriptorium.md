---
slug: scriptorium
locale: en
date: 2025-08-18
published: true
category: Command-Line Application
techstack:
  - Java
  - Gradle
  - SQLite
  - Picocli
  - jBCrypt
  - Jackson
  - Mockito
  - JUnit 5
tags:
  - Java
  - CLI
  - Database
  - API Integration
  - System Architecture
image:
  src: /img/placeholder.jpg
  alt: "Placeholder image for the Scriptorium project"
title: "Scriptorium - A Library System"
subtitle: "A robust, command-line based library system in Java for managing books, authors, and users."
features:
  - "Comprehensive user, book, author, and publisher management"
  - "Secure password storage using BCrypt hashing"
  - "Direct integration with the Open Library API for importing book data"
  - "Persistent data storage in a lightweight SQLite database"
  - "Intuitive interactive shell for easy command execution"
learned:
  - "Designing and implementing a robust CLI architecture with Picocli."
  - "Secure password storage using BCrypt hashing and best practices."
  - "Integrating external APIs (Open Library) for data enrichment in a Java application."
  - "Efficient data persistence and transaction management with SQLite."
challenges:
  - "Designing an intuitive and error-resilient command-line interface."
  - "Efficiently parsing and processing nested JSON responses from the Open Library API."
  - "Ensuring data integrity and consistent relationships in the SQLite database."
url:
  project: https://github.com/fleischerdesign/Scriptorium
  repository: https://github.com/fleischerdesign/Scriptorium
---

### 1. Project Overview

Scriptorium is a robust, console-based library management system developed in Java. It allows for the comprehensive management of users, authors, publishers, and books through an intuitive command-line interface (CLI). A core feature is its direct integration with the Open Library API, which streamlines the process of importing book data and reduces manual data entry.

### 2. Problem and Goals

**Problem:** Smaller libraries or private collections often require simple yet powerful management software without the overhead of large, graphical applications. The solution needed to be platform-independent, resource-efficient, and controllable via the command line.

**Goals:**
*   **Efficient Data Management:** Quickly create, list, show, update, and delete all relevant entities (books, users, etc.).
*   **Security:** User passwords must be securely stored using established hashing algorithms (BCrypt).
*   **Automated Data Entry:** Reduce manual effort by importing book information from an external source like the Open Library.
*   **User-Friendliness:** Despite the text-only interface, it should be easy to operate through an interactive shell with help functions and a clear command structure.

### 3. Technology and Architecture

**Architecture:**
The application follows a clean, layered architecture, separating business logic, data access, and the presentation layer (the CLI). This promotes maintainability and testability.

*   **Presentation Layer:** `Picocli` is used to build the command-line commands, options, and the interactive shell. It translates user input into method calls within the application.
*   **Service Layer:** This is where the core application logic resides. Services like `UserService` or `BookService` coordinate operations and interact with the data access layer.
*   **Data Access Layer (DAO):** Responsible for all database communication, abstracting the SQL queries for the SQLite database.
*   **Model:** Plain Old Java Objects (POJOs) that represent the data structures like `User`, `Book`, etc.

**Technology Choices:**
*   **Java 21:** A modern, stable, and platform-independent language.
*   **Gradle:** A powerful build tool that simplifies dependency management and the build process.
*   **Picocli:** A framework that dramatically simplifies the development of CLIs in Java while providing powerful features like auto-completion.
*   **SQLite:** A lightweight, serverless database perfect for a self-contained desktop/CLI application.
*   **Jackson:** A de-facto standard for JSON processing in Java, necessary for communicating with the Open Library API.

### 4. Outcome

The result is a fully functional, performant, and portable command-line application for library management. It is easy to use and, thanks to the Gradle wrapper scripts, easy to build and run. The codebase is well-tested with unit and integration tests using JUnit 5 and Mockito.
