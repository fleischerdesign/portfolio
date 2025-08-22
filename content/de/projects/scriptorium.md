---
slug: scriptorium
locale: de
date: 2025-08-18
published: true
category: Kommandozeile
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
  - Datenbank
  - API-Integration
  - Systemarchitektur
image:
  src: /img/olena-bohovyk-Ft_Wn-K5YH8-unsplash.jpg
  alt: "Platzhalterbild für das Scriptorium Projekt"
title: "Scriptorium – Ein Bibliothekssystem"
subtitle: "Ein robustes, kommandozeilenbasiertes Bibliothekssystem in Java zur Verwaltung von Büchern, Autoren und Benutzern."
features:
  - "Umfassende Benutzer-, Buch-, Autoren- und Verlagsverwaltung"
  - "Sichere Passwortspeicherung durch BCrypt-Hashing"
  - "Direkte Integration der Open Library API zum Importieren von Buchdaten"
  - "Persistente Datenspeicherung in einer leichten SQLite-Datenbank"
  - "Intuitive interaktive Shell für einfache Befehlsausführung"
learned:
  - "Entwurf und Implementierung einer robusten CLI-Architektur mit Picocli."
  - "Sichere Passwortspeicherung mittels BCrypt-Hashing und Best Practices."
  - "Integration externer APIs (Open Library) zur Datenanreicherung in einer Java-Anwendung."
  - "Effiziente Datenpersistenz und Transaktionsmanagement mit SQLite."
challenges:
  - "Gestaltung einer intuitiven und fehlerresistenten Kommandozeilen-Schnittstelle."
  - "Effizientes Parsen und Verarbeiten der verschachtelten JSON-Antworten von der Open Library API."
  - "Sicherstellung der Datenintegrität und konsistenter Beziehungen in der SQLite-Datenbank."
url:
  project: https://github.com/fleischerdesign/Scriptorium
  repository: https://github.com/fleischerdesign/Scriptorium
---

### 1. Projektübersicht

Scriptorium ist ein in Java entwickeltes, robustes und konsolenbasiertes Bibliothekssystem. Es ermöglicht die umfassende Verwaltung von Benutzern, Autoren, Verlagen und Büchern über eine intuitive Kommandozeilenschnittstelle (CLI). Eine Kernfunktion ist die direkte Integration mit der Open Library API, die das Importieren von Buchdaten erheblich vereinfacht und die manuelle Dateneingabe reduziert.

### 2. Problemstellung und Ziele

**Problem:** Kleinere Bibliotheken oder private Sammlungen benötigen oft eine einfache, aber leistungsstarke Verwaltungssoftware, ohne den Overhead großer, grafischer Anwendungen. Die Lösung sollte plattformunabhängig, ressourcenschonend und über die Kommandozeile steuerbar sein.

**Ziele:**
*   **Effiziente Datenverwaltung:** Schnelles Erstellen, Anzeigen, Aktualisieren und Löschen aller relevanten Entitäten (Bücher, Benutzer etc.).
*   **Sicherheit:** Passwörter der Benutzer müssen sicher mit etablierten Hashing-Algorithmen (BCrypt) gespeichert werden.
*   **Automatisierte Dateneingabe:** Reduzierung des manuellen Aufwands durch den Import von Buchinformationen aus einer externen Quelle wie der Open Library.
*   **Benutzerfreundlichkeit:** Trotz der reinen Text-Schnittstelle soll die Bedienung durch eine interaktive Shell mit Hilfefunktionen und klarer Befehlsstruktur einfach sein.

### 3. Technologiewahl und Architektur

**Architektur:**
Die Anwendung folgt einer klaren Schichtenarchitektur, die Geschäftslogik, Datenzugriff und Präsentationsschicht (CLI) voneinander trennt. Dies fördert die Wartbarkeit und Testbarkeit des Codes.

*   **Präsentationsschicht:** `Picocli` wird verwendet, um die Kommandozeilenbefehle, Optionen und die interaktive Shell zu erstellen. Es wandelt Benutzereingaben in Methodenaufrufe innerhalb der Anwendung um.
*   **Service-Schicht:** Hier liegt die Kernlogik der Anwendung. Services wie `UserService` oder `BookService` koordinieren die Operationen und interagieren mit der Datenzugriffsschicht.
*   **Datenzugriffsschicht (DAO):** Verantwortlich für die gesamte Datenbankkommunikation. Sie abstrahiert die SQL-Abfragen für die SQLite-Datenbank.
*   **Modell:** Einfache Java-Objekte (POJOs), die die Datenstrukturen wie `User`, `Book` etc. repräsentieren.

**Technologie-Begründung:**
*   **Java 21:** Eine moderne, stabile und plattformunabhängige Sprache.
*   **Gradle:** Mächtiges Build-Tool, das die Verwaltung von Abhängigkeiten und den Build-Prozess vereinfacht.
*   **Picocli:** Ein Framework, das die Entwicklung von CLIs in Java drastisch vereinfacht und gleichzeitig mächtige Features wie Autovervollständigung bietet.
*   **SQLite:** Eine leichte, serverlose Datenbank, die perfekt für eine in sich geschlossene Desktop-/CLI-Anwendung geeignet ist.
*   **Jackson:** Ein De-facto-Standard für die JSON-Verarbeitung in Java, notwendig für die Kommunikation mit der Open Library API.

### 4. Ergebnis

Das Ergebnis ist eine voll funktionsfähige, performante und portable Kommandozeilen-Anwendung zur Bibliotheksverwaltung. Sie ist einfach zu bedienen und durch die Gradle-Wrapper-Skripte leicht zu bauen und auszuführen. Die Codebasis ist durch Unit- und Integrationstests mit JUnit 5 und Mockito gut abgesichert.
