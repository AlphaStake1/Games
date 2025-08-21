#!/bin/bash

# Ngrok Tunnel Persistent Runner for FSQ Testing
# This script keeps the ngrok tunnel running for human testers

echo "Starting persistent ngrok tunnel for FSQ testing..."
echo ""
echo "Press Ctrl+C to stop the tunnel"
echo "----------------------------------------"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping ngrok tunnel..."
    exit 0
}

# Set up trap for clean exit
trap cleanup INT TERM

# Keep ngrok running with automatic restart if it fails
while true; do
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting ngrok tunnel..."
    ./ngrok http 3001
    
    # If ngrok exits, wait 5 seconds before restarting
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Ngrok tunnel stopped. Restarting in 5 seconds..."
    sleep 5
done
