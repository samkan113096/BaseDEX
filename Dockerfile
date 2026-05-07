# Root-level Dockerfile — builds the backend service only
# Railway will use this automatically when deploying from repo root

FROM node:20-alpine AS builder
WORKDIR /app

# Copy backend package files and install
COPY backend/package*.json ./
RUN npm ci

# Copy backend source and build
COPY backend/ ./
RUN npm run build

# ── Production image ─────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3001
CMD ["node", "dist/index.js"]
