#!/bin/bash

# Download better models for ComfyUI NFT generation
# This script downloads higher quality models suitable for NFT artwork

set -e

COMFYUI_DIR="$HOME/workspace/comfyui"
cd "$COMFYUI_DIR"

echo "🎨 Setting up better models for NFT generation..."

# Create model directories
mkdir -p models/checkpoints
mkdir -p models/loras
mkdir -p models/vae
mkdir -p models/upscale_models

echo "📥 Downloading better models (this will take some time)..."

# 1. SDXL Base Model (better quality than SD 1.5)
if [ ! -f "models/checkpoints/sd_xl_base_1.0.safetensors" ]; then
    echo "Downloading SDXL Base 1.0 (6.9GB)..."
    wget -c https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors \
         -P models/checkpoints/
fi

# 2. SDXL VAE (better image quality)
if [ ! -f "models/vae/sdxl_vae.safetensors" ]; then
    echo "Downloading SDXL VAE..."
    wget -c https://huggingface.co/stabilityai/sdxl-vae/resolve/main/sdxl_vae.safetensors \
         -P models/vae/
fi

# 3. Upscaler for better final quality
if [ ! -f "models/upscale_models/RealESRGAN_x4plus.pth" ]; then
    echo "Downloading RealESRGAN upscaler..."
    wget -c https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth \
         -P models/upscale_models/
fi

# 4. LoRA models for specific styles
echo "📦 Downloading style-specific LoRA models..."

# Comic book style LoRA
if [ ! -f "models/loras/comic_book_style.safetensors" ]; then
    echo "Downloading comic book LoRA..."
    # Note: Replace with actual LoRA URLs when available
    # wget -c [COMIC_BOOK_LORA_URL] -P models/loras/
    touch models/loras/comic_book_style.safetensors  # Placeholder
fi

# Alternative: Download popular community models
echo "🔍 Alternative model suggestions:"
echo ""
echo "High-Quality SDXL Models for NFTs:"
echo "1. Juggernaut XL - https://civitai.com/models/133005"
echo "2. RealVisXL - https://civitai.com/models/139562"
echo "3. DreamShaper XL - https://civitai.com/models/112902"
echo ""
echo "Style-Specific LoRAs:"
echo "1. Pixel Art XL - https://civitai.com/models/120096"
echo "2. Comic Book XL - https://civitai.com/models/140625"
echo "3. Sticker Style - https://civitai.com/models/130925"
echo ""
echo "Manual download: Visit civitai.com and download to appropriate folders"

echo "✅ Model setup script complete!"
echo ""
echo "Next steps:"
echo "1. Update ComfyUI config to use SDXL models"
echo "2. Configure GPU acceleration"
echo "3. Test generation with better models"