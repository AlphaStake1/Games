export interface NFTWorkflowParams {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  cfg?: number;
  width?: number;
  height?: number;
  denoise?: number;
  style?:
    | 'realistic_comic'
    | 'cyberpunk'
    | 'fantasy'
    | 'abstract'
    | 'photorealistic'
    | 'sticker'
    | 'vintage-card'
    | 'graffiti'
    | 'neon-synthwave'
    | 'geometric-block'
    | 'sketch'
    | 'pixel';
}

export class NFTWorkflowTemplates {
  static createBaseSDXLWorkflow(params: NFTWorkflowParams): any {
    const {
      prompt,
      negativePrompt = 'ugly, blurry, low quality, distorted, deformed',
      seed = Math.floor(Math.random() * 1000000),
      steps = 30,
      cfg = 7.5,
      width = 512,
      height = 512,
      denoise = 1.0,
    } = params;

    return {
      '3': {
        inputs: {
          seed: seed,
          steps: steps,
          cfg: cfg,
          sampler_name: 'euler',
          scheduler: 'normal',
          denoise: denoise,
          model: ['4', 0],
          positive: ['6', 0],
          negative: ['7', 0],
          latent_image: ['5', 0],
        },
        class_type: 'KSampler',
        _meta: {
          title: 'KSampler',
        },
      },
      '4': {
        inputs: {
          ckpt_name: 'sd_v1.5.safetensors',
        },
        class_type: 'CheckpointLoaderSimple',
        _meta: {
          title: 'Load Checkpoint',
        },
      },
      '5': {
        inputs: {
          width: width,
          height: height,
          batch_size: 1,
        },
        class_type: 'EmptyLatentImage',
        _meta: {
          title: 'Empty Latent Image',
        },
      },
      '6': {
        inputs: {
          text: prompt,
          clip: ['4', 1],
        },
        class_type: 'CLIPTextEncode',
        _meta: {
          title: 'CLIP Text Encode (Positive)',
        },
      },
      '7': {
        inputs: {
          text: negativePrompt,
          clip: ['4', 1],
        },
        class_type: 'CLIPTextEncode',
        _meta: {
          title: 'CLIP Text Encode (Negative)',
        },
      },
      '8': {
        inputs: {
          samples: ['3', 0],
          vae: ['4', 2],
        },
        class_type: 'VAEDecode',
        _meta: {
          title: 'VAE Decode',
        },
      },
      '9': {
        inputs: {
          filename_prefix: 'FSQ_NFT',
          images: ['8', 0],
        },
        class_type: 'SaveImage',
        _meta: {
          title: 'Save Image',
        },
      },
    };
  }

  static createRealisticComicBookWorkflow(params: NFTWorkflowParams): any {
    const baseWorkflow = this.createBaseSDXLWorkflow({
      ...params,
      prompt: `comic book style, detailed lineart, vibrant colors, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, photorealistic, blurry, low quality`,
      cfg: params.cfg || 8.5,
      steps: params.steps || 35,
    });

    // Add comic book specific nodes
    baseWorkflow['10'] = {
      inputs: {
        lora_name: 'comic_book_style.safetensors',
        strength_model: 0.8,
        strength_clip: 0.8,
        model: ['4', 0],
        clip: ['4', 1],
      },
      class_type: 'LoraLoader',
      _meta: {
        title: 'Comic Book LoRA',
      },
    };

    // Update KSampler to use LoRA model
    baseWorkflow['3'].inputs.model = ['10', 0];
    baseWorkflow['6'].inputs.clip = ['10', 1];
    baseWorkflow['7'].inputs.clip = ['10', 1];

    return baseWorkflow;
  }

