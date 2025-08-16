import ComfyUIService from '../services/ComfyUIService';
import NFTWorkflowTemplates from '../services/workflows/nftStyleWorkflows';
import { comfyUIConfig } from '../config/comfyui.config';
import fs from 'fs';
import path from 'path';

async function testComfyUIIntegration() {
  console.log('🧪 Testing ComfyUI Integration...\n');

  const comfyUI = new ComfyUIService({
    host: comfyUIConfig.host,
    port: comfyUIConfig.port,
  });

  try {
    // Test 1: Check system status
    console.log('1️⃣ Checking ComfyUI system status...');
    const stats = await comfyUI.getSystemStats();
    console.log('✅ ComfyUI is running');
    console.log(`   - System: ${stats.system.os}`);
    console.log(`   - Python: ${stats.system.python_version}`);
    console.log(
      `   - VRAM Free: ${(stats.devices[0]?.vram_free / 1024 / 1024 / 1024).toFixed(2)} GB`,
    );

    // Test 2: Check queue
    console.log('\n2️⃣ Checking generation queue...');
    const queue = await comfyUI.getQueue();
    console.log(
      `✅ Queue status: ${queue.queue_running.length} running, ${queue.queue_pending.length} pending`,
    );

    // Test 3: Generate a test image
    console.log('\n3️⃣ Generating test NFT image...');
    console.log('   Style: Realistic Comic Book');
    console.log(
      '   Prompt: "A heroic football player in action, dynamic pose"',
    );

    const workflow = NFTWorkflowTemplates.createWorkflowForStyle({
      prompt:
        'A heroic football player in action, dynamic pose, stadium background',
      style: 'realistic_comic',
      seed: 42,
      steps: 20, // Reduced for testing
      width: 512, // Smaller for faster testing
      height: 512,
    });

    console.log('   ⏳ Generating image (this may take 30-60 seconds)...');
    const result = await comfyUI.generateImage(workflow);

    if (result.status === 'success' && result.images.length > 0) {
      console.log(`✅ Image generated successfully!`);
      console.log(`   - Prompt ID: ${result.prompt_id}`);
      console.log(`   - Images generated: ${result.images.length}`);

      // Save the first image locally
      const image = result.images[0];
      const imageBuffer = await comfyUI.getImage(
        image.filename,
        image.subfolder,
        image.type,
      );

      const outputDir = path.join(process.cwd(), 'test-outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputPath = path.join(outputDir, `test-nft-${Date.now()}.png`);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`   - Saved to: ${outputPath}`);
      console.log(`   - View at: ${image.url}`);
    } else {
      console.error(`❌ Image generation failed: ${result.error}`);
    }

    // Test 4: Test different styles
    console.log('\n4️⃣ Testing style variations...');
    const styles: Array<'cyberpunk' | 'fantasy' | 'abstract'> = [
      'cyberpunk',
      'fantasy',
      'abstract',
    ];

    for (const style of styles) {
      console.log(`   Testing ${style} style...`);
      const styleWorkflow = NFTWorkflowTemplates.createWorkflowForStyle({
        prompt: 'Football championship trophy',
        style: style as any,
        steps: 10, // Very few steps for quick testing
        width: 256,
        height: 256,
      });

      // Just queue it, don't wait for completion
      const response = await comfyUI.queuePrompt(styleWorkflow);
      console.log(`   ✅ ${style} workflow queued (ID: ${response.prompt_id})`);
    }

    console.log('\n✅ All tests completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Add your HUGGING_FACE_API_KEY to .env');
    console.log('2. Add COMFYUI_HOST=localhost and COMFYUI_PORT=8188 to .env');
    console.log('3. Run the setup script: bash scripts/setup-comfyui.sh');
    console.log(
      '4. Start ComfyUI with API: python main.py --listen 0.0.0.0 --port 8188 --api',
    );
    console.log(
      '5. Your agents can now use ComfyUIService for image generation!',
    );
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log(
      '1. Is ComfyUI running? Start it with: python main.py --listen 0.0.0.0 --port 8188 --api',
    );
    console.log('2. Check if port 8188 is accessible');
    console.log('3. Ensure you have the required models installed');
    console.log('4. Run the setup script first: bash scripts/setup-comfyui.sh');
  } finally {
    comfyUI.disconnect();
  }
}

// Run the test
testComfyUIIntegration().catch(console.error);
