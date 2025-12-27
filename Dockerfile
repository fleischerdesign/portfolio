#syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

ARG CACHEBUST=1

WORKDIR /app
COPY package.json package-lock.json ./
# Install all dependencies, including devDependencies, required for the build
RUN npm ci --prefer-offline --audit=false

# Copy the rest of the source code
COPY . .

RUN --mount=type=secret,id=GITHUB_APPLICATIONS_REPO_TOKEN \
    export GITHUB_APPLICATIONS_REPO_TOKEN=$(cat /run/secrets/GITHUB_APPLICATIONS_REPO_TOKEN) && \
    echo "Build time: $(date)" && \
    echo "Cache buster: $CACHEBUST" && \
    # Build the application
    npm run build

# --- Final Stage ---
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache dumb-init curl chromium && \
    chmod +x /usr/bin/chromium-browser && \
    adduser -D app && \
    mkdir -p /app/data && \
    chown -R app:app /app /app/data
USER app

# Copy package files and install production-only dependencies
COPY --from=builder --chown=app:app /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev --prefer-offline --audit=false

# Copy the built application output and necessary migration files
COPY --from=builder --chown=app:app /app/.output ./
COPY --from=builder --chown=app:app /app/server/db/migrations ./server/db/migrations


ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    BROWSER_BIN=/usr/bin/chromium-browser
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD curl -fs http://localhost:3000/api/health | grep -q '"status":"ok"' || exit 1

ENTRYPOINT ["dumb-init"]
CMD ["node", "/app/server/index.mjs"]