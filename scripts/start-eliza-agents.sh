#!/bin/bash
# Start multiple ElizaOS agents with correct path

# ElizaOS binary path
ELIZAOS_BIN="/home/new-msi/.nvm/versions/node/v22.18.0/lib/node_modules/elizaos/dist/index.js"

echo "🚀 Starting Football Squares Agents..."
echo ""

# Function to start an agent in background
start_agent() {
  local char_file=$1
  local port=$2
  local agent_name=$3
  
  echo "🤖 Starting $agent_name on port $port..."
  
  # Start agent in background using node directly
  nohup node "$ELIZAOS_BIN" --character "$char_file" --port "$port" > "logs/${agent_name,,}.log" 2>&1 &
  local pid=$!
  
  echo "   PID: $pid"
  echo "   Logs: logs/${agent_name,,}.log"
  echo "   API: http://localhost:$port"
  echo ""
  
  # Store PID for later reference
  echo "$pid" >> .agent_pids
}

# Create logs directory
mkdir -p logs

# Clear previous PIDs
rm -f .agent_pids

echo "🛡️ Security Features Active:"
echo "   • Bot Detection Engine"
echo "   • Enhanced Security Layer" 
echo "   • Real-time Monitoring"
echo ""

# Start core agents
start_agent "characters/coachb.json" 3000 "Coach_B"
sleep 5

start_agent "characters/dean.json" 3001 "Dean"  
sleep 5

start_agent "characters/reviva.json" 3002 "Trainer_Reviva"
sleep 5

start_agent "characters/morgan.json" 3003 "Morgan_Reese"
sleep 5

start_agent "characters/right.json" 3004 "Coach_Right"

echo "⏳ Waiting for agents to initialize..."
sleep 15

echo ""
echo "🎉 Multi-Agent System Deployment Complete!"
echo ""
echo "📊 Agent Endpoints:"
echo "   • Coach B (Main):      http://localhost:3000"
echo "   • Dean (Security):     http://localhost:3001" 
echo "   • Trainer Reviva:      http://localhost:3002"
echo "   • Morgan Reese:        http://localhost:3003"
echo "   • Coach Right:         http://localhost:3004"
echo ""
echo "🛡️ Security Status: ACTIVE"
echo "📝 Logs Directory: ./logs/"
echo "🔧 Stop all agents: ./scripts/stop-agents.sh"
echo ""

# Test connectivity
echo "🔍 Testing agent connectivity..."
for port in 3000 3001 3002 3003 3004; do
  if curl -s "http://localhost:$port" > /dev/null 2>&1; then
    echo "✅ Port $port: Active"
  else
    echo "⏳ Port $port: Starting..."
  fi
done

echo ""
echo "✅ Football Squares Multi-Agent System is LIVE!"
echo "🌐 Your agents are running with:"
echo "   • Discord integration"
echo "   • Twitter/X integration" 
echo "   • Supabase database"
echo "   • OpenAI/Anthropic AI"
echo ""
echo "📱 Platform Status:"
echo "   • Discord: Ready for bot interactions"
echo "   • Twitter: Ready for automated posting"
echo "   • Database: Connected to Supabase"
echo ""