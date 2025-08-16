#!/usr/bin/env tsx

import { ImageGenerationAgent } from '../agents/ImageGenerationAgent';
import { ART_STYLES } from '../lib/art-presets';

async function testAllStyles() {
  console.log(
    '🎨 Testing ComfyUI integration with all Dali Palette styles...\n',
  );

  const agent = new ImageGenerationAgent('./test-generated-images');

  // Test prompt for each style
  const testPrompt = 'a football quarterback throwing a spiral pass';

  // Track results
  const results: Array<{
    styleId: string;
    styleName: string;
    success: boolean;
    error?: string;
    imagePath?: string;
  }> = [];

  for (const style of ART_STYLES) {
    console.log(`\n🔄 Testing style: ${style.label} (${style.id})`);
    console.log(`   Description: ${style.description}`);

    try {
      const result = await agent.generateNFTImage({
        prompt: testPrompt,
        style: style.id,
        variations: 1,
        width: 512, // Smaller for faster testing
        height: 512,
      });

      if (result.success && result.images && result.images.length > 0) {
        console.log(`   ✅ Success: ${result.images[0].path}`);
        results.push({
          styleId: style.id,
          styleName: style.label,
          success: true,
          imagePath: result.images[0].path,
        });
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
        results.push({
          styleId: style.id,
          styleName: style.label,
          success: false,
          error: result.error,
        });
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
      results.push({
        styleId: style.id,
        styleName: style.label,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Small delay between generations
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('========================');

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length} styles`);
  console.log(`❌ Failed: ${failed.length}/${results.length} styles\n`);

  if (successful.length > 0) {
    console.log('✅ Successful Styles:');
    successful.forEach((r) => {
      console.log(`   - ${r.styleName} (${r.styleId}): ${r.imagePath}`);
    });
    console.log();
  }

  if (failed.length > 0) {
    console.log('❌ Failed Styles:');
    failed.forEach((r) => {
      console.log(`   - ${r.styleName} (${r.styleId}): ${r.error}`);
    });
    console.log();
  }

  agent.disconnect();

  if (failed.length === 0) {
    console.log('🎉 All styles working successfully with ComfyUI!');
    process.exit(0);
  } else {
    console.log('⚠️  Some styles failed. Check ComfyUI setup and models.');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  testAllStyles().catch(console.error);
}

export default testAllStyles;
