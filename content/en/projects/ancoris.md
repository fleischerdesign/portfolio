---
slug: ancoris
locale: en
date: 2024-04-02
published: true
category: Administration
techstack:
  - Linux
  - Docker
  - Caddy
  - Authentik
  - Grafana
  - Home Assistant
  - Loki
  - Prometheus
  - Crowdsec
tags:
  - Homelab
  - Network
  - Monitoring
  - Home Automation
image:
  src: /img/florian-krumm-yLDabpoCL3s-unsplash.jpg
  alt: "Ancoris Network Architecture"
title: "Ancoris – My Private Network"
subtitle: "Technical documentation of my Homelab infrastructure: Three servers with Docker, monitoring, and home automation."
features:
  - Central authentication via Authentik (SSO)
  - Real-time monitoring with Prometheus/Grafana
  - Automated backups (BorgBackup)
  - Media and document management (Plex, Paperless-ngx)
learned:
  - Orchestration of 20+ Docker containers
  - Reverse proxy configuration with Caddy
  - Troubleshooting in distributed systems (Loki logs)
challenges:
  - Secure sharing of services for family (Tailscale VPN)
  - Resource management on limited hardware
  - Automated updates without downtime (Watchtower)
url:
  project: https://ancoris.ovh
  repository: https://github.com/.../ancoris-docker
---
## Overview  
Ancoris is my personal IT ecosystem, consisting of:  
- **1 V-Server** (publicly accessible, critical services)  
- **1 Home Server** (local services + home automation)  
- **1 Family Server** (Home Assistant for relatives)  

All servers run on Debian with Docker containers, orchestrated via Portainer and Watchtower.  
Central components: **Authentik for SSO**, **Caddy as reverse proxy**, and a **monitoring stack** for transparency.  

---

## Technical Depth: Servers & Services  

### 1. **V-Server (`igy.ancoris.ovh`)**  
**Role:** Public Gateway + Monitoring Hub  

#### Core Components  
- **Authentik** (`auth.ancoris.ovh`):  
  - Manages SSO for all services (OAuth2, LDAP integration).  
  - Secure login via WebAuthn (YubiKey) and TOTP.  
- **Caddy**:  
  - Automated TLS with Let’s Encrypt for all subdomains.  
  - Rate limiting and security headers for public services.  
- **Monitoring Stack**:  
  - **Prometheus** + **Node Exporter**: Collects metrics from all servers (CPU, RAM, storage).  
  - **Grafana**: Dashboards for real-time analysis ([Example Dashboard](/img/grafana-ancoris.png)).  
  - **Loki**: Centralized logs of all containers.  
- **Plausible Analytics**:  
  - Tracking for my web projects – cookie-free, GDPR-compliant.  

#### Additional Services  
- **Uptime Kuma**: Monitors response times and downtimes (Ping, HTTP, TCP).  
- **FreshRSS**: Self-hosted RSS reader with Readarr integration.  
- **OpenWebUI**: Chat interface for local LLMs (e.g., Llama 3).  

---

### 2. **Home Server (`fls.ancoris.ovh`)**  
**Role:** Media, Automation & Documents  

#### Home Automation  
- **Home Assistant**:  
  - Controls 50+ devices (lights, sensors, cameras) via Zigbee2MQTT.  
  - Automations like "lights at sunset" or heating control.  
- **ESPHome**: Firmware for DIY smart home devices (e.g., temperature sensors).  
- **Mosquitto MQTT**: Message broker for IoT communication.  

#### Media & Documents  
- **Plex Media Server**:  
  - Automated media management with *Arr-Stack (Sonarr, Radarr, Prowlarr).  
  - Transcoding via Intel QuickSync (iGPU passthrough in Docker).  
- **Paperless-ngx**:  
  - Document archive with OCR (scans automatically imported via script).  
- **Mealie**: Recipe database with meal planner.  

#### 3D Printing Stack  
- **Klipper** + **Mainsail**:  
  - High-precision printing control on my Ender 3 V2.  
  - G-code optimizations for faster prints.  

---

### 3. **Family Server**  
- **Home Assistant**:  
  - Simplified UI for family members (e.g., light control, weather alerts).  
  - No direct external access – only via Tailscale VPN.  

---

## Security & Maintenance  
- **Zero Trust Approach**:  
  - Each service secured via Authentik, public services protected with Fail2ban.  
  - Regular backups (BorgBackup) to external NAS.  
- **Automation**:  
  - Watchtower updates containers automatically (except for critical services).  
  - CI/CD pipelines (via GitHub Actions) for my portfolio updates.  

---

## Why this project?  
Ancoris is more than just "hosting services" – it is my **learning environment for DevOps practices**:  
- **Infrastructure-as-Code**: Docker Compose files are versioned and documented.  
- **Problem-solving**: Troubleshooting in distributed systems (e.g., Prometheus alerts).  
- **Enabler for family**: Self-hosting as a privacy alternative to Google & Co.  

🔗 **GitHub Repo**: [ancoris-docker](https://github.com/...)  

---

## Future Plans  
- **Kubernetes migration**: Replacing Docker Compose with k3s.  
- **Temporal**: Workflow automation for recurring tasks.  
- **Immich**: Google Photos alternative for family backups.  

---

## Screenshots & Diagrams  
![Network Architecture](/img/ancoris-diagram.png) *Simplified overview of services*  
![Grafana Dashboard](/img/grafana.jpg) *Live metrics of servers*