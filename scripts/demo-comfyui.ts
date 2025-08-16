#!/usr/bin/env ts-node

console.log(`
🎨 ComfyUI Integration Demo
===========================

ComfyUI is downloading the Stable Diffusion model (4GB).
Current progress: ~77%

Once complete, you can:

1. Generate NFT images with different styles:
   - realistic_comic
   - cyberpunk  
   - fantasy
   - abstract
   - photorealistic

2. Run this command to test:
   pnpm ts-node scripts/test-comfyui.ts

3. Or generate directly:
   pnpm ts-node -e "
     import ImageGenerationAgent from './agents/ImageGenerationAgent';
     
     async function gen() {
       const agent = new ImageGenerationAgent();
       const result = await agent.generateNFTImage({
         prompt: 'Epic football championship trophy',
         style: 'fantasy'
       });
       console.log('Image saved:', result.images?.[0]?.path);
       agent.disconnect();
     }
     gen();
   "

4. View images:
   - Browser: http://localhost:8188
   - Files: generated-images/ folder

The system is ready - just waiting for the model download to finish!
`);
