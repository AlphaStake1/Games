export const comfyUIConfig = {
  // ComfyUI Server Configuration
  host: process.env.COMFYUI_HOST || 'localhost',
  port: parseInt(process.env.COMFYUI_PORT || '8188'),
  apiEndpoint: process.env.COMFYUI_API_ENDPOINT,
  apiKey: process.env.COMFYUI_API_KEY, // For hosted ComfyUI services

  // Hugging Face API (for model downloads)
  huggingFaceApiKey: process.env.HUGGING_FACE_API_KEY,

  // Default generation settings - optimized for quality
  defaultSettings: {
    steps: 40, // Increased for better quality
    cfg: 8.0, // Slightly higher for more prompt adherence
    width: 1024,
    height: 1024,
    sampler: 'dpmpp_2m_sde', // Better sampler for quality
    scheduler: 'karras',
    vae: 'sdxl_vae.safetensors', // Use high-quality VAE
  },

  // Style-specific settings - optimized for quality
  styleSettings: {
    realistic_comic: {
      steps: 45,
      cfg: 8.5,
      sampler: 'dpmpp_2m_sde',
      loraStrength: 0.8,
    },
    cyberpunk: {
      steps: 50,
      cfg: 8.5,
      sampler: 'dpmpp_2m_sde',
    },
    fantasy: {
      steps: 45,
      cfg: 8.0,
      sampler: 'dpmpp_2m_sde',
    },
    abstract: {
      steps: 40,
      cfg: 9.0,
      sampler: 'dpmpp_3m_sde',
    },
    photorealistic: {
      steps: 60,
      cfg: 7.5,
      sampler: 'dpmpp_2m_sde',
    },
    sticker: {
      steps: 35,
      cfg: 8.0,
      sampler: 'dpmpp_2m',
    },
    'vintage-card': {
      steps: 45,
      cfg: 8.5,
      sampler: 'dpmpp_2m_sde',
    },
    graffiti: {
      steps: 50,
      cfg: 8.5,
      sampler: 'dpmpp_3m_sde',
    },
    'neon-synthwave': {
      steps: 50,
      cfg: 9.0,
      sampler: 'dpmpp_3m_sde',
    },
    'geometric-block': {
      steps: 40,
      cfg: 8.0,
      sampler: 'dpmpp_2m',
    },
    sketch: {
      steps: 35,
      cfg: 7.5,
      sampler: 'dpmpp_2m',
    },
    pixel: {
      steps: 30,
      cfg: 8.0,
      sampler: 'dpmpp_2m',
    },
  },

  // Model configurations
  models: {
    base: 'sd_xl_base_1.0.safetensors',
    upscale: 'RealESRGAN_x4plus.pth',
    loras: {
      comic_book: 'comic_book_style.safetensors',
      cyberpunk: 'cyberpunk_style.safetensors',
      fantasy: 'fantasy_style.safetensors',
    },
  },

  // Timeout settings (in milliseconds) - increased for higher quality
  timeouts: {
    generation: 600000, // 10 minutes for high-quality generation
    upload: 60000, // 1 minute
    connection: 30000, // 30 seconds
  },
};

// Instructions for adding to .env file:
// Add these lines to your .env file:
// COMFYUI_HOST=localhost
// COMFYUI_PORT=8188
// HUGGING_FACE_API_KEY=your_hf_key_here