  static createCyberpunkWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `cyberpunk style, neon lights, futuristic, high tech, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, medieval, rustic, old-fashioned`,
      cfg: params.cfg || 9,
      steps: params.steps || 40,
    });
  }

  static createFantasyWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `fantasy art style, magical, ethereal, detailed, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, modern, technological, mundane`,
      cfg: params.cfg || 8,
      steps: params.steps || 35,
    });
  }

  static createAbstractWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `abstract art, geometric shapes, vibrant colors, artistic, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, photorealistic, literal, figurative`,
      cfg: params.cfg || 10,
      steps: params.steps || 30,
    });
  }

  static createPhotorealisticWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `photorealistic, highly detailed, professional photography, 8k resolution, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, cartoon, anime, drawing, illustration`,
      cfg: params.cfg || 7,
      steps: params.steps || 50,
    });
  }

  static createStickerWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `bold outlines, flat colors, sticker style, clean lines, simple shapes, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, complex details, gradients, photorealistic, shadows`,
      cfg: params.cfg || 8,
      steps: params.steps || 25,
    });
  }

  static createVintageCardWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `vintage trading card style, retro sports card design, classic borders, aged paper texture, nostalgic colors, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, modern, digital, clean, pristine`,
      cfg: params.cfg || 8.5,
      steps: params.steps || 35,
    });
  }

  static createGraffitiWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `graffiti street art, urban spray paint style, bold colors, street art aesthetic, wall texture, dynamic lettering, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, clean, formal, corporate, pristine`,
      cfg: params.cfg || 9,
      steps: params.steps || 40,
    });
  }

  static createNeonSynthwaveWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `neon synthwave, 80s retro-futuristic, glowing outlines, cyberpunk aesthetic, neon lights, dark background, electric colors, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, realistic, dull colors, daylight, matte`,
      cfg: params.cfg || 9.5,
      steps: params.steps || 40,
    });
  }

  static createGeometricBlockWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `geometric block style, minecraft-inspired, chunky voxel art, pixelated blocks, cubic shapes, isometric view, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, smooth, curved, organic, realistic`,
      cfg: params.cfg || 8,
      steps: params.steps || 30,
    });
  }

  static createSketchWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `ink line art, light watercolor wash, sketch style, hand-drawn, artistic linework, minimal coloring, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, fully colored, digital, photorealistic, heavy shading`,
      cfg: params.cfg || 7.5,
      steps: params.steps || 30,
    });
  }

  static createPixelWorkflow(params: NFTWorkflowParams): any {
    return this.createBaseSDXLWorkflow({
      ...params,
      prompt: `8-bit pixel art, limited palette, retro gaming style, pixelated, chunky pixels, classic arcade aesthetic, ${params.prompt}`,
      negativePrompt: `${params.negativePrompt || ''}, smooth, high resolution, realistic, gradients`,
      cfg: params.cfg || 8,
      steps: params.steps || 25,
    });
  }

  static createWorkflowForStyle(params: NFTWorkflowParams): any {
    switch (params.style) {
      case 'realistic_comic':
        return this.createRealisticComicBookWorkflow(params);
      case 'cyberpunk':
        return this.createCyberpunkWorkflow(params);
      case 'fantasy':
        return this.createFantasyWorkflow(params);
      case 'abstract':
        return this.createAbstractWorkflow(params);
      case 'photorealistic':
        return this.createPhotorealisticWorkflow(params);
      case 'sticker':
        return this.createStickerWorkflow(params);
      case 'vintage-card':
        return this.createVintageCardWorkflow(params);
      case 'graffiti':
        return this.createGraffitiWorkflow(params);
      case 'neon-synthwave':
        return this.createNeonSynthwaveWorkflow(params);
      case 'geometric-block':
        return this.createGeometricBlockWorkflow(params);
      case 'sketch':
        return this.createSketchWorkflow(params);
      case 'pixel':
        return this.createPixelWorkflow(params);
      default:
        return this.createBaseSDXLWorkflow(params);
    }
  }

  static createUpscaleWorkflow(
    imagePath: string,
    scaleFactor: number = 2,
  ): any {
    return {
      '1': {
        inputs: {
          image: imagePath,
          upload: 'image',
        },
        class_type: 'LoadImage',
        _meta: {
          title: 'Load Image',
        },
      },
      '2': {
        inputs: {
          model_name: 'RealESRGAN_x4plus.pth',
        },
        class_type: 'UpscaleModelLoader',
        _meta: {
          title: 'Load Upscale Model',
        },
      },
      '3': {
        inputs: {
          upscale_model: ['2', 0],
          image: ['1', 0],
        },
        class_type: 'ImageUpscaleWithModel',
        _meta: {
          title: 'Upscale Image',
        },
      },
      '4': {
        inputs: {
          filename_prefix: 'FSQ_NFT_Upscaled',
          images: ['3', 0],
        },
        class_type: 'SaveImage',
        _meta: {
          title: 'Save Upscaled Image',
        },
      },
    };
  }

  static createImg2ImgWorkflow(
    params: NFTWorkflowParams & { inputImage: string },
  ): any {
    const workflow = this.createBaseSDXLWorkflow(params);

    // Replace empty latent with image input
    workflow['5'] = {
      inputs: {
        image: params.inputImage,
        upload: 'image',
      },
      class_type: 'LoadImage',
      _meta: {
        title: 'Load Input Image',
      },
    };

    // Add VAE encode for img2img
    workflow['11'] = {
      inputs: {
        pixels: ['5', 0],
        vae: ['4', 2],
      },
      class_type: 'VAEEncode',
      _meta: {
        title: 'VAE Encode',
      },
    };

    // Update KSampler to use encoded image
    workflow['3'].inputs.latent_image = ['11', 0];
    workflow['3'].inputs.denoise = params.denoise || 0.75; // Lower denoise for img2img

    return workflow;
  }
}

export default NFTWorkflowTemplates;
