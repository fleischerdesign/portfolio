---
slug: scriptorium
locale: en
date: 2025-08-18
published: true
category: Command Line
techstack:
  - Java
  - Gradle
  - SQL
  - BCrypt
  - Jackson
  - Mockito
  - JUnit
tags:
  - Java
  - CLI
  - Database
  - API Integration
  - System Architecture
image:
  src: /img/olena-bohovyk-Ft_Wn-K5YH8-unsplash.jpg
  alt: "Placeholder image for the Scriptorium project"
title: "Scriptorium – A Library System"
subtitle: "A robust, command-line-based library system in Java for managing books, authors, and users."
features:
  - "Comprehensive user, book, author, and publisher management"
  - "Secure password storage through BCrypt hashing"
  - "Direct integration of the Open Library API for importing book data"
  - "Persistent data storage in a lightweight SQLite database"
  - "Intuitive interactive shell for easy command execution"
learned:
  - "Design and implementation of a robust CLI architecture with Picocli."
  - "Secure password storage using BCrypt hashing and best practices."
  - "Integration of external APIs (Open Library) for data enrichment in a Java application."
  - "Efficient data persistence and transaction management with SQLite."
challenges:
  - "Designing an intuitive and error-resistant command-line interface."
  - "Efficiently parsing and processing the nested JSON responses from the Open Library API."
  - "Ensuring data integrity and consistent relationships in the SQLite database."
url:
  project: https://github.com/fleischerdesign/Scriptorium
  repository: https://github.com/fleischerdesign/Scriptorium
---

### 1. Project Overview

Scriptorium is a robust, console-based library system developed in Java. It enables comprehensive management of users, authors, publishers, and books through an intuitive command-line interface (CLI). A core feature is the direct integration with the Open Library API, which significantly simplifies importing book data and reduces manual data entry.

### 2. Problem Statement and Objectives

**Problem:** Smaller libraries or private collections often need simple yet powerful management software without the overhead of large, graphical applications. The solution should be platform-independent, resource-efficient, and controllable via the command line.

**Objectives:**
*   **Efficient Data Management:** Quick creation, viewing, updating, and deletion of all relevant entities (books, users, etc.).
*   **Security:** User passwords must be securely stored using established hashing algorithms (BCrypt).
*   **Automated Data Entry:** Reduction of manual effort through importing book information from an external source like Open Library.
*   **User-Friendliness:** Despite being purely text-based, operation should be simple through an interactive shell with help functions and a clear command structure.

### 3. Technology Choice and Architecture

**Architecture:**
The application follows a clear layered architecture that separates business logic, data access, and presentation layer (CLI) from each other. This promotes maintainability and testability of the code.

*   **Presentation Layer:** `Picocli` is used to create the command-line commands, options, and interactive shell. It converts user input into method calls within the application.
*   **Service Layer:** This is where the core application logic resides. Services like `UserService` or `BookService` coordinate operations and interact with the data access layer.
*   **Data Access Layer (DAO):** Responsible for all database communication. It abstracts the SQL queries for the SQLite database.
*   **Model:** Simple Java objects (POJOs) that represent data structures like `User`, `Book`, etc.

**Technology Justification:**
*   **Java 21:** A modern, stable, and platform-independent language.
*   **Gradle:** Powerful build tool that simplifies dependency management and the build process.
*   **Picocli:** A framework that drastically simplifies CLI development in Java while providing powerful features like auto-completion.
*   **SQLite:** A lightweight, serverless database perfect for a self-contained desktop/CLI application.
*   **Jackson:** The de-facto standard for JSON processing in Java, necessary for communication with the Open Library API.

### 4. Result

The result is a fully functional, performant, and portable command-line application for library management. It is easy to use and can be built and executed easily through the Gradle wrapper scripts. The codebase is well secured by unit and integration tests with JUnit 5 and Mockito.