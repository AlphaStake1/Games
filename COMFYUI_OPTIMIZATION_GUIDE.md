# ComfyUI Optimization Guide for VirtualBox

## 🔍 Current Issues

- **Model Quality**: Using SD 1.5 (old, low quality)
- **Speed**: CPU-only generation (very slow)
- **Environment**: VirtualBox VM with limited GPU access

## 🚀 Solutions (In Order of Effectiveness)

### 1. **Quick Fix: Better Models** ⭐ (Immediate Impact)

```bash
# Download SDXL (much better quality than SD 1.5)
cd ~/workspace/comfyui
./scripts/setup-better-models.sh
```

**Models to Download:**

- **SDXL Base 1.0** (6.9GB) - Much better than SD 1.5
- **Juggernaut XL** - Community favorite for detailed images
- **RealVisXL** - Great for realistic images
- **DreamShaper XL** - Versatile for various styles

### 2. **GPU Acceleration in VirtualBox** ⭐⭐

#### Option A: Enable VirtualBox 3D Acceleration

1. **Host Machine VirtualBox Settings:**

   ```
   VM Settings → Display
   ☑ Enable 3D Acceleration
   ☑ Enable 2D Video Acceleration
   Video Memory: 256MB (maximum)
   ```

2. **Install Guest Additions with 3D support:**

   ```bash
   # If not already installed
   sudo apt update
   sudo apt install mesa-utils

   # Test OpenGL
   glxinfo | grep "OpenGL"
   ```

3. **Restart ComfyUI without CPU flag:**
   ```bash
   cd ~/workspace/comfyui
   source venv/bin/activate
   python main.py --listen 0.0.0.0 --port 8188
   # Remove --cpu flag to allow GPU usage
   ```

#### Option B: GPU Passthrough (Advanced)

**Requirements:**

- Host has dedicated GPU
- VT-d/AMD-Vi enabled in BIOS
- IOMMU support

**Setup:**

1. Enable IOMMU in host BIOS
2. Configure VirtualBox PCI passthrough
3. Pass dedicated GPU to VM

### 3. **Alternative: Docker with GPU** ⭐⭐⭐ (Best Performance)

**Instead of VirtualBox, use Docker:**

```bash
# On host machine with NVIDIA GPU
docker run --gpus all -p 8188:8188 \
  -v ~/comfyui-models:/app/models \
  comfyui/comfyui:latest
```

### 4. **Optimize Current Setup** ⭐

```bash
# Update ComfyUI config for better performance
cd ~/workspace/fsq
```

**Update config to use SDXL:**

```typescript
// config/comfyui.config.ts
export const comfyUIConfig = {
  // Use SDXL as base model
  models: {
    base: 'sd_xl_base_1.0.safetensors', // Instead of sd_v1.5
    vae: 'sdxl_vae.safetensors',
    upscale: 'RealESRGAN_x4plus.pth',
  },

  // Optimize settings for quality
  defaultSettings: {
    steps: 20, // Reduce steps for speed
    cfg: 7.0,
    width: 1024, // SDXL native resolution
    height: 1024,
    sampler: 'euler_a', // Faster sampler
    scheduler: 'normal',
  },
};
```

**Update workflows to use SDXL:**

```typescript
// services/workflows/nftStyleWorkflows.ts
static createBaseSDXLWorkflow(params: NFTWorkflowParams): any {
  return {
    '4': {
      inputs: {
        ckpt_name: 'sd_xl_base_1.0.safetensors', // Use SDXL
      },
      class_type: 'CheckpointLoaderSimple',
    },
    // ... rest of workflow
  }
}
```

## 🎯 Immediate Action Plan

**Step 1: Test Current GPU Detection**

```bash
cd ~/workspace/comfyui
python -c "import torch; print(f'CUDA Available: {torch.cuda.is_available()}')"
```

**Step 2: Restart ComfyUI without CPU flag**

```bash
# Stop current ComfyUI
# Start with GPU support
cd ~/workspace/comfyui
source venv/bin/activate
python main.py --listen 0.0.0.0 --port 8188
```

**Step 3: Download Better Models**

```bash
# Download SDXL (6.9GB) - much better quality
wget -c https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors \
     -P ~/workspace/comfyui/models/checkpoints/
```

**Step 4: Update FSQ Config**

```bash
# Update our workflow to use SDXL instead of SD 1.5
# Edit services/workflows/nftStyleWorkflows.ts
```

## 📊 Expected Performance Improvements

| Change          | Speed Improvement   | Quality Improvement |
| --------------- | ------------------- | ------------------- |
| SD 1.5 → SDXL   | -20% (larger model) | +300% (much better) |
| CPU → GPU       | +500-1000%          | Same                |
| Better samplers | +30%                | Same                |
| Optimized steps | +40%                | -10%                |

## 🔧 Hardware Recommendations

**For Production:**

1. **Bare metal with RTX 4090** - Best performance
2. **Docker with GPU passthrough** - Good performance
3. **VirtualBox with 3D acceleration** - Moderate improvement
4. **Cloud GPU instances** - AWS/GCP with GPU

## 🎨 Model Recommendations for NFTs

**Best Quality:**

- Juggernaut XL
- RealVisXL
- SDXL Base + good LoRAs

**Style-Specific:**

- Pixel Art: PixelArt XL LoRA
- Comic: Comic Book XL LoRA
- Sticker: Flat Design LoRA

**LoRA Sources:**

- [CivitAI](https://civitai.com) - Largest collection
- [Hugging Face](https://huggingface.co) - Open source models
