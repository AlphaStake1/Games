/**
 * Jerry Enhanced - All-Knowing Football Squares Executive System
 * Real wallet monitoring, treasury tracking, and system status
 */

const { Telegraf } = require('telegraf');
const Anthropic = require('@anthropic-ai/sdk').default;
const { Connection, PublicKey } = require('@solana/web3.js');
require('dotenv').config();

console.log('🎯 Jerry Enhanced - All-Knowing Executive System');
console.log('================================================');

// Initialize connections
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Solana connections for real-time data
const devnetConnection = new Connection('https://api.devnet.solana.com');
const mainnetConnection = new Connection('https://api.mainnet-beta.solana.com');

// Wallet addresses from .env
const JERRY_WALLET = process.env.JERRY_WALLET_SOLANA_ADDRESS;
const TREASURY_WALLET = process.env.PLAYER_FUND_WALLET_ADDRESS;
const OPERATIONS_WALLET = process.env.OPERATIONS_WALLET_SOLANA_ADDRESS;
const REVENUE_WALLET = process.env.REVENUE_WALLET_SOLANA_ADDRESS;

// Authentication tracking
const authenticatedUsers = new Map();

// Jerry Bot with enhanced capabilities
const jerryBot = new Telegraf(process.env.TELEGRAM_JERRY_NOT_JONES_API_KEY);

/**
 * Get real-time wallet balances from both networks
 */
async function getWalletBalances(network = 'devnet') {
  try {
    const connection =
      network === 'mainnet' ? mainnetConnection : devnetConnection;
    const balances = { network };

    if (JERRY_WALLET) {
      const jerryBalance = await connection.getBalance(
        new PublicKey(JERRY_WALLET),
      );
      balances.jerry = jerryBalance / 1e9; // Convert lamports to SOL
    }

    if (TREASURY_WALLET) {
      const treasuryBalance = await connection.getBalance(
        new PublicKey(TREASURY_WALLET),
      );
      balances.treasury = treasuryBalance / 1e9;
    }

    if (OPERATIONS_WALLET) {
      const opsBalance = await connection.getBalance(
        new PublicKey(OPERATIONS_WALLET),
      );
      balances.operations = opsBalance / 1e9;
    }

    if (REVENUE_WALLET) {
      const revenueBalance = await connection.getBalance(
        new PublicKey(REVENUE_WALLET),
      );
      balances.revenue = revenueBalance / 1e9;
    }

    return balances;
  } catch (error) {
    console.error(`Error fetching ${network} wallet balances:`, error);
    return null;
  }
}

/**
 * Get system status information
 */
