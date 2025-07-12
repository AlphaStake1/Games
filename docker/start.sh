#!/bin/bash
# docker/start.sh

set -e

echo "Starting Football Squares Application..."

# Wait for dependencies
echo "Waiting for dependencies..."
until curl -f http://solana-validator:8899/health > /dev/null 2>&1; do
    echo "Waiting for Solana validator..."
    sleep 5
done

until curl -f http://proton-bridge:1025 > /dev/null 2>&1; do
    echo "Waiting for Proton Bridge..."
    sleep 5
done

echo "Dependencies are ready!"

# Start WebSocket server in background
echo "Starting WebSocket server..."
node server/websocket.js &
WS_PID=$!

# Start agent runner in background
echo "Starting agent runner..."
node scripts/run-agents.js &
AGENT_PID=$!

# Start Next.js application
echo "Starting Next.js application..."
npm start &
APP_PID=$!

# Function to handle shutdown
cleanup() {
    echo "Shutting down services..."
    kill $WS_PID $AGENT_PID $APP_PID 2>/dev/null || true
    wait $WS_PID $AGENT_PID $APP_PID 2>/dev/null || true
    echo "Services stopped."
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Wait for all processes
wait $WS_PID $AGENT_PID $APP_PID