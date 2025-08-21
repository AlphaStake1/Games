#!/bin/bash

# Start script for persistent Next.js server and bore tunnel
# This script ensures both services stay running continuously

LOG_DIR="/home/new-msi/workspace/fsq/logs"
mkdir -p "$LOG_DIR"

# Function to start Next.js server
start_nextjs() {
    echo "[$(date)] Starting Next.js server on port 3001..."
    cd /home/new-msi/workspace/fsq
    pnpm run dev > "$LOG_DIR/nextjs.log" 2>&1 &
    NEXTJS_PID=$!
    echo $NEXTJS_PID > "$LOG_DIR/nextjs.pid"
    echo "[$(date)] Next.js server started with PID: $NEXTJS_PID"
}

# Function to start bore tunnel
start_bore() {
    echo "[$(date)] Starting bore tunnel to expose port 3001..."
    cd /home/new-msi/workspace/fsq
    ./bore local 3001 --to bore.pub --port 1143 > "$LOG_DIR/bore.log" 2>&1 &
    BORE_PID=$!
    echo $BORE_PID > "$LOG_DIR/bore.pid"
    echo "[$(date)] Bore tunnel started with PID: $BORE_PID"
}

# Check if processes are already running
check_running() {
    if [ -f "$LOG_DIR/nextjs.pid" ]; then
        NEXTJS_PID=$(cat "$LOG_DIR/nextjs.pid")
        if ps -p $NEXTJS_PID > /dev/null 2>&1; then
            echo "[$(date)] Next.js server already running with PID: $NEXTJS_PID"
        else
            start_nextjs
        fi
    else
        start_nextjs
    fi

    # Wait for Next.js to be ready
    echo "[$(date)] Waiting for Next.js to be ready..."
    sleep 10

    if [ -f "$LOG_DIR/bore.pid" ]; then
        BORE_PID=$(cat "$LOG_DIR/bore.pid")
        if ps -p $BORE_PID > /dev/null 2>&1; then
            echo "[$(date)] Bore tunnel already running with PID: $BORE_PID"
        else
            start_bore
        fi
    else
        start_bore
    fi
}

# Main execution
echo "========================================="
echo "Starting Football Squares Testing Server"
echo "========================================="
echo "[$(date)] Starting services..."

check_running

echo ""
echo "Services started successfully!"
echo "Access the application at: http://bore.pub:1143/"
echo "Testing page: http://bore.pub:1143/testing/"
echo ""
echo "Logs are available at:"
echo "  - Next.js: $LOG_DIR/nextjs.log"
echo "  - Bore: $LOG_DIR/bore.log"
echo ""
echo "To stop services, run: ./scripts/stop-server.sh"