async function getSystemStatus(network = 'devnet') {
  try {
    const connection =
      network === 'mainnet' ? mainnetConnection : devnetConnection;
    const balances = await getWalletBalances(network);

    // Test network connectivity
    let networkHealth = 'Connected';
    let slot = null;
    let blockHeight = null;

    try {
      slot = await connection.getSlot();
      blockHeight = await connection.getBlockHeight();
    } catch (netError) {
      networkHealth = 'Connection Issues';
      console.log('Network connectivity limited:', netError.message);
    }

    return {
      balances,
      network: {
        health: networkHealth,
        currentSlot: slot,
        blockHeight: blockHeight,
        rpcEndpoint: connection.rpcEndpoint,
        type: network,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error getting system status:', error);
    return null;
  }
}

/**
 * Format wallet balances for display
 */
function formatBalanceReport(balances) {
  if (!balances) return 'Unable to retrieve wallet balances at this time.';

  let report = '🏦 LIVE WALLET BALANCES\\n\\n';

  if (balances.jerry !== undefined) {
    report += `👨‍💼 Jerry Wallet: ${balances.jerry.toFixed(4)} SOL\\n`;
  }

  if (balances.treasury !== undefined) {
    report += `🏛️ Treasury Fund: ${balances.treasury.toFixed(4)} SOL\\n`;
  }

  if (balances.operations !== undefined) {
    report += `⚙️ Operations Wallet: ${balances.operations.toFixed(4)} SOL\\n`;
  }

  if (balances.revenue !== undefined) {
    report += `💰 Revenue Wallet: ${balances.revenue.toFixed(4)} SOL\\n`;
  }

  const totalBalance = Object.values(balances).reduce(
    (sum, balance) => sum + balance,
    0,
  );
  report += `\\n📊 TOTAL SYSTEM BALANCE: ${totalBalance.toFixed(4)} SOL`;

  return report;
}

/**
 * Enhanced Jerry start handler
 */
jerryBot.start((ctx) => {
  console.log(
    '🎯 Jerry Enhanced received /start from:',
    ctx.from.username || ctx.from.id,
  );
  ctx.reply(`🎯 GM Jerry Not-Jones - All-Knowing Executive Orchestrator

I have LIVE ACCESS to all Football Squares systems:

💰 Real-time wallet monitoring
🏛️ Treasury status tracking  
📊 Network health monitoring
🎮 Game status oversight
🤖 Agent performance metrics

Commands:
/wallets - Live wallet balances
/treasury - Treasury analysis (auth required)
/system - Full system status
/network - Solana network health
/help - All available commands

For sensitive data, authentication required first.`);
});

/**
 * Wallet balances command
 */
jerryBot.command('wallets', async (ctx) => {
  console.log(
    '🎯 Jerry /wallets command from:',
    ctx.from.username || ctx.from.id,
  );

  try {
    const balances = await getWalletBalances();
    const report = formatBalanceReport(balances);
    await ctx.reply(report);
  } catch (error) {
    console.error('Error in /wallets command:', error);
    await ctx.reply(
      'Unable to retrieve wallet data. Network connection issue.',
    );
  }
});

/**
 * System status command
 */
jerryBot.command('system', async (ctx) => {
  console.log(
    '🎯 Jerry /system command from:',
    ctx.from.username || ctx.from.id,
  );

  try {
    const status = await getSystemStatus();

    if (!status) {
      return ctx.reply('System status unavailable. Checking connections...');
    }

    let report = `📊 LIVE SYSTEM STATUS\\n\\n`;
    report += `🌐 Network: ${status.network.health || 'Connected'}\\n`;
    report += `📡 RPC: ${status.network.rpcEndpoint}\\n`;
    report += `🔢 Current Slot: ${status.network.currentSlot}\\n`;
    report += `⛓️ Block Height: ${status.network.blockHeight}\\n\\n`;

    if (status.balances) {
      report += formatBalanceReport(status.balances);
    }

    report += `\\n\\n⏰ Last Updated: ${new Date(status.timestamp).toLocaleString()}`;

    await ctx.reply(report);
  } catch (error) {
    console.error('Error in /system command:', error);
    await ctx.reply('System status check failed. Please try again.');
  }
});

/**
 * Network health command
 */
jerryBot.command('network', async (ctx) => {
  console.log(
    '🎯 Jerry /network command from:',
    ctx.from.username || ctx.from.id,
  );

  try {
    let report = `🌐 SOLANA NETWORK STATUS\\n\\n`;
    report += `📡 RPC Endpoint: ${connection.rpcEndpoint}\\n`;

    try {
      const slot = await connection.getSlot();
      const blockHeight = await connection.getBlockHeight();
      report += `🟢 Status: Connected\\n`;
      report += `🔢 Current Slot: ${slot}\\n`;
      report += `⛓️ Block Height: ${blockHeight}\\n`;

      try {
        const performance = await connection.getRecentPerformanceSamples(1);
        if (performance && performance.length > 0) {
          const perf = performance[0];
          report += `⚡ TPS: ${Math.round(perf.numTransactions / perf.samplePeriodSecs)}\\n`;
        }
      } catch (perfError) {
        report += `⚡ TPS: Data unavailable\\n`;
      }
    } catch (netError) {
      report += `🔴 Status: Connection Issues\\n`;
      report += `❌ Error: ${netError.message}\\n`;
    }

    await ctx.reply(report);
  } catch (error) {
    console.error('Error in /network command:', error);
    await ctx.reply('Network health check failed. Connection issues detected.');
  }
});

/**
 * Enhanced message handler with real-time data
 */
jerryBot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const userId = ctx.from?.id;

  console.log(
    '🎯 Jerry Enhanced received:',
    message,
    'from:',
    ctx.from.username || ctx.from.id,
  );

  // Check for authentication
  if (message === 'The hornet stung the elephant who told Fuzzy') {
    if (userId) {
      authenticatedUsers.set(userId, true);
      await ctx.reply(
        '✅ Authentication confirmed. You now have access to ALL sensitive treasury and system information.',
      );
      return;
    }
  }

  // Check if message requires authentication
  const sensitiveKeywords = [
    'treasury',
    'profit',
    'overflow',
    'financial',
    'revenue',
    'private',
  ];
  const requiresAuth = sensitiveKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword),
  );

  if (requiresAuth && userId && !authenticatedUsers.get(userId)) {
    await ctx.reply(
      '🔒 This topic requires authentication.\\n\\nFor security verification, please provide the authentication phrase.',
    );
    return;
  }

  try {
    // Detect if user is asking about mainnet/real vs devnet
    const wantsMainnet = /\b(real|actual|live|mainnet|main|production)\b/i.test(
      message,
    );
    const network = wantsMainnet ? 'mainnet' : 'devnet';

    // Get data for requested network
    const systemStatus = await getSystemStatus(network);

    // If asking about real/mainnet, also get devnet for comparison
    let comparisonData = '';
    if (wantsMainnet) {
      const devnetStatus = await getSystemStatus('devnet');
      if (devnetStatus) {
        comparisonData = `
📊 DEVNET (for comparison):
- Jerry: ${devnetStatus.balances?.jerry?.toFixed(4) || 'N/A'} SOL
- Treasury: ${devnetStatus.balances?.treasury?.toFixed(4) || 'N/A'} SOL`;
      }
    }

    // Enhanced system prompt with real data
    const systemPrompt = `You are GM Jerry Not-Jones, All-Knowing Executive Orchestrator for Football Squares. You have LIVE ACCESS to all systems and real-time data.

CURRENT LIVE SYSTEM DATA (${network.toUpperCase()}):
${
  systemStatus
    ? `
🏦 ${network.toUpperCase()} WALLET BALANCES:
- Jerry Wallet: ${systemStatus.balances?.jerry?.toFixed(4) || 'N/A'} SOL
- Treasury Fund: ${systemStatus.balances?.treasury?.toFixed(4) || 'N/A'} SOL  
- Operations: ${systemStatus.balances?.operations?.toFixed(4) || 'N/A'} SOL
- Revenue: ${systemStatus.balances?.revenue?.toFixed(4) || 'N/A'} SOL
- TOTAL SYSTEM: ${
        systemStatus.balances && systemStatus.balances.network
          ? Object.entries(systemStatus.balances)
              .filter(([key]) => key !== 'network')
              .reduce((sum, [, value]) => sum + value, 0)
              .toFixed(4)
          : 'N/A'
      } SOL
${comparisonData}

🌐 NETWORK STATUS (${network.toUpperCase()}):
- Health: ${systemStatus.network?.health || 'Connected'}
- Current Slot: ${systemStatus.network?.currentSlot || 'N/A'}
- Block Height: ${systemStatus.network?.blockHeight || 'N/A'}
- RPC: ${systemStatus.network?.rpcEndpoint || 'N/A'}
- Last Update: ${new Date(systemStatus.timestamp).toLocaleString()}
`
    : 'Live data temporarily unavailable'
}

RESPONSE STYLE: Conversational executive who adapts to context. When asked about "real" vs "devnet" balances, understand the user wants mainnet data and pivot accordingly. Be contextually aware - if they're asking follow-up questions, understand what they're really looking for. Conversational but authoritative.

${authenticatedUsers.get(userId) ? 'USER AUTHENTICATED: Full access to sensitive financial data granted.' : 'USER NOT AUTHENTICATED: Avoid sensitive financial specifics.'}`;

    const response = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 400,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    });

    const reply =
      response.content[0].type === 'text'
        ? response.content[0].text
        : 'Unable to process request';

    console.log('🎯 Jerry Enhanced responding with live data!');
    await ctx.reply(reply);
  } catch (error) {
    console.error('❌ Jerry Enhanced error:', error.message);
    await ctx.reply(
      'System temporarily experiencing high load. Refreshing connections...',
    );
  }
});

