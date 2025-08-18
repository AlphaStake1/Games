#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

console.log('🚀 Football Squares - Quick Deploy for Testers\n');

// Get network interfaces
const interfaces = os.networkInterfaces();
let localIP = '127.0.0.1';

// Find the first non-internal IPv4 address
for (const name of Object.keys(interfaces)) {
  for (const iface of interfaces[name]) {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIP = iface.address;
      break;
    }
  }
  if (localIP !== '127.0.0.1') break;
}

console.log(`🌐 Your local IP: ${localIP}`);
console.log(`📱 Testers can access: http://${localIP}:3000`);
console.log('⚠️  Make sure your firewall allows port 3000\n');

// Start the Next.js dev server with external access
const devServer = spawn('pnpm', ['run', 'dev', '--', '--hostname', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
});

devServer.on('close', (code) => {
  console.log(`\n👋 Dev server stopped with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  devServer.kill();
  process.exit(0);
});

console.log('🏈 Starting Football Squares dev server...');
console.log('💫 Signature NFT onboarding is ready for testing!');
console.log('\n📋 Test scenarios:');
console.log('1. Connect wallet → See signature modal');
console.log('2. Enter name → Generate 9 signature styles');
console.log('3. Select style → Create signature NFT');
console.log('\nPress Ctrl+C to stop\n');
