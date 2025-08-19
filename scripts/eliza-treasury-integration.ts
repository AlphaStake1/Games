/**
 * ElizaOS Treasury Integration
 * Connects ElizaOS agents with Treasury Agent for autonomous fund management
 */

import { TreasuryAgent, AccountType } from './treasury-agent.js';
import { CGPTTokenManager } from './cgpt-token-manager.js';
import { ChainGPTNFTGenerator } from './chaingpt-nft-generator.js';

interface ElizaTreasuryConfig {
  masterPrivateKey: string;
  cgptTokenAddress: string;
  chaingptApiKey: string;
  chaingptBaseUrl: string;
  autonomousLimits: {
    maxDailyCGPT: number;
    maxWeeklyCGPT: number;
    requireApprovalAbove: number;
  };
}

class ElizaTreasuryIntegration {
  private treasury: TreasuryAgent;
  private cgptManager: CGPTTokenManager;
  private nftGenerator: ChainGPTNFTGenerator;
  private config: ElizaTreasuryConfig;
  private dailyUsage: { cgpt: number; sol: number } = { cgpt: 0, sol: 0 };

  constructor(config: ElizaTreasuryConfig) {
    this.config = config;
    this.treasury = new TreasuryAgent(
      config.masterPrivateKey,
      config.cgptTokenAddress,
    );

    this.cgptManager = new CGPTTokenManager(
      config.chaingptApiKey,
      config.chaingptBaseUrl,
      {
        tokenAddress: config.cgptTokenAddress,
        paymentMethod: 'cgt_token',
        autoPurchaseThreshold: 10,
        maxAutoPurchase: config.autonomousLimits.maxDailyCGPT,
        purchaseAmount: 100,
      },
    );

    this.nftGenerator = new ChainGPTNFTGenerator({
      apiKey: config.chaingptApiKey,
      baseUrl: config.chaingptBaseUrl,
    });
  }

  /**
   * ElizaOS Agent: Process player buy-in
   */
  async elizaProcessBuyIn(
    playerAddress: string,
    amount: number,
    gameId: string,
  ): Promise<{ success: boolean; txSignature: string; message: string }> {
    try {
      console.log(`🤖 ElizaOS: Processing buy-in for player ${playerAddress}`);

      const txSignature = await this.treasury.handlePlayerBuyIn(
        playerAddress,
        amount,
        gameId,
      );

      // Automatically collect platform fee (5%)
      const platformFee = amount * 0.05;
      await this.treasury.collectPlatformFee(gameId, platformFee);

      return {
        success: true,
        txSignature,
        message: `Buy-in processed: ${amount} SOL received, ${platformFee} SOL platform fee collected`,
      };
    } catch (error) {
      console.error('❌ Buy-in processing failed:', error);
      return {
        success: false,
        txSignature: '',
        message: error.message,
      };
    }
  }

  /**
   * ElizaOS Agent: Process player payout
   */
  async elizaProcessPayout(
    playerAddress: string,
    amount: number,
    gameId: string,
  ): Promise<{ success: boolean; txSignature: string; message: string }> {
    try {
      console.log(`🤖 ElizaOS: Processing payout for player ${playerAddress}`);

      // Check treasury health before payout
      const report = await this.treasury.generateTreasuryReport();

      if (!report.health_metrics.player_funds_secure) {
        throw new Error('Player funds account issue - manual review required');
      }

      const txSignature = await this.treasury.handlePlayerPayout(
        playerAddress,
        amount,
        gameId,
      );

      return {
        success: true,
        txSignature,
        message: `Payout processed: ${amount} SOL sent to ${playerAddress}`,
      };
    } catch (error) {
      console.error('❌ Payout processing failed:', error);
      return {
        success: false,
        txSignature: '',
        message: error.message,
      };
    }
  }

