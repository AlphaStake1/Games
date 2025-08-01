// Simple Notion Integration Test
require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Notion Integration...\n');

// Check environment variables
console.log('1. Checking environment variables...');
console.log(
  '   NOTION_TOKEN:',
  process.env.NOTION_TOKEN ? 'Found ✅' : 'Missing ❌',
);
console.log('   NOTION_VERSION:', process.env.NOTION_VERSION || 'Missing ❌');

if (!process.env.NOTION_TOKEN) {
  console.log('\n❌ NOTION_TOKEN not found. Please add to .env.local:');
  console.log('NOTION_TOKEN=your_notion_token_here');
  console.log('NOTION_VERSION=2022-06-28');
  console.log(
    '\nNote: Make sure there are NO SPACES before the variable names!',
  );
  process.exit(1);
}

// Test Notion API connection
async function testNotionAPI() {
  console.log('\n2. Testing Notion API connection...');

  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        'Notion-Version': process.env.NOTION_VERSION || '2022-06-28',
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log('   ✅ Connection successful!');
      console.log(
        `   👤 Connected as: ${user.name || user.type || 'Integration'}`,
      );

      // Test page access
      await testPageAccess();
    } else {
      const error = await response.text();
      console.log(
        '   ❌ Connection failed:',
        response.status,
        response.statusText,
      );
      console.log('   Error:', error);
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
            Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
            'Notion-Version': process.env.NOTION_VERSION || '2022-06-28',
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
            `      🔧 Make sure page is shared with "OC Phil CBL Tips" integration`,
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
  console.log('   3. Test OC Phil /tips command in Telegram');
  console.log('\n✅ Basic integration test complete!');
}

// Run the test
testNotionAPI().catch(console.error);
