# docker/app.Dockerfile
FROM node:18-alpine AS builder

# Install system dependencies
RUN apk add --no-cache python3 make g++ curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Install Rust and Anchor for smart contract building
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Anchor CLI
RUN cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Build Anchor program
RUN anchor build

# Production image
FROM node:18-alpine AS runner

# Install system dependencies
RUN apk add --no-cache curl bash

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/out ./out
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/target ./target

# Copy agent files
COPY --from=builder /app/agents ./agents
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts

# Create data directory
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Switch to app user
USER nextjs

# Expose ports
EXPOSE 3000 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start script
COPY --from=builder /app/docker/start.sh ./start.sh
RUN chmod +x ./start.sh

CMD ["./start.sh"]