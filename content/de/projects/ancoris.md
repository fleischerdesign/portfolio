---
slug: ancoris
locale: de
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
  - Netzwerk
  - Monitoring
  - Home Automation
image:
  src: /img/florian-krumm-yLDabpoCL3s-unsplash.jpg
  alt: "Ancoris-Netzwerkarchitektur"
title: "Ancoris – Mein privates Netzwerk"
subtitle: "Technische Dokumentation meiner Homelab-Infrastruktur: Drei Server mit Docker, Monitoring und Home Automation."
features:
  - Zentrale Authentifizierung via Authentik (SSO)
  - Echtzeit-Monitoring mit Prometheus/Grafana
  - Automatisierte Backups (BorgBackup)
  - Media- und Dokumentenmanagement (Plex, Paperless-ngx)
learned:
  - Orchestrierung von 20+ Docker-Containern
  - Reverse-Proxy-Konfiguration mit Caddy
  - Troubleshooting in verteilten Systemen (Loki-Logs)
challenges:
  - Sichere Freigabe von Diensten für Familie (Tailscale VPN)
  - Ressourcen-Management auf begrenzter Hardware
  - Automatisierte Updates ohne Downtime (Watchtower)
url:
  project: https://ancoris.ovh
  repository: https://github.com/.../ancoris-docker
---
## Übersicht  
Ancoris ist mein persönliches IT-Ökosystem, bestehend aus:  
- **1 V-Server** (öffentlich erreichbar, kritische Dienste)  
- **1 Heimserver** (Lokale Dienste + Home Automation)  
- **1 Familien-Server** (Home Assistant für Verwandte)  

Alle Server laufen unter Debian mit Docker-Containern, orchestriert über Portainer und Watchtower.  
Zentrale Komponenten: **Authentik für SSO**, **Caddy als Reverseproxy**, und ein **Monitoring-Stack** für Transparenz.  

---

## Technische Tiefe: Server & Dienste  

### 1. **V-Server (`igy.ancoris.ovh`)**  
**Rolle:** Public Gateway + Monitoring-Hub  

#### Kernkomponenten  
- **Authentik** (`auth.ancoris.ovh`):  
  - Verwaltet SSO für alle Dienste (OAuth2, LDAP-Integration).  
  - Sichere Anmeldung via WebAuthn (YubiKey) und TOTP.  
- **Caddy**:  
  - Automatisiertes TLS mit Let’s Encrypt für alle Subdomains.  
  - Rate-Limiting und Security-Header für öffentliche Dienste.  
- **Monitoring-Stack**:  
  - **Prometheus** + **Node Exporter**: Sammelt Metriken aller Server (CPU, RAM, Storage).  
  - **Grafana**: Dashboards für Echtzeit-Analysen ([Beispiel-Dashboard](/img/grafana-ancoris.png)).  
  - **Loki**: Zentralisierte Logs aller Container.  
- **Plausible Analytics**:  
  - Tracking für meine Webprojekte – ohne Cookies, DSGVO-konform.  

#### Weitere Dienste  
- **Uptime Kuma**: Überwacht Response Times und Downtimes (Ping, HTTP, TCP).  
- **FreshRSS**: Selbstgehosteter RSS-Reader mit Readarr-Integration.  
- **OpenWebUI**: Chat-Interface für lokale LLMs (z. B. Llama 3).  

---

### 2. **Heimserver (`fls.ancoris.ovh`)**  
**Rolle:** Medien, Automatisierung & Dokumente  

#### Home Automation  
- **Home Assistant**:  
  - Steuert 50+ Geräte (Lichter, Sensoren, Kameras) via Zigbee2MQTT.  
  - Automations wie „Licht bei Sonnenuntergang“ oder Heizungssteuerung.  
- **ESPHome**: Firmware für DIY-Smart-Home-Geräte (z. B. Temperatursensoren).  
- **Mosquitto MQTT**: Nachrichten-Broker für IoT-Kommunikation.  

#### Media & Dokumente  
- **Plex Media Server**:  
  - Automatisiertes Medienmanagement mit *Arr-Stack (Sonarr, Radarr, Prowlarr).  
  - Transcoding via Intel QuickSync (iGPU-Passthrough in Docker).  
- **Paperless-ngx**:  
  - Dokumenten-Archiv mit OCR (Scans werden per Script automatisch importiert).  
- **Mealie**: Rezeptdatenbank mit Meal-Planner.  

#### 3D-Druck-Stack  
- **Klipper** + **Mainsail**:  
  - Hochpräzise Drucksteuerung auf meinem Ender 3 V2.  
  - G-Code-Optimierungen für schnellere Drucke.  

---

### 3. **Familien-Server**  
- **Home Assistant**:  
  - Vereinfachte UI für Familienmitglieder (z. B. Lichtsteuerung, Wetterwarnungen).  
  - Kein direkter Zugriff von extern – nur via Tailscale VPN.  

---

## Sicherheit & Wartung  
- **Zero Trust Ansatz**:  
  - Jeder Dienst ist per Authentik abgesichert, öffentliche Dienste mit Fail2ban.  
  - Regelmäßige Backups (BorgBackup) auf externen NAS.  
- **Automatisierung**:  
  - Watchtower aktualisiert Container automatisch (außer bei kritischen Diensten).  
  - CI/CD-Pipelines (via GitHub Actions) für mein Portfolio-Update.  

---

## Warum dieses Projekt?  
Ancoris ist mehr als nur „Dienste hosten“ – es ist mein **Lernfeld für DevOps-Praktiken**:  
- **Infrastructure-as-Code**: Docker-Compose-Dateien sind versioniert und dokumentiert.  
- **Problem-Solving**: Fehlersuche in verteilten Systemen (z. B. Prometheus-Alerts).  
- **Enabler für Familie**: Selfhosting als Privatsphäre-Alternative zu Google & Co.  

🔗 **GitHub-Repo**: [ancoris-docker](https://github.com/...) 

---

## Zukünftige Pläne  
- **Kubernetes-Migration**: Ersetzen von Docker-Compose durch k3s.  
- **Temporal**: Workflow-Automatisierung für wiederkehrende Tasks.  
- **Immich**: Google Photos-Alternative für Familien-Backups.  

---

## Screenshots & Diagramme  
![Netzwerk-Architektur](/img/ancoris-diagram.png) *Vereinfachte Übersicht der Dienste*  
![Grafana-Dashboard](/img/grafana-overview.png) *Live-Metriken der Server*  