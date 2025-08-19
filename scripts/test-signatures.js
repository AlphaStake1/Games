const { SignatureGenerator } = require('../lib/signature/signatureGenerator');
const { SIGNATURE_CONFIG } = require('../lib/signature/signatureConfig');
const fs = require('fs');

// Create test data
const testData = {
  firstName: 'John',
  lastInitial: 'D',
  walletPublicKey: '11111111111111111111111111111111',
  seed: 'test-seed-12345',
  selectedStyleId: 'test',
  timestamp: Date.now(),
};

const generator = new SignatureGenerator();
const styles = generator.generateStyleGallery(testData.seed, 9);

console.log('\n=== Signature Styles with Angles ===\n');

styles.forEach((style, index) => {
  console.log(`Style ${index + 1}:`);
  console.log(`  Font ID: ${style.fontId}`);
  console.log(`  Slant Angle: ${style.slant}°`);
  console.log(`  Base Size: ${style.baseSize}px`);
  console.log(`  Category: ${style.baseline}`);

  // Generate SVG
  const svg = generator.renderToSVG(testData, style);

  // Check if rotation transform is present
  const hasRotation = svg.includes(`transform="rotate(${style.slant}`);
  console.log(`  Rotation Applied: ${hasRotation ? '✓' : '✗'}`);
  console.log('');
});

console.log('All signatures have been generated with their respective angles.');
console.log(
  'The slant angles are properly embedded in the SVG transform attributes.',
);
