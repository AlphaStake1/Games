#!/bin/bash

# Monitor script that ensures services stay running
# Run this with nohup or in a screen/tmux session

LOG_DIR="/home/new-msi/workspace/fsq/logs"
mkdir -p "$LOG_DIR"

MONITOR_LOG="$LOG_DIR/monitor.log"
CHECK_INTERVAL=60  # Check every 60 seconds

echo "[$(date)] Starting server monitor..." | tee -a "$MONITOR_LOG"

# Function to check and restart Next.js if needed
check_nextjs() {
    if [ -f "$LOG_DIR/nextjs.pid" ]; then
        NEXTJS_PID=$(cat "$LOG_DIR/nextjs.pid")
        if ! ps -p $NEXTJS_PID > /dev/null 2>&1; then
            echo "[$(date)] Next.js server crashed, restarting..." | tee -a "$MONITOR_LOG"
            cd /home/new-msi/workspace/fsq
            pnpm run dev > "$LOG_DIR/nextjs.log" 2>&1 &
            NEXTJS_PID=$!
            echo $NEXTJS_PID > "$LOG_DIR/nextjs.pid"
            echo "[$(date)] Next.js restarted with PID: $NEXTJS_PID" | tee -a "$MONITOR_LOG"
            return 1
        fi
    else
        echo "[$(date)] Next.js PID file missing, starting server..." | tee -a "$MONITOR_LOG"
        cd /home/new-msi/workspace/fsq
        pnpm run dev > "$LOG_DIR/nextjs.log" 2>&1 &
        NEXTJS_PID=$!
        echo $NEXTJS_PID > "$LOG_DIR/nextjs.pid"
        echo "[$(date)] Next.js started with PID: $NEXTJS_PID" | tee -a "$MONITOR_LOG"
        return 1
    fi
    return 0
}

# Function to check and restart bore if needed
check_bore() {
    if [ -f "$LOG_DIR/bore.pid" ]; then
        BORE_PID=$(cat "$LOG_DIR/bore.pid")
        if ! ps -p $BORE_PID > /dev/null 2>&1; then
            echo "[$(date)] Bore tunnel crashed, restarting..." | tee -a "$MONITOR_LOG"
            cd /home/new-msi/workspace/fsq
            ./bore local 3001 --to bore.pub --port 1143 > "$LOG_DIR/bore.log" 2>&1 &
            BORE_PID=$!
            echo $BORE_PID > "$LOG_DIR/bore.pid"
            echo "[$(date)] Bore restarted with PID: $BORE_PID" | tee -a "$MONITOR_LOG"
            return 1
        fi
    else
        echo "[$(date)] Bore PID file missing, starting tunnel..." | tee -a "$MONITOR_LOG"
        cd /home/new-msi/workspace/fsq
        ./bore local 3001 --to bore.pub --port 1143 > "$LOG_DIR/bore.log" 2>&1 &
        BORE_PID=$!
        echo $BORE_PID > "$LOG_DIR/bore.pid"
        echo "[$(date)] Bore started with PID: $BORE_PID" | tee -a "$MONITOR_LOG"
        return 1
    fi
    return 0
}

# Initial startup
echo "[$(date)] Initial service check..." | tee -a "$MONITOR_LOG"
check_nextjs
sleep 10  # Wait for Next.js to be ready
check_bore

# Monitor loop
while true; do
    sleep $CHECK_INTERVAL
    
    check_nextjs
    nextjs_restarted=$?
    
    if [ $nextjs_restarted -eq 1 ]; then
        sleep 10  # If Next.js was restarted, wait before checking bore
    fi
    
    check_bore
done