---
slug: nixfiles
locale: de
date: 2023-12-28
published: true
icon: logo:nixfiles
category: System Administration
techstack:
  - NixOS
  - Nix
  - Niri
  - Quickshell
  - Qt Quick (QML)
  - Wayland
  - TypeScript
  - Home Manager
  - Fish
  - direnv
tags:
  - NixOS
  - Custom UI
  - Window Manager
  - QML
  - Dotfiles
  - Declarative
image:
  src: /img/lukas-DTochqoK3Rg-unsplash.jpg
  alt: "NixOS Setup mit Niri und Quickshell"
title: "Nixfiles – Custom NixOS & Desktop Environment"
subtitle: "Eine maßgeschneiderte NixOS-Konfiguration mit einem selbst entwickelten Desktop-Interface basierend auf Niri und Quickshell."
features:
  - Deklarative Systemkonfiguration mit Nix Flakes
  - "Niri: Scrollable Tiling Window Manager (Wayland)"
  - "Quickshell: Eigenes Desktop-Overlay (QML/JS)"
  - Automatisierte Modulerkennung (lib/helper.nix)
  - Intelligentes Dependency- & Konflikt-Management
  - Vollständige Typisierung und Reproduzierbarkeit
learned:
  - Entwicklung komplexer Desktop-UIs mit Qt Quick/QML und JavaScript
  - Tiefes Verständnis des Wayland-Protokolls und IPC
  - Fortgeschrittene Nix-Programmierung (Recursion, Metadata-Scanning)
  - Implementierung von Snowfall-ähnlichen Optimierungs-Pattern in Nix
challenges:
  - Dynamische Auflösung von Feature-Abhängigkeiten zur Laufzeit
  - Kommunikation zwischen Niri (Window Manager) und Quickshell (UI) via IPC
  - Performante UI-Animationen und State Management in QML
  - Synchronisation von System-Status (Audio, Backlight) ohne klassische DE
url:
  repository: https://github.com/fleischerdesign/nixfiles
---

### 1. Einleitung und Motivation

Dieses Projekt ist weit mehr als eine Sammlung von Konfigurationsdateien ("Dotfiles"). Es repräsentiert die Entwicklung einer vollständig maßgeschneiderten Desktop-Umgebung auf Basis von **NixOS**. Nachdem ich jahrelang GNOME genutzt hatte, wollte ich ein System, das sich exakt meinen Arbeitsabläufen anpasst, statt mich einzuschränken. Die Lösung war der Wechsel auf **Niri** (einem Scrollable Tiling Window Manager) kombiniert mit einer selbst geschriebenen Shell-Oberfläche in **Quickshell**. Das Herzstück ist die Automatisierungsebene, die es erlaubt, komplexe Software-Stacks deklarativ und konfliktfrei zu verwalten.

### 2. Problemstellung und Ziele

**Problem:** Herkömmliche Desktop-Umgebungen (DEs) sind oft unflexibel. Tiling Window Manager (WMs) bieten zwar Effizienz, es fehlt ihnen aber oft an Ästhetik und modernen UI-Funktionen. Zudem neigen große Konfigurationen dazu, unübersichtlich zu werden ("Spaghetti-Code").

**Ziele:**
*   **Totale Kontrolle:** Jeder Pixel des Desktops und jede Systemkomponente soll kontrollierbar sein.
*   **Moderne Ästhetik:** Flüssige Animationen und ein einheitliches Design-System (Material You inspiriert).
*   **Abstrakte Automatisierung:** Neue Features sollen durch bloßes Hinzufügen von Dateien erkannt und integriert werden.
*   **Reproduzierbarkeit:** Das gesamte System muss auf jedem Rechner (Laptop "jello" oder Workstation "yorke") identisch funktionieren.

### 3. Systemarchitektur und Design

**Architekturüberblick:**
Das System folgt einem modularen "Feature-First"-Ansatz. Die Logik der Fensterverwaltung (**Niri**) ist strikt von der optischen Repräsentation (**Quickshell**) getrennt.

