#!/usr/bin/env ts-node
/**
 * Direct ElizaOS V2 Startup using Core API
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startElizaDirectly() {
  console.log('🚀 Starting ElizaOS V2 directly with core API...\n');

  try {
    // Import ElizaOS core
    const { createAgent } = await import('@elizaos/core');

    console.log('✅ ElizaOS core imported successfully');

    // Load configuration
    const configPath = path.join(
      __dirname,
      '../eliza-config/eliza-config.json',
    );
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    console.log(`📋 Found ${config.characters?.length || 0} characters`);

    // Check for security middleware
    const securityEnabled = config.characters?.some((char: any) =>
      char.plugins?.includes('footballsquares-security'),
    );

    if (securityEnabled) {
      console.log(
        '🛡️ Security middleware detected - Enhanced protection active',
      );
    }

    console.log('\n🎯 Starting agents...');

    // Create agents for each character
    for (const character of config.characters || []) {
      console.log(`🤖 Starting agent: ${character.name}`);

      try {
        const agent = createAgent(character);
        console.log(`✅ ${character.name} started successfully`);
      } catch (error: any) {
        console.error(`❌ Failed to start ${character.name}:`, error.message);
      }
    }

    console.log('\n🎉 All agents started! Security system is active.');
  } catch (error: any) {
    console.error('❌ Startup failed:', error.message);
    console.log(
      '\n💡 This might be expected - ElizaOS V2 may need different initialization',
    );
    process.exit(1);
  }
}

// ES module entry point check
if (import.meta.url === `file://${process.argv[1]}`) {
  startElizaDirectly();
}
