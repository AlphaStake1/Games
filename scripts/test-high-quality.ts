#!/usr/bin/env node

/**
 * Test High-Quality Image Generation
 * Tests improved ComfyUI setup with better models and settings
 */

import { ImageGenerationAgent } from '../agents/ImageGenerationAgent/index.js';

console.log('🎨 Testing High-Quality Image Generation\n');

const agent = new ImageGenerationAgent();

// Enhanced prompts for better quality
const testPrompts = [
  {
    style: 'photorealistic',
    prompt:
      'professional portrait of a football coach wearing a headset, detailed facial features, high-resolution photography, studio lighting, sharp focus, award-winning photography',
    description: 'High-Quality Portrait',
  },
  {
    style: 'realistic_comic',
    prompt:
      'dynamic comic book illustration of a football player in action, vibrant colors, detailed artwork, professional comic book style, high quality digital art',
    description: 'Comic Book Style',
  },
  {
    style: 'sticker',
    prompt:
      'cute kawaii football mascot sticker design, chibi style, bright colors, clean lines, professional vector art quality, white background',
    description: 'Sticker Design',
  },
];

async function testHighQuality() {
  try {
    console.log('🔄 Starting high-quality generation tests...\n');

    for (const test of testPrompts) {
      console.log(`📸 Testing: ${test.description} (${test.style})`);
      console.log(`   Prompt: "${test.prompt}"`);

      const startTime = Date.now();

      const result = await agent.generateNFTImage({
        prompt: test.prompt,
        style: test.style,
        variations: 1,
      });

      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      if (result.success) {
        console.log(`✅ Generated successfully in ${duration}s`);
        console.log(
          `   Output: ${result.images?.[0]?.path || 'No path returned'}`,
        );
      } else {
        console.log(`❌ Generation failed: ${result.error}`);
      }

      console.log('');
    }

    console.log('🎉 High-quality generation tests complete!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
testHighQuality();
