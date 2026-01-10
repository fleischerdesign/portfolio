---
slug: nixfiles
locale: en
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
  alt: "NixOS Setup with Niri and Quickshell"
title: "Nixfiles – Custom NixOS & Desktop Environment"
subtitle: "A tailored NixOS configuration with a self-developed desktop interface based on Niri and Quickshell."
features:
  - Declarative system configuration with Nix Flakes
  - "Niri: Scrollable Tiling Window Manager (Wayland)"
  - "Quickshell: Custom desktop overlay (QML/JS)"
  - Automated module detection (lib/helper.nix)
  - Intelligent dependency & conflict management
  - Full typing and reproducibility
learned:
  - Developing complex desktop UIs with Qt Quick/QML and JavaScript
  - Deep understanding of the Wayland protocol and IPC
  - Advanced Nix programming (Recursion, Metadata Scanning)
  - Implementation of Snowfall-like optimization patterns in Nix
challenges:
  - Dynamic resolution of feature dependencies at runtime
  - Communication between Niri (Window Manager) and Quickshell (UI) via IPC
  - Performant UI animations and state management in QML
  - Synchronization of system status (audio, backlight) without a classic DE
url:
  repository: https://github.com/fleischerdesign/nixfiles
---

### 1. Introduction and Motivation

This project is far more than a collection of configuration files ("Dotfiles"). It represents the development of a fully customized desktop environment based on **NixOS**. After using GNOME for years, I wanted a system that adapts precisely to my workflows instead of restricting me. The solution was switching to **Niri** (a scrollable tiling window manager) combined with a self-written shell interface in **Quickshell**. The core is the automation layer, which allows managing complex software stacks declaratively and without conflicts.

### 2. Problem Statement and Goals

**Problem:** Conventional desktop environments (DEs) are often inflexible. Tiling window managers (WMs) offer efficiency but often lack aesthetics and modern UI features. Furthermore, large configurations tend to become messy ("spaghetti code").

**Goals:**
*   **Total Control:** Every pixel of the desktop and every system component should be controllable.
*   **Modern Aesthetics:** Smooth animations and a unified design system (inspired by Material You).
*   **Abstract Automation:** New features should be detected and integrated simply by adding files.
*   **Reproducibility:** The entire system must function identically on any machine (laptop "jello" or workstation "yorke").

### 3. System Architecture and Design

**Architecture Overview:**
The system follows a modular "feature-first" approach. The logic of window management (**Niri**) is strictly separated from the visual representation (**Quickshell**).

**The Core: `lib/helper.nix`**
The entire system creation is driven by a powerful function library. Instead of manually importing modules, the helper uses dynamic directory scanning:
*   **Automatic Discovery:** All subfolders in `features/` are scanned. If the helper finds a `default.nix`, it is automatically included as a NixOS module.
*   **Two-Stage Metadata Loading:** In a first phase, only `metadata.nix` files are read to check dependencies before the actual build starts.
*   **Auto-Enablement:** Features can request other features (e.g., `desktop.niri` automatically requires `system.wayland`).

**Technology Stack:**
*   **Niri:** A Wayland compositor that arranges windows in an infinite horizontal scroll.
*   **Quickshell (QML/JS):** Enables hardware-accelerated UIs with Qt Quick.
*   **Home Manager:** Deeply integrated into the system build for seamless user config (Nixcord, Nixvim).

### 4. Implementation Highlights

**Intelligent Dependency Management:**
Within `lib/helper.nix`, a recursive resolver was implemented. It ensures that:
1.  All required dependencies of a feature are automatically enabled.
2.  Conflicts (e.g., two different bootloaders) are detected at evaluation time and aborted with a clear error message.
3.  Hardware-specific differences (AMD vs. Intel) are abstracted via a clean metadata mapping in the `hosts/` folders.

**Custom Desktop Shell:**
The shell was developed from scratch in QML. It communicates via IPC with system services:
*   **Audio & Brightness:** Custom OSDs (On-Screen Displays) that react to hardware events.
*   **App Launcher:** A performant, keyboard-driven launcher with integrated search.
*   **State Manager:** A central QML object that manages the status of all system components and distributes it to the UI components.

### 5. Results and Outlook

**Achieved Goals:**
My system is now fully declarative. I can bring new hardware into my exact desktop state with a single command (`nixos-rebuild switch --flake .#hostname`). The separation of logic and UI in Niri/Quickshell ensures unparalleled stability and flexibility.

**Next Steps:**
*   **Dynamic Theming:** Automatic color adjustment of the entire system (including QML shell and terminal) based on the chosen wallpaper.
*   **Global Search:** Extending the launcher with file content search and calculator functions directly in the QML interface.

### 6. Personal Growth and Lessons Learned

**Functional Programming in Nix:**
Developing `helper.nix` was a profound exercise in functional programming. Patterns like lazy evaluation, recursion over attribute sets, and handling string contexts were essential to maintain performance with a growing number of modules.

**Linux Desktop Engineering:**
Abandoning ready-made solutions (GNOME/KDE) forced me to understand the underlying protocols (Wayland, D-Bus, Pipewire) in detail. The insight into translating system events into a reactive UI has fundamentally changed my approach to software architecture.