#!/bin/bash

echo "=== VM Optimization Script ==="
echo "Reducing memory and CPU usage for development environment"

# 1. Kill unnecessary VS Code processes
echo "→ Cleaning up VS Code processes..."
pkill -f tsserver 2>/dev/null
pkill -f "json-language-features" 2>/dev/null
pkill -f "eslint-language-server" 2>/dev/null

# 2. Clear Node.js cache and temp files
echo "→ Clearing Node.js cache..."
rm -rf /tmp/v8-compile-cache-* 2>/dev/null
rm -rf /tmp/vscode-typescript* 2>/dev/null
rm -rf ~/.npm/_cacache/* 2>/dev/null

# 3. Clear pnpm cache if needed
echo "→ Clearing pnpm cache..."
pnpm store prune 2>/dev/null

# 4. Clear system cache
echo "→ Dropping system caches..."
sync
echo 3 | sudo tee /proc/sys/vm/drop_caches > /dev/null

# 5. Reduce swappiness for better performance
echo "→ Optimizing swap usage..."
sudo sysctl vm.swappiness=10

# 6. Kill zombie processes
echo "→ Cleaning zombie processes..."
ps aux | grep defunct | grep -v grep | awk '{print $2}' | xargs -r kill -9 2>/dev/null

# 7. Stop unnecessary services
echo "→ Stopping unnecessary services..."
systemctl --user stop evolution-addressbook-factory.service 2>/dev/null
systemctl --user stop evolution-calendar-factory.service 2>/dev/null
systemctl --user stop evolution-source-registry.service 2>/dev/null
systemctl --user stop tracker-miner-fs-3.service 2>/dev/null

# Show current memory status
echo ""
echo "=== Current Memory Status ==="
free -h
echo ""
echo "=== Top CPU Processes ==="
ps aux --sort=-%cpu | head -5