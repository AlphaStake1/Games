#!/bin/bash

# Low-resource development script for VM environment

echo "Starting development server with optimized settings..."

# Set Node.js memory limits
export NODE_OPTIONS="--max-old-space-size=2048 --max-semi-space-size=16"

# Disable Next.js telemetry
export NEXT_TELEMETRY_DISABLED=1

# Use fewer build workers
export NEXT_BUILD_WORKERS=2

# Disable source maps to save memory
export GENERATE_SOURCEMAP=false

# Start development server
echo "Starting Next.js with reduced memory footprint..."
pnpm run dev