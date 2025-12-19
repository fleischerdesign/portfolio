#syntax=docker/dockerfile:1
FROM node:20-alpine AS builder

# Cache busting mit Build-Argumenten
ARG CACHEBUST=1

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --prefer-offline --audit=false

COPY . .

RUN --mount=type=secret,id=GITHUB_APPLICATIONS_REPO_TOKEN \
    export GITHUB_APPLICATIONS_REPO_TOKEN=$(cat /run/secrets/GITHUB_APPLICATIONS_REPO_TOKEN) && \
    echo "Build time: $(date)" && \
    echo "Cache buster: $CACHEBUST" && \
    npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache dumb-init curl && \
    adduser -D app && \
    chown -R app:app /app
USER app

COPY --from=builder --chown=app:app /app/.output ./
COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/server/db/migrations ./migrations


ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD curl -fs http://localhost:3000/api/health | grep -q '"status":"ok"' || exit 1

ENTRYPOINT ["dumb-init"]
CMD ["node", "/app/server/index.mjs"]