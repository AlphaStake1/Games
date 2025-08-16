#!/bin/bash

# ComfyUI Setup Script for FSQ Project
# This script installs and configures ComfyUI with API enabled

set -e

COMFYUI_DIR="$HOME/workspace/comfyui"
FSQ_DIR="$HOME/workspace/fsq"

echo "🎨 Setting up ComfyUI for FSQ image generation..."

# Check if ComfyUI directory exists
if [ ! -d "$COMFYUI_DIR" ]; then
    echo "📦 Cloning ComfyUI repository..."
    cd "$HOME/workspace"
    git clone https://github.com/comfyanonymous/ComfyUI.git comfyui
    cd "$COMFYUI_DIR"
else
    echo "✅ ComfyUI directory already exists"
    cd "$COMFYUI_DIR"
    git pull
fi

# Create Python virtual environment
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install/upgrade dependencies
echo "📚 Installing ComfyUI dependencies..."
pip install --upgrade pip
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install -r requirements.txt

# Install additional custom nodes for better workflows
echo "🔧 Installing essential custom nodes..."
cd custom_nodes

# ComfyUI Manager (essential for managing other nodes)
if [ ! -d "ComfyUI-Manager" ]; then
    git clone https://github.com/ltdrdata/ComfyUI-Manager.git
fi

# ControlNet Preprocessors
if [ ! -d "comfyui_controlnet_aux" ]; then
    git clone https://github.com/Fannovel16/comfyui_controlnet_aux.git
    cd comfyui_controlnet_aux
    pip install -r requirements.txt
    cd ..
fi

# Efficiency Nodes (for better workflow organization)
if [ ! -d "efficiency-nodes-comfyui" ]; then
    git clone https://github.com/jags111/efficiency-nodes-comfyui.git
fi

cd "$COMFYUI_DIR"

# Create models directory structure
echo "📁 Setting up model directories..."
mkdir -p models/checkpoints
mkdir -p models/loras
mkdir -p models/vae
mkdir -p models/controlnet
mkdir -p models/upscale_models

# Download a base model (SDXL as example - you can change this)
echo "🎨 Downloading base models (this may take a while)..."
if [ ! -f "models/checkpoints/sd_xl_base_1.0.safetensors" ]; then
    echo "Downloading SDXL base model..."
    wget -c https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors \
         -P models/checkpoints/
fi

# Create ComfyUI API wrapper service file
echo "🚀 Creating systemd service for ComfyUI API..."
cat > "$FSQ_DIR/scripts/comfyui.service" << 'EOF'
[Unit]
Description=ComfyUI API Server for FSQ
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/home/$USER/workspace/comfyui
Environment="PATH=/home/$USER/workspace/comfyui/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/home/$USER/workspace/comfyui/venv/bin/python main.py --listen 0.0.0.0 --port 8188 --api
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "✅ ComfyUI setup complete!"
echo ""
echo "To start ComfyUI:"
echo "  cd $COMFYUI_DIR"
echo "  source venv/bin/activate"
echo "  python main.py --listen 0.0.0.0 --port 8188 --api"
echo ""
echo "Or install as a service:"
echo "  sudo cp $FSQ_DIR/scripts/comfyui.service /etc/systemd/system/"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable comfyui"
echo "  sudo systemctl start comfyui"