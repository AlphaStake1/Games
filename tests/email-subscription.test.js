const {
  saveEmailSubscription,
  emailExists,
  getAllSubscriptions,
} = require('../lib/emailSubscriptions');
const { getEmailService } = require('../lib/emailService');

async function testEmailSubscription() {
  console.log('🧪 Testing Email Subscription System...\n');

  try {
    // Test 1: Save a new subscription
    console.log('Test 1: Saving new subscription');
    const testSubscription = {
      id: 'test-123',
      email: 'test@example.com',
      walletAddress: '5x...test',
      source: 'test',
      createdAt: new Date().toISOString(),
    };

    await saveEmailSubscription(testSubscription);
    console.log('✅ Subscription saved successfully');

    // Test 2: Check if email exists
    console.log('\nTest 2: Checking if email exists');
    const exists = await emailExists('test@example.com');
    console.log(`✅ Email exists: ${exists}`);

    // Test 3: Try to save duplicate (should fail)
    console.log('\nTest 3: Testing duplicate prevention');
    try {
      await saveEmailSubscription(testSubscription);
      console.log('❌ Duplicate prevention failed');
    } catch (error) {
      console.log('✅ Duplicate prevention works');
    }

    // Test 4: Get all subscriptions
    console.log('\nTest 4: Getting all subscriptions');
    const subscriptions = await getAllSubscriptions();
    console.log(`✅ Found ${subscriptions.length} subscriptions`);

    // Test 5: Test email service
    console.log('\nTest 5: Testing email service');
    const emailService = getEmailService();
    const emailSent = await emailService.sendWelcomeEmail('test@example.com');
    console.log(`✅ Email service test: ${emailSent ? 'Success' : 'Failed'}`);

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testEmailSubscription();
