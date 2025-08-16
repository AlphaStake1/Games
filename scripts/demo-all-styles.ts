#!/usr/bin/env tsx

import { ImageGenerationAgent } from '../agents/ImageGenerationAgent';
import { ART_STYLES, buildPromptFromFields } from '../lib/art-presets';

async function demoAllStyles() {
  console.log('🎨 Demo: Generating examples with all Dali Palette styles\n');

  const agent = new ImageGenerationAgent('./demo-generated-images');

  // Different prompts for each style to showcase their strengths
  const stylePrompts: Record<string, string> = {
    sticker: 'cute mascot character with a football helmet',
    'vintage-card': 'classic quarterback from the 1970s',
    graffiti: 'dynamic football player breaking through a wall',
    'neon-synthwave': 'futuristic football arena with glowing field lines',
    'geometric-block': 'blocky pixelated football stadium',
    sketch: 'hand-drawn football coach with whistle',
    pixel: '8-bit style football game character',
    fantasy: 'magical football floating in a mystical stadium',
    'realistic-comic': 'superhero quarterback with cape and uniform',
  };

  const results = [];

  for (const style of ART_STYLES) {
    console.log(`\n🎨 Creating ${style.label} example...`);

    const prompt = stylePrompts[style.id] || 'football themed artwork';

    // Use the style's prompt template from art-presets
    const enhancedPrompt = `${style.prompt}, ${prompt}`;

    console.log(`   Prompt: "${enhancedPrompt}"`);

    try {
      const result = await agent.generateNFTImage({
        prompt: enhancedPrompt,
        style: style.id,
        variations: 1,
        width: 1024,
        height: 1024,
      });

      if (result.success && result.images && result.images.length > 0) {
        const imagePath = result.images[0].path;
        console.log(`   ✅ Generated: ${imagePath}`);

        results.push({
          style: style.label,
          styleId: style.id,
          description: style.description,
          imagePath,
          prompt: enhancedPrompt,
        });
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    // Delay between generations
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  // Generate summary
  console.log('\n📋 Generated Examples Summary:');
  console.log('==============================');

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. ${result.style} (${result.styleId})`);
    console.log(`   Description: ${result.description}`);
    console.log(`   File: ${result.imagePath}`);
    console.log(`   Prompt: "${result.prompt}"`);
  });

  console.log(`\n🎉 Generated ${results.length} style examples!`);
  console.log('📂 Check the ./demo-generated-images folder for results.');

  agent.disconnect();
}

// Test specific style combinations with Recipe Cards
async function demoRecipeCards() {
  console.log('\n🍳 Demo: Testing Recipe Card combinations\n');

  const agent = new ImageGenerationAgent('./demo-recipe-images');

  const recipeTests = [
    {
      name: 'Stadium Snack',
      prompt: 'classic hotdog with mustard',
      style: 'sticker',
    },
    {
      name: 'Neon Jersey Number',
      prompt: 'glowing number 88 jersey',
      style: 'neon-synthwave',
    },
    {
      name: 'Vintage Equipment',
      prompt: 'old school leather football helmet',
      style: 'vintage-card',
    },
    {
      name: 'Graffiti Character',
      prompt: 'street art style football mascot',
      style: 'graffiti',
    },
  ];

  for (const recipe of recipeTests) {
    console.log(`🧪 Testing: ${recipe.name}`);

    try {
      const result = await agent.generateNFTImage({
        prompt: recipe.prompt,
        style: recipe.style,
        variations: 1,
      });

      if (result.success && result.images && result.images.length > 0) {
        console.log(`   ✅ Generated: ${result.images[0].path}`);
      } else {
        console.log(`   ❌ Failed: ${result.error}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  agent.disconnect();
}

// Run demos
async function runDemos() {
  try {
    await demoAllStyles();
    await demoRecipeCards();
  } catch (error) {
    console.error('Demo failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runDemos().catch(console.error);
}

export { demoAllStyles, demoRecipeCards };