  /**
   * ElizaOS Agent: Generate House NFTs with autonomous credit management
   */
  async elizaGenerateHouseNFTs(count: number = 10): Promise<{
    success: boolean;
    nftsGenerated: number;
    cgptUsed: number;
    message: string;
  }> {
    try {
      console.log(`🤖 ElizaOS: Generating ${count} House NFTs...`);

      // Check daily limits
      if (this.dailyUsage.cgpt >= this.config.autonomousLimits.maxDailyCGPT) {
        throw new Error('Daily CGPT spending limit reached');
      }

      // Get operations account address for CGPT payments
      const operationsAddress = this.treasury.getAccountAddress(
        AccountType.OPERATIONS,
      );

      // Check and ensure sufficient credits
      const creditReport = await this.cgptManager.getCreditReport();
      const creditsNeeded = count * 3; // Estimated 3 credits per NFT

      console.log(`📊 Credit Analysis:
        Current Credits: ${creditReport.credits.current}
        Free Remaining: ${creditReport.credits.free_remaining}
        Credits Needed: ${creditsNeeded}
      `);

      // If insufficient credits, purchase using CGPT from operations account
      if (
        creditReport.credits.current + creditReport.credits.free_remaining <
        creditsNeeded
      ) {
        const cgptNeeded = Math.ceil(creditsNeeded / 25); // 25 credits per CGPT token

        // Check if purchase would exceed limits
        if (
          this.dailyUsage.cgpt + cgptNeeded >
          this.config.autonomousLimits.maxDailyCGPT
        ) {
          const remaining =
            this.config.autonomousLimits.maxDailyCGPT - this.dailyUsage.cgpt;
          throw new Error(
            `Would exceed daily limit. Can only spend ${remaining} more CGPT today`,
          );
        }

        // Purchase credits from operations account
        const purchased =
          await this.treasury.purchaseChainGPTCredits(cgptNeeded);

        if (purchased) {
          this.dailyUsage.cgpt += cgptNeeded;
          console.log(`✅ Purchased ${cgptNeeded} CGPT for credits`);
        }
      }

      // Generate NFTs
      const prompts = this.nftGenerator.generatePrompts();
      const allPrompts = [...prompts.mascots, ...prompts.food, ...prompts.crew];

      const results = await this.nftGenerator.generateWeeklyCollection(1);

      return {
        success: true,
        nftsGenerated: results.length,
        cgptUsed: this.dailyUsage.cgpt,
        message: `Successfully generated ${results.length} House NFTs`,
      };
    } catch (error) {
      console.error('❌ NFT generation failed:', error);
      return {
        success: false,
        nftsGenerated: 0,
        cgptUsed: this.dailyUsage.cgpt,
        message: error.message,
      };
    }
  }

  /**
   * ElizaOS Agent: Get comprehensive treasury status
   */
  async elizaGetTreasuryStatus(): Promise<any> {
    const report = await this.treasury.generateTreasuryReport();
    const dailySpending = this.treasury.getDailySpending();
    const creditReport = await this.cgptManager.getCreditReport();

    return {
      treasury: report,
      daily_spending: {
        ...dailySpending,
        cgpt_limit: this.config.autonomousLimits.maxDailyCGPT,
        cgpt_remaining:
          this.config.autonomousLimits.maxDailyCGPT - this.dailyUsage.cgpt,
      },
      credits: creditReport,
      recommendations: [
        ...report.recommendations,
        this.dailyUsage.cgpt > this.config.autonomousLimits.maxDailyCGPT * 0.8
          ? '⚠️ Approaching daily CGPT spending limit'
          : null,
        creditReport.credits.current < 50
          ? '⚠️ ChainGPT credits running low'
          : null,
      ].filter((r) => r !== null),
    };
  }

  /**
   * ElizaOS Agent: Perform daily treasury reconciliation
   */
  async elizaDailyReconciliation(): Promise<any> {
    console.log('🤖 ElizaOS: Performing daily treasury reconciliation...');

    const status = await this.elizaGetTreasuryStatus();

    // Reset daily usage at midnight
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() < 5) {
      this.dailyUsage = { cgpt: 0, sol: 0 };
      console.log('📅 Daily usage counters reset');
    }

    // Check for any issues requiring attention
    const issues = [];

    if (!status.treasury.health_metrics.segregation_maintained) {
      issues.push('🚨 CRITICAL: Fund segregation violation detected');
    }

    if (!status.treasury.health_metrics.reserve_adequate) {
      issues.push('⚠️ Reserve funds below minimum threshold');
    }

    if (!status.treasury.health_metrics.operations_funded) {
      issues.push('⚠️ Operations account needs CGPT funding');
    }

    return {
      timestamp: new Date().toISOString(),
      daily_summary: {
        player_activity: {
          buy_ins: status.treasury.recent_transactions.filter((tx) =>
            tx.purpose.includes('Buy-in'),
          ).length,
          payouts: status.treasury.recent_transactions.filter((tx) =>
            tx.purpose.includes('Payout'),
          ).length,
        },
        nft_operations: {
          cgpt_spent: this.dailyUsage.cgpt,
          credits_purchased: this.dailyUsage.cgpt * 25,
        },
        health_status: status.treasury.health_metrics,
        issues_requiring_attention: issues,
      },
      next_actions:
        issues.length > 0
          ? 'Manual review required for identified issues'
          : 'All systems operating normally',
    };
  }
}

// Default configuration template
const defaultElizaTreasuryConfig: ElizaTreasuryConfig = {
  masterPrivateKey: 'YOUR_PHANTOM_WALLET_PRIVATE_KEY',
  cgptTokenAddress: 'CCDfDXZxzZtkZLuhY48gyKdXc5KywqpR8xEVHHh8ck1G',
  chaingptApiKey: process.env.CHAINGPT_API_KEY || '',
  chaingptBaseUrl: 'https://api.chaingpt.org/v1',
  autonomousLimits: {
    maxDailyCGPT: 50,
    maxWeeklyCGPT: 200,
    requireApprovalAbove: 20,
  },
};

export {
  ElizaTreasuryIntegration,
  type ElizaTreasuryConfig,
  defaultElizaTreasuryConfig,
};
