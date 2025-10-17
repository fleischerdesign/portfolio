---
slug: nixfiles
locale: en
date: 2023-12-28
published: true
category: System Administration
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
  - Configuration Management
  - Dotfiles
image:
  src: /img/lukas-DTochqoK3Rg-unsplash.jpg
  alt: "NixOS Setup"
title: "Nixfiles – My Dotfiles"
subtitle: "My personal NixOS and Home Manager configuration, managed with Nix Flakes for a reproducible and modular system environment."
features:
  - Declarative system configuration with NixOS
  - Custom GNOME desktop environment
  - Development environment with NixVim and VS Codium
  - Gaming setup with Steam, Lutris, and Sunshine
  - Automated module detection and system creation
learned:
  - Deep understanding of Nix and the Flake system
  - Creation of reusable NixOS modules
  - Automation of configuration workflows
  - Customization and extension of Nixpkgs through overlays
challenges:
  - Management of system-specific hardware configurations (AMD vs. Intel)
  - Ensuring compatibility of GNOME extensions
  - Creation of custom packages for specific applications
url:
  repository: https://github.com/fleischerdesign/nixfiles
---
## Overview
This project contains my personal NixOS and Home Manager configurations, managed with Nix Flakes. The goal is a highly modular and automated environment that allows me to manage my systems "yorke" (AMD) and "jello" (Intel) consistently and reproducibly. The configuration is structured to be easily adaptable and extensible while providing a robust and stable foundation for my daily work and leisure.

---

## Technical Details

### Project Structure
The configuration is divided into several logical directories to maximize modularity and maintainability:
- **`flake.nix`**: The main entry point that includes all necessary inputs such as `nixpkgs`, `home-manager`, and other dependencies. It defines the system builds and available configurations.
- **`lib/helper.nix`**: The core of automation. This library contains functions for dynamically creating systems (`mkSystem`), automatically detecting modules (generates `my.nixos.<module>.enable` options), and managing Home Manager configurations in different layers.
- **`hosts/`**: Contains all machine-specific configurations. A `base.nix` defines the basic settings for all hosts, while separate directories for `yorke` (AMD system) and `jello` (Intel system) contain hardware-specific adjustments.
- **`home-manager/`**: Manages Home Manager configurations. `default/` contains general settings applicable to all users, while `philipp/` contains my personal, user-specific setups.
- **`modules/nixos/`**: A collection of reusable NixOS modules that encapsulate specific functionalities, e.g., for the bootloader, audio (Pipewire), desktop environment (GNOME), or gaming setup.
- **`overlays/`**: Nixpkgs overlays are used to customize or patch existing packages. An example is the overlay for the German localization of the `pip-on-top` GNOME extension.
- **`packages/`**: Contains definitions for custom packages not included in the official `nixpkgs`, such as `ficsit` (Satisfactory Mod Manager), `karere` (a simple RSS reader), and `lychee-slicer`.

### Configuration Highlights
- **Desktop Environment**: A heavily customized GNOME environment focused on productivity and aesthetics. Extensions include `blur-my-shell` for visual effects, `gsconnect` for mobile device integration, `dash-to-dock` for improved navigation, and `paperwm` for a tiling window management experience.
- **Development**: A development environment tailored to my needs. `NixVim` (a Neovim distribution configured with Nix) and `VS Codium` are preconfigured as primary editors. The Fish shell combined with `direnv` enables seamless management of project-specific environment variables and dependencies.
- **Gaming**: An optimized setup for gaming on Linux. `Steam` and `Lutris` are installed for access to a wide range of games. `Sunshine` is used as a game streaming host to stream games to other devices on the home network.
- **Automation**: The `lib/helper.nix` library automates the detection and inclusion of modules, significantly simplifying maintenance. New modules in the `modules` directory are automatically made available as options without requiring manual changes to the main configuration.

---

## Installation and Usage
The configuration can be easily applied to a new NixOS system by cloning the repository and running the following command:
```bash
sudo nixos-rebuild switch --flake .#<hostname>
```
Here, `<hostname>` must be replaced with the name of the target system (e.g., `yorke` or `jello`). The Home Manager configuration is automatically deployed along with it.

---

## Why This Project?
Managing my system configurations with Nix and Flakes offers me several key advantages:
- **Reproducibility**: I can restore my systems to an exact, defined state at any time. This eliminates configuration drift and simplifies recovery after a system failure.
- **Modularity**: By dividing the configuration into modules, I can easily share, reuse, and adapt configurations between my systems without duplicating code.
- **Automation**: The `helper.nix` library significantly reduces the manual effort involved in managing modules and systems, making the configuration more scalable.
- **Learning Platform**: This project is my personal learning platform to dive deeper into the world of Nix, functional programming, and declarative system configuration.

🔗 **GitHub Repo**: [fleischerdesign/nixfiles](https://github.com/fleischerdesign/nixfiles)