#!/usr/bin/env tsx

import { ImageGenerationAgent } from '../agents/ImageGenerationAgent';

async function testConnection() {
  console.log('🔗 Testing ComfyUI connection...');

  const agent = new ImageGenerationAgent('./test-connection-images');

  try {
    // Test basic generation with a simple style
    console.log('📝 Testing basic image generation...');

    const result = await agent.generateNFTImage({
      prompt: 'a simple red circle',
      style: 'abstract',
      variations: 1,
      width: 256,
      height: 256,
    });

    if (result.success && result.images && result.images.length > 0) {
      console.log('✅ Connection test successful!');
      console.log(`   Generated image: ${result.images[0].path}`);
      console.log(`   Style: ${result.images[0].style}`);
      console.log(`   Seed: ${result.images[0].seed}`);
      return true;
    } else {
      console.log('❌ Generation failed:', result.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Connection failed:', error);
    return false;
  } finally {
    agent.disconnect();
  }
}

if (require.main === module) {
  testConnection()
    .then((success) => {
      if (success) {
        console.log(
          '\n🎉 ComfyUI integration is working! Ready to generate demo images.',
        );
        process.exit(0);
      } else {
        console.log(
          '\n💥 ComfyUI integration failed. Check ComfyUI server and models.',
        );
        process.exit(1);
      }
    })
    .catch(console.error);
}

export default testConnection;
