// Simple Calculator test without TypeScript complications
const { CalculatorAgent } = require('./index-simple.js');

console.log('🧮 Running Calculator Agent Tests...\n');

// First, let's test if the Calculator can be instantiated
try {
  const calculator = new CalculatorAgent();
  console.log('✅ Calculator instantiated successfully');

  // Test health check
  const healthResult = calculator.healthCheck();
  console.log(
    'Health check result:',
    healthResult.success ? '✅ PASS' : '❌ FAIL',
  );

  if (healthResult.success) {
    console.log('✅ All basic tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Health check failed:', healthResult.error);
    process.exit(1);
  }
} catch (error) {
  console.log('❌ Failed to instantiate Calculator:', error.message);
  process.exit(1);
}
