import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Environment Check:');
console.log(
  'DATABASE_URL:',
  process.env.DATABASE_URL ? '✅ Set' : '❌ Missing',
);
console.log(
  'SOLANA_RPC_URL:',
  process.env.SOLANA_RPC_URL ? '✅ Set' : '❌ Missing',
);
console.log(
  'OPENAI_API_KEY:',
  process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Missing',
);

// Test just the required variables
const required = ['DATABASE_URL', 'OPENAI_API_KEY', 'SOLANA_RPC_URL'];
const missing = required.filter((key) => !process.env[key]);

if (missing.length === 0) {
  console.log('\n✅ All required variables are set!');
  console.log('\n🚀 Ready to test Eliza system startup');
} else {
  console.log('\n❌ Missing:', missing.join(', '));
}
