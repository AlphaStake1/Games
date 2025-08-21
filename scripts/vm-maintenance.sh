#!/bin/bash

echo "=== VM Maintenance Script ==="
echo "Performing comprehensive cleanup..."

# 1. Clean package manager caches
echo "→ Cleaning package caches..."
pnpm store prune
npm cache clean --force 2>/dev/null

# 2. Clean temporary files
echo "→ Cleaning temp files..."
rm -rf /tmp/* 2>/dev/null
rm -rf ~/.cache/typescript/* 2>/dev/null
rm -rf ~/.cache/node/* 2>/dev/null

# 3. Clean build artifacts
echo "→ Cleaning build artifacts..."
cd /home/new-msi/workspace/fsq
rm -rf .next/cache 2>/dev/null
rm -rf out 2>/dev/null
rm -rf dist 2>/dev/null

# 4. Clean log files
echo "→ Cleaning old logs..."
find /home/new-msi/workspace/fsq/logs -type f -mtime +7 -delete 2>/dev/null
truncate -s 0 /home/new-msi/workspace/fsq/logs/*.log 2>/dev/null

# 5. Clean Docker if installed
if command -v docker &> /dev/null; then
    echo "→ Cleaning Docker..."
    docker system prune -f 2>/dev/null
fi

# 6. Clean journalctl logs
echo "→ Cleaning system logs..."
sudo journalctl --vacuum-time=2d 2>/dev/null

# 7. Display disk usage
echo ""
echo "=== Disk Usage After Cleanup ==="
df -h /
echo ""
echo "=== Memory Status ==="
free -h
echo ""
echo "Maintenance complete!"