// Test Notion Integration
// Run this to verify your Notion setup is working

const {
  testNotionIntegration,
  NotionService,
} = require('../lib/cbl/notionService');

async function testNotionSetup() {
  console.log('🧪 Testing Notion Integration...\n');

  // Test 1: Connection
  console.log('1. Testing connection...');
  const connectionTest = await testNotionIntegration();
  console.log(
    `   ${connectionTest.connected ? '✅' : '❌'} ${connectionTest.message}\n`,
  );

  if (!connectionTest.connected) {
    console.log('❌ Connection failed. Please check:');
    console.log('   - NOTION_TOKEN is set in .env.local');
    console.log('   - Integration has access to your pages');
    return;
  }

  // Test 2: Page Access
  console.log('2. Testing page access...');
  const notionService = new NotionService();

  const pagesToTest = [
    { name: 'Telegram Playbook', id: '2417aef1c5a880bcb342d065297be7e6' },
    { name: 'Pricing Psychology', id: '2417aef1c5a880f7aa57d31532c671bb' },
  ];

  for (const page of pagesToTest) {
    try {
      const pageData = await notionService.getPageContent(page.id);
      if (pageData) {
        console.log(`   ✅ ${page.name}: "${pageData.title}"`);
        if (pageData.content) {
          console.log(
            `      📄 Content: ${pageData.content.substring(0, 100)}...`,
          );
        }
      } else {
        console.log(`   ❌ ${page.name}: Failed to fetch`);
        console.log(
          `      🔧 Make sure page is shared with "OC Phil CBL Tips" integration`,
        );
      }
    } catch (error) {
      console.log(`   ❌ ${page.name}: Error - ${error}`);
    }
  }

  console.log('\n🎯 Next Steps:');
  console.log(
    '   1. If pages failed, share them with your integration in Notion',
  );
  console.log('   2. Add content to your Notion pages');
  console.log('   3. Test OC Phil /tips command in Telegram');
  console.log('\n✅ Integration setup complete!');
}

// Run the test
testNotionSetup().catch(console.error);
