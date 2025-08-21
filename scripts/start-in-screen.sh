#!/bin/bash

# Start server in screen sessions for persistence

echo "Starting Football Squares in screen sessions..."

# Kill any existing screen sessions
screen -S nextjs -X quit 2>/dev/null
screen -S bore -X quit 2>/dev/null

# Start Next.js in a screen session
echo "Starting Next.js server in screen..."
screen -dmS nextjs bash -c "cd /home/new-msi/workspace/fsq && pnpm run dev"

# Wait for Next.js to start
echo "Waiting for Next.js to be ready..."
sleep 15

# Start bore tunnel in a screen session  
echo "Starting bore tunnel in screen..."
screen -dmS bore bash -c "cd /home/new-msi/workspace/fsq && ./bore local 3001 --to bore.pub --port 1143"

echo ""
echo "========================================="
echo "Services started in screen sessions!"
echo "========================================="
echo ""
echo "Access the application at: http://bore.pub:1143/"
echo "Testing page: http://bore.pub:1143/testing/"
echo ""
echo "Screen commands:"
echo "  - List sessions: screen -ls"
echo "  - Attach to Next.js: screen -r nextjs"
echo "  - Attach to bore: screen -r bore"
echo "  - Detach from screen: Ctrl+A then D"
echo ""
echo "To stop services:"
echo "  - screen -S nextjs -X quit"
echo "  - screen -S bore -X quit"