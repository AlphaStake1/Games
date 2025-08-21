#!/bin/bash
# VM Performance Cleanup Script for FSQ
# Run weekly or when VM performance degrades

echo "🧹 FSQ VM Performance Cleanup"
echo "=============================="
echo ""

# Store initial disk usage
INITIAL=$(df / | grep '/' | awk '{print $5}' | sed 's/%//')
echo "Initial disk usage: ${INITIAL}%"
echo ""

# 1. Clean Next.js artifacts
echo "[1/8] Cleaning Next.js build cache..."
rm -rf .next out
echo "✓ Next.js cleaned"

# 2. Clean Rust build artifacts
echo "[2/8] Cleaning Rust build artifacts..."
(cd programs/squares && cargo clean 2>/dev/null) || true
echo "✓ Rust artifacts cleaned"

# 3. Clean large log files
echo "[3/8] Cleaning log files >10MB..."
find logs -name "*.log" -size +10M -delete 2>/dev/null
rm -f ngrok*.log server.log *.pid 2>/dev/null
echo "✓ Logs cleaned"

# 4. Clean Python cache
echo "[4/8] Cleaning Python cache..."
find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
find . -name "*.pyc" -delete 2>/dev/null
echo "✓ Python cache cleaned"

# 5. Clean node_modules cache
echo "[5/8] Optimizing node_modules..."
rm -rf node_modules/.cache 2>/dev/null
pnpm store prune 2>/dev/null
echo "✓ Node modules optimized"

# 6. Clean unnecessary downloads
echo "[6/8] Removing downloaded packages..."
rm -f *.deb *.AppImage *.tar.gz 2>/dev/null
echo "✓ Downloads cleaned"

# 7. Docker cleanup (if available)
echo "[7/8] Cleaning Docker..."
if command -v docker &> /dev/null; then
    docker system prune -f 2>/dev/null
    echo "✓ Docker cleaned"
else
    echo "⚠ Docker not found, skipping"
fi

# 8. Git optimization (quick version)
echo "[8/8] Optimizing git..."
git gc --quiet 2>/dev/null || true
echo "✓ Git optimized"

# Show results
echo ""
echo "=============================="
FINAL=$(df / | grep '/' | awk '{print $5}' | sed 's/%//')
SAVED=$((INITIAL - FINAL))
echo "✅ Cleanup complete!"
echo "Initial usage: ${INITIAL}%"
echo "Final usage: ${FINAL}%"
echo "Space saved: ${SAVED}%"
echo ""

# Memory optimization tips
echo "💡 Additional VM Performance Tips:"
echo "  • Close unused VS Code windows"
echo "  • Restart VS Code if using >3GB RAM"
echo "  • Run 'free -h' to check memory usage"
echo "  • Consider increasing VM RAM in VirtualBox settings"