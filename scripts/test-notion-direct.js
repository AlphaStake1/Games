// Direct Notion Integration Test
const fs = require('fs');

console.log('🧪 Testing Notion Integration...\n');

// Load environment variables manually from .env.local
let NOTION_TOKEN = '';
let NOTION_VERSION = '2022-06-28';

try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  console.log('Raw .env.local content:');
  console.log(envFile);
  console.log('---\n');

  const lines = envFile.split('\n');
  for (const line of lines) {
    if (line.includes('NOTION_TOKEN=')) {
      NOTION_TOKEN = line.split('NOTION_TOKEN=')[1]?.trim();
    }
    if (line.includes('NOTION_VERSION=')) {
      NOTION_VERSION = line.split('NOTION_VERSION=')[1]?.trim();
    }
  }
} catch (error) {
  console.log('❌ Could not load .env.local file:', error.message);
  process.exit(1);
}

console.log('1. Checking environment variables...');
console.log('   NOTION_TOKEN:', NOTION_TOKEN ? 'Found ✅' : 'Missing ❌');
console.log('   NOTION_VERSION:', NOTION_VERSION);
console.log('   Token length:', NOTION_TOKEN ? NOTION_TOKEN.length : 0);

if (!NOTION_TOKEN) {
  console.log('\n❌ NOTION_TOKEN not found. Please fix .env.local format:');
  console.log('Remove any leading spaces and ensure format is exactly:');
  console.log('NOTION_TOKEN=your_notion_token_here');
  console.log('NOTION_VERSION=2022-06-28');
  process.exit(1);
}

// Test Notion API connection
async function testNotionAPI() {
  console.log('\n2. Testing Notion API connection...');

  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': NOTION_VERSION,
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log('   ✅ Connection successful!');
      console.log(`   👤 Integration type: ${user.type || 'bot'}`);

      // Test page access
      await testPageAccess();
    } else {
      const error = await response.text();
      console.log(
        '   ❌ Connection failed:',
        response.status,
        response.statusText,
      );
      console.log('   Error details:', error);

      if (response.status === 401) {
        console.log('   🔧 Check: Is your integration token correct?');
      }
    }
  } catch (error) {
    console.log('   ❌ Network error:', error.message);
  }
}

async function testPageAccess() {
  console.log('\n3. Testing page access...');

  const testPages = [
    { name: 'Telegram Playbook', id: '2417aef1c5a880bcb342d065297be7e6' },
    { name: 'Pricing Psychology', id: '2417aef1c5a880f7aa57d31532c671bb' },
  ];

  for (const page of testPages) {
    try {
      const response = await fetch(
        `https://api.notion.com/v1/pages/${page.id}`,
        {
          headers: {
            Authorization: `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': NOTION_VERSION,
          },
        },
      );

      if (response.ok) {
        const pageData = await response.json();
        const title =
          pageData.properties?.title?.title?.[0]?.plain_text ||
          pageData.properties?.Name?.title?.[0]?.plain_text ||
          'Untitled';
        console.log(`   ✅ ${page.name}: "${title}"`);
      } else {
        console.log(
          `   ❌ ${page.name}: ${response.status} ${response.statusText}`,
        );
        if (response.status === 404) {
          console.log(
            `      🔧 Page not found - make sure it's shared with "OC Phil CBL Tips" integration`,
          );
        }
      }
    } catch (error) {
      console.log(`   ❌ ${page.name}: Error - ${error.message}`);
    }
  }

  console.log('\n🎯 Next Steps:');
  console.log(
    '   1. If pages show 404, share them with your integration in Notion',
  );
  console.log('   2. Add content to your Notion pages');
  console.log('   3. Integration is ready for OC Phil bot!');
  console.log('\n✅ Notion integration test complete!');
}

// Run the test
testNotionAPI().catch(console.error);
