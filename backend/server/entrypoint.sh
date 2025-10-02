#!/bin/sh
set -e

# Generate Prisma client (safe if already generated)
prisma generate || true

# Apply migrations in production (idempotent)
prisma migrate deploy || true

# Start PM2 in cluster mode
exec pm2-runtime ecosystem.config.cjs



