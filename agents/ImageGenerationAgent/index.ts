import ComfyUIService from '../../services/ComfyUIService';
import NFTWorkflowTemplates, {
  NFTWorkflowParams,
} from '../../services/workflows/nftStyleWorkflows';
import { comfyUIConfig } from '../../config/comfyui.config';
import fs from 'fs';
import path from 'path';

// Style ID mapping from art-presets.ts to ComfyUI workflow styles
const STYLE_ID_MAPPING: Record<string, NFTWorkflowParams['style']> = {
  sticker: 'sticker',
  'vintage-card': 'vintage-card',
  graffiti: 'graffiti',
  'neon-synthwave': 'neon-synthwave',
  'geometric-block': 'geometric-block',
  sketch: 'sketch',
  pixel: 'pixel',
  fantasy: 'fantasy',
  'realistic-comic': 'realistic_comic',
  cyberpunk: 'cyberpunk',
  abstract: 'abstract',
  photorealistic: 'photorealistic',
  // Additional mappings for any other style variations
  chibi: 'sticker', // Map chibi to sticker style as fallback
};

export interface ImageGenerationRequest {
  prompt: string;
  style?: string | NFTWorkflowParams['style']; // Accept both art-preset IDs and ComfyUI style names
  negativePrompt?: string;
  width?: number;
  height?: number;
  seed?: number;
  outputPath?: string;
  variations?: number;
}

export interface ImageGenerationResult {
  success: boolean;
  images?: Array<{
    path: string;
    url: string;
    prompt: string;
    style: string;
    seed: number;
  }>;
  error?: string;
}

export class ImageGenerationAgent {
  private comfyUI: ComfyUIService;
  private outputDir: string;

