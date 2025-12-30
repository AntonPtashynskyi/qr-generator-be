# ==============================================================================
# Multi-stage Dockerfile for Backend
# ==============================================================================
# Stage 1: Build - compiles TypeScript to JavaScript
# Stage 2: Production - runs compiled code (optimized, smaller image)
# Stage 3: Development - runs TypeScript directly with hot reload
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for building)
RUN npm install

# Copy source code
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production (default)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS production

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies (smaller image)
RUN npm install --omit=dev

# Expose port
EXPOSE 3000

# Run compiled JavaScript
CMD ["npm", "run", "start:prod"]

# ------------------------------------------------------------------------------
# Stage 3: Development (used by docker-compose.dev.yml)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for ts-node-dev)
RUN npm install

# Copy source code
COPY . .

# Build the application (so dist/ exists if needed)
RUN npm run build

# Expose port
EXPOSE 3000

# Run with ts-node-dev for hot reload
# This will be overridden by docker-compose.dev.yml command
CMD ["npm", "run", "dev"]
