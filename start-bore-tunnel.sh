#!/bin/bash

# Bore Tunnel Persistent Runner for FSQ Testing
# This script keeps the bore tunnel running for human testers

echo "Starting persistent bore tunnel for FSQ testing..."
echo "Public URL: http://bore.pub:1143"
echo "Testing page: http://bore.pub:1143/testing"
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo "----------------------------------------"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping bore tunnel..."
    exit 0
}

# Set up trap for clean exit
trap cleanup INT TERM

# Keep bore running with automatic restart if it fails
while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting bore tunnel..."
    ./bore local 3000 --to bore.pub --port 1143
    
    # If bore exits, wait 5 seconds before restarting
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Bore tunnel stopped. Restarting in 5 seconds..."
    sleep 5
done