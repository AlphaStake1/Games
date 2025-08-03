#!/usr/bin/env ts-node
/**
 * ElizaOS V2 Startup Script with Security Integration
 * Starts ElizaOS server and loads characters with security middleware
 */

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ELIZA_CONFIG_PATH = path.join(
  __dirname,
  '../eliza-config/eliza-config.json',
);
const PORT = process.env.PORT || 3000;

async function startElizaV2() {
  console.log('🚀 Starting ElizaOS V2 with Security Enhancement...\n');

  // Verify configuration exists
  if (!fs.existsSync(ELIZA_CONFIG_PATH)) {
    console.error('❌ ElizaOS configuration not found at:', ELIZA_CONFIG_PATH);
    process.exit(1);
  }

  // Load and verify configuration
  try {
    const config = JSON.parse(fs.readFileSync(ELIZA_CONFIG_PATH, 'utf8'));
    console.log('✅ Configuration loaded successfully');
    console.log(
      `📋 Found ${config.characters?.length || 0} characters configured`,
    );

    // Check for security plugin integration
    const securityEnabled = config.characters?.some((char: any) =>
      char.plugins?.includes('footballsquares-security'),
    );

    if (securityEnabled) {
      console.log(
        '🛡️ Security middleware detected - Enhanced protection active',
      );
    } else {
      console.log(
        '⚠️ Security middleware not found - Consider running security injection',
      );
    }
  } catch (error: any) {
    console.error('❌ Configuration file is invalid:', error.message);
    process.exit(1);
  }

  console.log('\n🎯 Starting ElizaOS V2 server...');
  console.log(`📡 Server will be available at: http://localhost:${PORT}`);
  console.log('🔗 API endpoints:');
  console.log(`   - Health: http://localhost:${PORT}/api/health`);
  console.log(`   - Agents: http://localhost:${PORT}/api/agents`);
  console.log('\n📝 Logs will appear below:\n');

  // Start ElizaOS V2 using the core package
  const elizaPath = path.join(
    __dirname,
    '../node_modules/@elizaos/core/dist/index.js',
  );

  if (!fs.existsSync(elizaPath)) {
    console.error('❌ ElizaOS core not found. Please install @elizaos/core');
    console.log('💡 Run: pnpm install @elizaos/core');
    process.exit(1);
  }

  const elizaProcess = spawn(
    'node',
    [elizaPath, '--characters', ELIZA_CONFIG_PATH, '--port', PORT.toString()],
    {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || 'development',
        LOG_LEVEL: process.env.LOG_LEVEL || 'info',
      },
    },
  );

  elizaProcess.on('error', (error) => {
    console.error('❌ Failed to start ElizaOS:', error.message);
    process.exit(1);
  });

  elizaProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`❌ ElizaOS exited with code ${code}`);
      process.exit(code);
    }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down ElizaOS...');
    elizaProcess.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down ElizaOS...');
    elizaProcess.kill('SIGTERM');
  });
}

// ES module entry point check
if (import.meta.url === `file://${process.argv[1]}`) {
  startElizaV2().catch((error) => {
    console.error('❌ Startup failed:', error.message);
    process.exit(1);
  });
}

export default startElizaV2;
