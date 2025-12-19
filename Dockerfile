#syntax=docker/dockerfile:1
# ---- Builder Stage ----
FROM node:20-alpine AS builder

# Cache busting mit Build-Argumenten
ARG CACHEBUST=1

# 1. Cache-Layer für Abhängigkeiten
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --prefer-offline --audit=false

# 2. Copy source mit Cache-Busting
COPY . .

# Print build info to bust cache
RUN --mount=type=secret,id=GITHUB_APPLICATIONS_REPO_TOKEN \
    export GITHUB_APPLICATIONS_REPO_TOKEN=$(cat /run/secrets/GITHUB_APPLICATIONS_REPO_TOKEN) && \
    echo "Build time: $(date)" && \
    echo "Cache buster: $CACHEBUST" && \
    npm run build

# ---- Production Stage ----
FROM node:20-alpine

# 3. Sicherheit & Minimal-Image
WORKDIR /app
RUN apk add --no-cache dumb-init curl && \
    adduser -D app && \
    chown -R app:app /app
USER app

# 4. Data-Verzeichnis als app user erstellen


# 4. Nur notwendige Artefakte kopieren
COPY --from=builder --chown=app:app /app/.output ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./package.json

# 5. Runtime-Konfiguration
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
EXPOSE 3000

# 6. Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD curl -fs http://localhost:3000/api/health | grep -q '"status":"ok"' || exit 1

# 7. Optimierte Container-Initialisierung
ENTRYPOINT ["dumb-init"]
CMD ["npm", "run", "start:prod"]