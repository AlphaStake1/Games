#!/bin/bash

# Stop script for Next.js server and bore tunnel

LOG_DIR="/home/new-msi/workspace/fsq/logs"

echo "========================================="
echo "Stopping Football Squares Testing Server"
echo "========================================="

# Stop Next.js server
if [ -f "$LOG_DIR/nextjs.pid" ]; then
    NEXTJS_PID=$(cat "$LOG_DIR/nextjs.pid")
    if ps -p $NEXTJS_PID > /dev/null 2>&1; then
        echo "[$(date)] Stopping Next.js server (PID: $NEXTJS_PID)..."
        kill $NEXTJS_PID
        rm "$LOG_DIR/nextjs.pid"
        echo "[$(date)] Next.js server stopped"
    else
        echo "[$(date)] Next.js server not running"
        rm "$LOG_DIR/nextjs.pid"
    fi
else
    echo "[$(date)] No Next.js PID file found"
fi

# Stop bore tunnel
if [ -f "$LOG_DIR/bore.pid" ]; then
    BORE_PID=$(cat "$LOG_DIR/bore.pid")
    if ps -p $BORE_PID > /dev/null 2>&1; then
        echo "[$(date)] Stopping bore tunnel (PID: $BORE_PID)..."
        kill $BORE_PID
        rm "$LOG_DIR/bore.pid"
        echo "[$(date)] Bore tunnel stopped"
    else
        echo "[$(date)] Bore tunnel not running"
        rm "$LOG_DIR/bore.pid"
    fi
else
    echo "[$(date)] No bore PID file found"
fi

echo "[$(date)] All services stopped"