  constructor(outputDir?: string) {
    this.comfyUI = new ComfyUIService({
      host: comfyUIConfig.host,
      port: comfyUIConfig.port,
    });

    this.outputDir = outputDir || path.join(process.cwd(), 'generated-images');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateNFTImage(
    request: ImageGenerationRequest,
  ): Promise<ImageGenerationResult> {
    try {
      console.log(
        `🎨 Generating NFT image with style: ${request.style || 'default'}`,
      );

      const images = [];
      const variations = request.variations || 1;

      for (let i = 0; i < variations; i++) {
        const seed =
          request.seed !== undefined
            ? request.seed + i
            : Math.floor(Math.random() * 1000000);

        // Map style ID to ComfyUI workflow style
        const mappedStyle = request.style
          ? STYLE_ID_MAPPING[request.style] ||
            (request.style as NFTWorkflowParams['style'])
          : 'realistic_comic';

        // Create workflow based on style
        const workflow = NFTWorkflowTemplates.createWorkflowForStyle({
          prompt: request.prompt,
          style: mappedStyle,
          negativePrompt: request.negativePrompt,
          width: request.width || 1024,
          height: request.height || 1024,
          seed: seed,
          steps:
            comfyUIConfig.styleSettings[mappedStyle || 'realistic_comic']
              ?.steps || 30,
          cfg:
            comfyUIConfig.styleSettings[mappedStyle || 'realistic_comic']
              ?.cfg || 7.5,
        });

        // Generate image
        console.log(`  Generating variation ${i + 1}/${variations}...`);
        const result = await this.comfyUI.generateImage(workflow);

        if (result.status === 'success' && result.images.length > 0) {
          for (const image of result.images) {
            // Download and save image
            const imageBuffer = await this.comfyUI.getImage(
              image.filename,
              image.subfolder,
              image.type,
            );

            const timestamp = Date.now();
            const filename = `nft_${request.style || 'default'}_${seed}_${timestamp}.png`;
            const outputPath =
              request.outputPath || path.join(this.outputDir, filename);

            fs.writeFileSync(outputPath, imageBuffer);

            images.push({
              path: outputPath,
              url: image.url || '',
              prompt: request.prompt,
              style: request.style || 'default',
              seed: seed,
            });

            console.log(`  ✅ Saved: ${outputPath}`);
          }
        } else {
          throw new Error(result.error || 'Image generation failed');
        }
      }

      return {
        success: true,
        images: images,
      };
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async generateFromExistingImage(
    inputImagePath: string,
    prompt: string,
    style?: string | NFTWorkflowParams['style'],
    denoise: number = 0.75,
  ): Promise<ImageGenerationResult> {
    try {
      console.log('🎨 Generating variation from existing image...');

      // Upload the input image
      const uploadedImageName = await this.comfyUI.uploadImage(inputImagePath);

      // Map style ID to ComfyUI workflow style
      const mappedStyle = style
        ? STYLE_ID_MAPPING[style] || (style as NFTWorkflowParams['style'])
        : undefined;

      // Create img2img workflow
      const workflow = NFTWorkflowTemplates.createImg2ImgWorkflow({
        inputImage: uploadedImageName,
        prompt: prompt,
        style: mappedStyle,
        denoise: denoise,
        width: 1024,
        height: 1024,
      });

      // Generate image
      const result = await this.comfyUI.generateImage(workflow);

      if (result.status === 'success' && result.images.length > 0) {
        const images = [];

        for (const image of result.images) {
          const imageBuffer = await this.comfyUI.getImage(
            image.filename,
            image.subfolder,
            image.type,
          );

          const filename = `nft_img2img_${Date.now()}.png`;
          const outputPath = path.join(this.outputDir, filename);

          fs.writeFileSync(outputPath, imageBuffer);

          images.push({
            path: outputPath,
            url: image.url || '',
            prompt: prompt,
            style: style || 'img2img',
            seed: 0,
          });
        }

        return {
          success: true,
          images: images,
        };
      } else {
        throw new Error(result.error || 'Image generation failed');
      }
    } catch (error) {
      console.error('❌ Image generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async upscaleImage(imagePath: string): Promise<ImageGenerationResult> {
    try {
      console.log('🔍 Upscaling image...');

      // Upload the image
      const uploadedImageName = await this.comfyUI.uploadImage(imagePath);

      // Create upscale workflow
      const workflow =
        NFTWorkflowTemplates.createUpscaleWorkflow(uploadedImageName);

      // Generate upscaled image
      const result = await this.comfyUI.generateImage(workflow);

      if (result.status === 'success' && result.images.length > 0) {
        const images = [];

        for (const image of result.images) {
          const imageBuffer = await this.comfyUI.getImage(
            image.filename,
            image.subfolder,
            image.type,
          );

          const filename = `nft_upscaled_${Date.now()}.png`;
          const outputPath = path.join(this.outputDir, filename);

          fs.writeFileSync(outputPath, imageBuffer);

          images.push({
            path: outputPath,
            url: image.url || '',
            prompt: 'Upscaled image',
            style: 'upscale',
            seed: 0,
          });
        }

        return {
          success: true,
          images: images,
        };
      } else {
        throw new Error(result.error || 'Upscaling failed');
      }
    } catch (error) {
      console.error('❌ Upscaling failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async batchGenerate(
    prompts: string[],
    style: string | NFTWorkflowParams['style'],
  ): Promise<ImageGenerationResult> {
    const allImages = [];
    const errors = [];

    for (const prompt of prompts) {
      const result = await this.generateNFTImage({
        prompt: prompt,
        style: style,
      });

      if (result.success && result.images) {
        allImages.push(...result.images);
      } else {
        errors.push(`Failed for prompt "${prompt}": ${result.error}`);
      }
    }

    return {
      success: errors.length === 0,
      images: allImages,
      error: errors.length > 0 ? errors.join('; ') : undefined,
    };
  }

  disconnect(): void {
    this.comfyUI.disconnect();
  }
}

// Example usage
export async function exampleUsage() {
  const agent = new ImageGenerationAgent();

  // Generate a single NFT image
  const result = await agent.generateNFTImage({
    prompt:
      'A legendary football quarterback throwing a perfect spiral pass in a packed stadium',
    style: 'realistic_comic',
    variations: 3,
  });

  if (result.success && result.images) {
    console.log(`Generated ${result.images.length} images:`);
    result.images.forEach((img) => {
      console.log(`  - ${img.path} (seed: ${img.seed})`);
    });
  }

  // Generate from existing image
  if (result.success && result.images && result.images[0]) {
    const variation = await agent.generateFromExistingImage(
      result.images[0].path,
      'The same quarterback but in cyberpunk style with neon lights',
      'cyberpunk',
      0.5, // Keep 50% of original image
    );

    if (variation.success && variation.images) {
      console.log('Generated variation:', variation.images[0].path);
    }
  }

  // Batch generate multiple styles
  const batchResult = await agent.batchGenerate(
    [
      'Football trophy made of pure energy',
      'Stadium floating in space',
      'Time-traveling referee',
    ],
    'fantasy',
  );

  console.log(`Batch generated ${batchResult.images?.length || 0} images`);

  agent.disconnect();
}

export default ImageGenerationAgent;
