---
slug: scriptorium
locale: de
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
  alt: "Platzhalterbild für das Scriptorium Projekt"
title: "Scriptorium – Modulares Bibliotheks-CLI"
subtitle: "Ein modernes, in Java entwickeltes CLI-Tool mit interaktiver Shell (JLine3), optionalem REST-API-Server (Javalin) und Clean Architecture."
features:
  - Interaktive REPL-Shell mit History (JLine3)
  - Modulare CLI-Befehlsstruktur (Picocli)
  - Integrierter, optionaler REST-API-Server (Javalin)
  - Automatisierter Datenimport via Open Library API
  - Persistenz via Raw JDBC & SQLite (Repository Pattern)
  - Manuelle Dependency Injection (Composition Root)
learned:
  - Implementierung einer robusten CLI-Anwendung mit interaktivem Modus (REPL)
  - Aufbau einer modularen Architektur ("Core" Logik vs. CLI/Web Interfaces)
  - Manuelle Verwaltung von JDBC-Transaktionen ohne ORM-Frameworks
  - Integration von Micro-Web-Frameworks (Javalin) in eine CLI-Anwendung
  - Robuste Verarbeitung inkonsistenter JSON-APIs mit Jackson
challenges:
  - Synchronisation von CLI- und API-Zugriffen auf dieselbe Datenbasis
  - Mapping von relationalen SQL-Daten auf Java-Objekte (ResultSet Parsing)
  - Implementierung eines eigenen Dependency-Injection-Mechanismus ohne Spring
  - Fehlerresistentes Parsen variabler JSON-Strukturen (Open Library API)
url:
  project: https://github.com/fleischerdesign/Scriptorium
  repository: https://github.com/fleischerdesign/Scriptorium
---

### 1. Einleitung und Motivation

Scriptorium ist primär eine leistungsfähige Kommandozeilenanwendung (CLI) zur Verwaltung einer Bibliothek. Das Projekt demonstriert, wie man mit modernen Java-Bibliotheken (Picocli, JLine3) eine User Experience schafft, die sich vor grafischen Oberflächen nicht verstecken muss. Zusätzlich zeigt es, wie eine saubere Architektur ("Clean Architecture") es ermöglicht, denselben Anwendungskern optional auch als REST-API (via Javalin) bereitzustellen.

### 2. Problemstellung und Ziele

**Problem:** CLI-Tools sind oft sperrig, unterstützen keine interaktive Eingabe und sind schwer zu erweitern. Andererseits sind "Enterprise"-Webanwendungen oft überladen für lokale Use-Cases.

**Ziele:**
*   **Interaktive Shell:** Starten der Anwendung in einem REPL-Modus (Read-Eval-Print-Loop) mit Command-History und Autocomplete.
*   **Modularität:** Trennung von Ein-/Ausgabe (CLI) und Geschäftslogik (Core), um später einfach eine Web-Schnittstelle hinzufügen zu können.
*   **Leichtgewicht:** Verzicht auf schwere Frameworks wie Spring Boot zugunsten von fokussierten Bibliotheken (Javalin, Picocli).
*   **Transparenz:** Nutzung von JDBC statt Hibernate, um volle Kontrolle über die SQL-Queries zu behalten.

### 3. Systemarchitektur und Design

**Architekturüberblick:**
Der Kern der Anwendung ist unabhängig von der Präsentationsschicht. Dies ermöglichte die nahtlose Integration des API-Servers als bloßes "Feature" der CLI.

1.  **Interactive CLI (`org.scriptorium.application.Main`):** Nutzt **JLine3** für die REPL. Wenn keine Argumente übergeben werden, startet die interaktive Shell (`scriptorium> `).
2.  **Command Parsing (`org.scriptorium.cli`):** **Picocli** definiert die Befehlsstruktur (`book import`, `server start`) und wandelt Eingaben in Methodenaufrufe um.
3.  **API Server (`org.scriptorium.api`):** Ein integrierter **Javalin**-Server, der über das CLI-Kommando `server start` hochgefahren werden kann. Er nutzt dieselben Services wie die CLI.
4.  **Data Layer:** Reines **JDBC** und **SQLite** sorgen für persistente Datenhaltung ohne Installationsaufwand.

**Dependency Injection:**
Ein eigenes `DependencyFactory` fungiert als Composition Root. Es instanziiert alle Repositories und Services beim Start und injiziert sie in die Picocli-Commands. Das vermeidet "Magie" und macht den Applikationsstart extrem schnell.

### 4. Implementierungshighlights

**Import & Resilienz:**
Der `BookImportService` nutzt Jackson, um Bücher von der Open Library API zu laden. Da die API unvorhersehbare Datenstrukturen liefern kann (Array vs. Single Object), implementiert der Service intelligente Fallback-Strategien beim JSON-Parsen.

**Hybrid-Modus:**
Die Anwendung ist eine Hybrid-Lösung. Man kann sie als reines Admin-Tool nutzen (`scriptorium book list`) oder als Server starten, um Daten für andere Anwendungen (z.B. ein Frontend) bereitzustellen (`GET /api/books`).

### 5. Ergebnisse und Ausblick

**Erreichte Ziele:**
Scriptorium fühlt sich "snappy" an. Die interaktive Shell macht Spaß bei der Benutzung, und die Möglichkeit, bei Bedarf einen Webserver zu spawnen, macht das Tool extrem flexibel.

**Nächste Schritte:**
*   **TUI Dashboard:** Erweiterung der CLI um ein textbasiertes Dashboard (mit `lanterna`) für Statistiken.
*   **Native Image:** Dank der gewählten Bibliotheken ist eine Kompilierung mit GraalVM möglich, um eine Standalone-Binary ohne JVM-Abhängigkeit zu erzeugen.

### 6. Persönliches Wachstum und Lessons Learned

**SQL & JDBC:**
Der Verzicht auf ORM-Frameworks hat mein Verständnis für relationale Datenbanken und Transaktionsmanagement geschärft. Ich musste lernen, ResultSets effizient zu mappen und N+1 Probleme manuell zu vermeiden.

**CLI UX:**
Ich habe gelernt, dass eine gute CLI mehr ist als nur Argumente parsen. Eine konsistente Befehlsstruktur, gute Hilfetexte und eine interaktive Shell erhöhen die Akzeptanz des Tools enorm.