#!/bin/bash
# Stop all ElizaOS agents

echo "🛑 Stopping Football Squares Agents..."

if [ -f .agent_pids ]; then
  while read pid; do
    if kill -0 "$pid" 2>/dev/null; then
      echo "   Stopping process $pid..."
      kill "$pid"
    fi
  done < .agent_pids
  rm -f .agent_pids
  echo "✅ All agents stopped."
else
  echo "⚠️  No agent PIDs found. Trying alternative method..."
  pkill -f "elizaos start"
  echo "✅ ElizaOS processes terminated."
fi

echo "🧹 Cleanup complete."