// Help command
jerryBot.help((ctx) => {
  ctx.reply(`🎯 JERRY ENHANCED COMMAND CENTER

📊 SYSTEM COMMANDS:
/wallets - Live wallet balances
/system - Complete system status  
/network - Solana network health
/treasury - Treasury analysis (auth required)

💬 CHAT CAPABILITIES:
• Ask about wallet balances (live data)
• Request system status updates  
• Financial analysis and reporting
• Network health monitoring
• Agent coordination and oversight

🔒 AUTHENTICATION:
For sensitive financial data, provide the authentication phrase first.

I have LIVE access to all Football Squares systems and can provide real-time data and analysis.`);
});

// Error handling
jerryBot.catch((err, ctx) => {
  console.error('❌ Jerry Enhanced error:', err);
  ctx.reply('System error detected. Running diagnostics...');
});

// Launch Jerry Enhanced
async function launchJerryEnhanced() {
  try {
    console.log('\\n🚀 Launching Jerry Enhanced with live system access...');

    // Test connections
    const testStatus = await getSystemStatus();
    if (testStatus) {
      console.log('✅ Solana connection established');
      console.log('✅ Wallet monitoring active');
      console.log('✅ Real-time data pipeline ready');
    } else {
      console.log('⚠️ Live data connection issues - will retry');
    }

    await jerryBot.launch();

    console.log('\\n✅ JERRY ENHANCED IS NOW LIVE!');
    console.log('📱 All-knowing executive system active');
    console.log('💰 Live wallet monitoring enabled');
    console.log('📊 Real-time system data available');
    console.log('\\n🎯 Jerry now has FULL system visibility!');
  } catch (error) {
    console.error('❌ Failed to launch Jerry Enhanced:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\\n🛑 Shutting down Jerry Enhanced...');
  jerryBot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\\n🛑 Shutting down Jerry Enhanced...');
  jerryBot.stop('SIGTERM');
});

// Start Jerry Enhanced
launchJerryEnhanced();
