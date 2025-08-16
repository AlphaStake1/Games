#!/usr/bin/env tsx

import { ImageGenerationAgent } from '../agents/ImageGenerationAgent';

async function quickDemo() {
  console.log('🎨 Quick Demo: Testing Dali Palette styles with ComfyUI\n');

  const agent = new ImageGenerationAgent('./style-demo-images');

  // Test a few key styles with football-themed prompts
  const testStyles = [
    {
      id: 'sticker',
      name: 'Sticker Toon',
      prompt: 'cute football mascot with helmet',
    },
    {
      id: 'neon-synthwave',
      name: 'Neon Synthwave',
      prompt: 'glowing football stadium at night',
    },
    {
      id: 'realistic-comic',
      name: 'Realistic Comic',
      prompt: 'superhero quarterback throwing pass',
    },
  ];

  console.log(`Testing ${testStyles.length} styles...\n`);

  for (const style of testStyles) {
    console.log(`🔄 Generating: ${style.name} (${style.id})`);
    console.log(`   Prompt: "${style.prompt}"`);

    try {
      const result = await agent.generateNFTImage({
        prompt: style.prompt,
        style: style.id,
        variations: 1,
        width: 256, // Small size for faster generation
        height: 256,
      });

      if (result.success && result.images && result.images.length > 0) {
        console.log(`   ✅ Success: ${result.images[0].path}`);
        console.log(`   Seed: ${result.images[0].seed}\n`);
      } else {
        console.log(`   ❌ Failed: ${result.error}\n`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}\n`);
    }
  }

  agent.disconnect();
  console.log('🎉 Quick demo complete!');
  console.log('📂 Check the ./style-demo-images directory for results');
}

if (require.main === module) {
  quickDemo().catch(console.error);
}

export default quickDemo;
