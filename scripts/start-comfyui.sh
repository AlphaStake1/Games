#!/bin/bash

# Start ComfyUI API server for FSQ project

echo "🚀 Starting ComfyUI API server..."
echo "   URL: http://localhost:8188"
echo "   API: http://localhost:8188/api"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd ~/workspace/comfyui
source venv/bin/activate

# Start with API enabled and listen on all interfaces
# ComfyUI API is always enabled by default
python main.py --listen 0.0.0.0 --port 8188 --cpu
