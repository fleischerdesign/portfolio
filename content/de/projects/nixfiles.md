---
slug: nixfiles
locale: de
date: 2023-12-28
published: true
icon: logo:nixfiles
category: Systemadministration
techstack:
  - NixOS
  - Nix
  - Home Manager
  - GNOME
  - Pipewire
  - Fish
  - direnv
tags:
  - NixOS
  - Konfigurationsmanagement
  - Dotfiles
image:
  src: /img/lukas-DTochqoK3Rg-unsplash.jpg
  alt: "NixOS Setup"
title: "Nixfiles – Meine Dotfiles"
subtitle: "Meine persönliche NixOS- und Home-Manager-Konfiguration, verwaltet mit Nix Flakes für eine reproduzierbare und modulare Systemumgebung."
features:
  - Deklarative Systemkonfiguration mit NixOS
  - Benutzerdefinierte GNOME-Desktop-Umgebung
  - Entwicklungsumgebung mit NixVim und VS Codium
  - Gaming-Setup mit Steam, Lutris und Sunshine
  - Automatisierte Modulerkennung und Systemerstellung
learned:
  - Tiefes Verständnis von Nix und dem Flake-System
  - Erstellung wiederverwendbarer NixOS-Module
  - Automatisierung von Konfigurations-Workflows
  - Anpassung und Erweiterung von Nixpkgs durch Overlays
challenges:
  - Verwaltung systemspezifischer Hardware-Konfigurationen (AMD vs. Intel)
  - Sicherstellung der Kompatibilität von GNOME-Erweiterungen
  - Erstellung benutzerdefinierter Pakete für spezifische Anwendungen
url:
  repository: https://github.com/fleischerdesign/nixfiles
---
## Übersicht
Dieses Projekt enthält meine persönlichen NixOS- und Home-Manager-Konfigurationen, die mit Nix Flakes verwaltet werden. Ziel ist eine hochgradig modulare und automatisierte Umgebung, die es mir ermöglicht, meine Systeme "yorke" (AMD) und "jello" (Intel) konsistent und reproduzierbar zu verwalten. Die Konfiguration ist so strukturiert, dass sie leicht anpassbar und erweiterbar ist, während sie gleichzeitig eine robuste und stabile Basis für meine tägliche Arbeit und Freizeit bietet.

---

## Technische Details

### Struktur des Projekts
Die Konfiguration ist in mehrere logische Verzeichnisse unterteilt, um die Modularität und Wartbarkeit zu maximieren:
- **`flake.nix`**: Der Haupteinstiegspunkt, der alle notwendigen Eingaben wie `nixpkgs`, `home-manager` und andere Abhängigkeiten einbindet. Er definiert die System-Builds und die verfügbaren Konfigurationen.
- **`lib/helper.nix`**: Das Herzstück der Automatisierung. Diese Bibliothek enthält Funktionen zur dynamischen Erstellung von Systemen (`mkSystem`), zur automatischen Erkennung von Modulen (generiert `my.nixos.<module>.enable`-Optionen) und zur Verwaltung von Home-Manager-Konfigurationen in verschiedenen Schichten.
- **`hosts/`**: Enthält alle maschinenspezifischen Konfigurationen. Ein `base.nix` definiert die Grundeinstellungen für alle Hosts, während separate Verzeichnisse für `yorke` (AMD-System) und `jello` (Intel-System) hardwarespezifische Anpassungen enthalten.
- **`home-manager/`**: Verwaltet die Home-Manager-Konfigurationen. `default/` enthält allgemeine Einstellungen, die für alle Benutzer gelten, während `philipp/` meine persönlichen, benutzerspezifischen Setups enthält.
- **`modules/nixos/`**: Eine Sammlung von wiederverwendbaren NixOS-Modulen, die spezifische Funktionalitäten kapseln, z.B. für den Bootloader, Audio (Pipewire), die Desktop-Umgebung (GNOME) oder das Gaming-Setup.
- **`overlays/`**: Nixpkgs-Overlays werden verwendet, um bestehende Pakete anzupassen oder zu patchen. Ein Beispiel ist das Overlay für die deutsche Lokalisierung der `pip-on-top` GNOME-Erweiterung.
- **`packages/`**: Enthält Definitionen für benutzerdefinierte Pakete, die nicht in den offiziellen `nixpkgs` enthalten sind, wie z.B. `ficsit` (Satisfactory Mod Manager), `karere` (ein einfacher RSS-Reader) und `lychee-slicer`.

### Highlights der Konfiguration
- **Desktop-Umgebung**: Eine stark angepasste GNOME-Umgebung, die auf Produktivität und Ästhetik ausgelegt ist. Zu den Erweiterungen gehören `blur-my-shell` für visuelle Effekte, `gsconnect` zur Integration von Mobilgeräten, `dash-to-dock` für eine verbesserte Navigation und `paperwm` für ein Tiling-Window-Management-Erlebnis.
- **Entwicklung**: Eine auf meine Bedürfnisse zugeschnittene Entwicklungsumgebung. `NixVim` (eine mit Nix konfigurierte Neovim-Distribution) und `VS Codium` sind als primäre Editoren vorkonfiguriert. Die Fish-Shell in Kombination mit `direnv` ermöglicht eine nahtlose Verwaltung von projekt-spezifischen Umgebungsvariablen und Abhängigkeiten.
- **Gaming**: Ein optimiertes Setup für Gaming unter Linux. `Steam` und `Lutris` sind für den Zugriff auf eine breite Palette von Spielen installiert. `Sunshine` wird als Game-Streaming-Host verwendet, um Spiele auf andere Geräte im Heimnetzwerk zu streamen.
- **Automatisierung**: Die `lib/helper.nix`-Bibliothek automatisiert die Erkennung und Einbindung von Modulen, was die Wartung erheblich vereinfacht. Neue Module im `modules`-Verzeichnis werden automatisch als Optionen verfügbar gemacht, ohne dass manuelle Änderungen an der Hauptkonfiguration erforderlich sind.

---

## Installation und Anwendung
Die Konfiguration kann auf einem neuen NixOS-System einfach durch Klonen des Repositories und Ausführen des folgenden Befehls angewendet werden:
```bash
sudo nixos-rebuild switch --flake .#<hostname>
```
Dabei muss `<hostname>` durch den Namen des Zielsystems (z.B. `yorke` oder `jello`) ersetzt werden. Die Home-Manager-Konfiguration wird dabei automatisch mit ausgerollt.

---

## Warum dieses Projekt?
Die Verwaltung meiner Systemkonfigurationen mit Nix und Flakes bietet mir mehrere entscheidende Vorteile:
- **Reproduzierbarkeit**: Ich kann meine Systeme jederzeit exakt in einem definierten Zustand wiederherstellen. Dies eliminiert Konfigurationsdrift und vereinfacht die Wiederherstellung nach einem Systemausfall.
- **Modularität**: Durch die Aufteilung in Module kann ich Konfigurationen leicht zwischen meinen Systemen teilen, wiederverwenden und anpassen, ohne Code zu duplizieren.
- **Automatisierung**: Die `helper.nix`-Bibliothek reduziert den manuellen Aufwand bei der Verwaltung von Modulen und Systemen erheblich und macht die Konfiguration skalierbarer.
- **Lernplattform**: Dieses Projekt ist meine persönliche Lernplattform, um tiefer in die Welt von Nix, funktionaler Programmierung und deklarativer Systemkonfiguration einzutauchen.

🔗 **GitHub-Repo**: [fleischerdesign/nixfiles](https://github.com/fleischerdesign/nixfiles)