**Das Herzstück: `lib/helper.nix`**
Die gesamte Systemerstellung wird durch eine leistungsstarke Funktionsbibliothek gesteuert. Statt Module manuell zu importieren, nutzt der Helper dynamisches Verzeichnis-Scanning:
*   **Automatisches Discovery:** Alle Unterordner in `features/` werden gescannt. Findet der Helper eine `default.nix`, wird sie automatisch als NixOS-Modul eingebunden.
*   **Zweistufiges Metadaten-Loading:** In einer ersten Phase werden nur `metadata.nix`-Dateien gelesen, um Abhängigkeiten zu prüfen, bevor der eigentliche Build startet.
*   **Auto-Enablement:** Features können andere Features anfordern (z.B. benötigt `desktop.niri` automatisch `system.wayland`).

**Technologie-Stack:**
*   **Niri:** Ein Wayland-Compositor, der Fenster in einer unendlichen horizontalen Rolle anordnet.
*   **Quickshell (QML/JS):** Ermöglicht hardwarebeschleunigte UIs mit Qt Quick.
*   **Home Manager:** Tief in den System-Build integriert für nahtlose User-Config (Nixcord, Nixvim).

### 4. Implementierungshighlights

**Intelligentes Dependency-Management:**
Innerhalb der `lib/helper.nix` wurde ein rekursiver Resolver implementiert. Dieser stellt sicher, dass:
1.  Alle benötigten Abhängigkeiten eines Features automatisch aktiviert werden.
2.  Konflikte (z.B. zwei verschiedene Bootloader) bereits zur Evaluierungszeit erkannt und mit einer klaren Fehlermeldung abgebrochen werden.
3.  Die Hardware-spezifischen Unterschiede (AMD vs. Intel) über ein sauberes Metadaten-Mapping in den `hosts/`-Ordnern abstrahiert werden.

**Custom Desktop Shell:**
Die Shell wurde von Grund auf in QML entwickelt. Sie kommuniziert via IPC mit System-Services:
*   **Audio & Brightness:** Eigene OSDs (On-Screen-Displays), die auf Hardware-Events reagieren.
*   **App-Launcher:** Ein performanter, Tastatur-gesteuerter Launcher mit integrierter Suche.
*   **State Manager:** Ein zentrales QML-Objekt, das den Status aller Systemkomponenten verwaltet und an die UI-Komponenten verteilt.

### 5. Ergebnisse und Ausblick

**Erreichte Ziele:**
Mein System ist nun vollständig deklarativ. Ich kann eine neue Hardware mit einem einzigen Befehl (`nixos-rebuild switch --flake .#hostname`) in meinen exakten Desktop-Zustand versetzen. Die Trennung von Logik und UI in Niri/Quickshell sorgt für eine unerreichte Stabilität und Flexibilität.

**Nächste Schritte:**
*   **Dynamic Theming:** Automatische Farbanpassung des gesamten Systems (inkl. QML-Shell und Terminal) basierend auf dem gewählten Wallpaper.
*   **Global Search:** Erweiterung des Launchers um Datei-Inhaltssuche und Taschenrechner-Funktionen direkt im QML-Interface.

### 6. Persönliches Wachstum und Lessons Learned

**Funktionale Programmierung in Nix:**
Die Entwicklung der `helper.nix` war eine tiefgreifende Übung in funktionaler Programmierung. Patterns wie Lazy Evaluation, Recursion über Attribut-Sets und das Handling von String-Contexts waren essenziell, um die Performance bei wachsender Modulanzahl hochzuhalten.

**Linux Desktop Engineering:**
Der Verzicht auf fertige Lösungen (GNOME/KDE) zwang mich dazu, die zugrunde liegenden Protokolle (Wayland, D-Bus, Pipewire) im Detail zu verstehen. Die Erkenntnis, wie man System-Events in eine reaktive UI übersetzt, hat meine Herangehensweise an Software-Architektur nachhaltig verändert.