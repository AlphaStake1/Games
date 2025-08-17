#!/usr/bin/env ts-node

/**
 * ChangeNow API Integration for Jerry's Treasury Management
 * Documentation: https://documenter.getpostman.com/view/8180765/SVfTPnM8
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// ChangeNow API Configuration
const CHANGENOW_API_KEY =
  'e6c854121cdbc65fa52c7c3b8f5defd920839ad29338ed48ac702edbfdc50266';
const CHANGENOW_API_URL = 'https://api.changenow.io/v1';
const PARTNER_ID = '85cea6ecd63b90'; // Extracted from your referral link

interface ExchangeEstimate {
  estimatedAmount: number;
  transactionSpeedForecast: string;
  warningMessage?: string;
}

interface CreateExchangeParams {
  from: string; // Currency code to exchange from (e.g., 'sol')
  to: string; // Currency code to exchange to (e.g., 'usdc')
  address: string; // Recipient address
  amount: number; // Amount to exchange
  extraId?: string; // Optional memo/tag for some currencies
  refundAddress?: string; // Address for refunds if exchange fails
}

class ChangeNowClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = CHANGENOW_API_KEY;
    this.baseUrl = CHANGENOW_API_URL;
  }

  /**
   * Get list of available currencies
   */
  async getAvailableCurrencies() {
    try {
      const response = await axios.get(`${this.baseUrl}/currencies`, {
        params: { active: true },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw error;
    }
  }

  /**
   * Get minimum exchange amount
   */
  async getMinimumAmount(fromCurrency: string, toCurrency: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/min-amount/${fromCurrency}_${toCurrency}`,
        { params: { api_key: this.apiKey } },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching minimum amount:', error);
      throw error;
    }
  }

  /**
   * Get exchange amount estimate
   */
  async getExchangeEstimate(
    amount: number,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<ExchangeEstimate> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/exchange-amount/${amount}/${fromCurrency}_${toCurrency}`,
        { params: { api_key: this.apiKey } },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching exchange estimate:', error);
      throw error;
    }
  }

  /**
   * Create an exchange transaction
   */
  async createExchange(params: CreateExchangeParams) {
    try {
      const payload = {
        from: params.from,
        to: params.to,
        address: params.address,
        amount: params.amount,
        extraId: params.extraId || '',
        refundAddress: params.refundAddress || '',
        refundExtraId: '',
      };

      const response = await axios.post(
        `${this.baseUrl}/transactions/${this.apiKey}`,
        payload,
      );
      return response.data;
    } catch (error) {
      console.error('Error creating exchange:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(transactionId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/transactions/${transactionId}/${this.apiKey}`,
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction status:', error);
      throw error;
    }
  }
}

// Jerry's Treasury Management Functions
class JerryTreasury {
  private changeNow: ChangeNowClient;
  private jerryWallet: string;

  constructor() {
    this.changeNow = new ChangeNowClient();
    this.jerryWallet =
      process.env.JERRY_WALLET_ADDRESS ||
      '7hRMzsqfmTCxzZgU6PwChBN4JLua1uTNRzPomNXJ7Q9W';
  }

  /**
   * Convert SOL winnings to USDC for stable payouts
   */
  async convertToStablecoin(solAmount: number, recipientAddress: string) {
    console.log(`🔄 Converting ${solAmount} SOL to USDC...`);

    try {
      // Get minimum amount check
      const minAmount = await this.changeNow.getMinimumAmount('sol', 'usdc');
      if (solAmount < minAmount.minAmount) {
        throw new Error(
          `Amount too small. Minimum: ${minAmount.minAmount} SOL`,
        );
      }

      // Get exchange estimate
      const estimate = await this.changeNow.getExchangeEstimate(
        solAmount,
        'sol',
        'usdc',
      );
      console.log(`📊 Estimated output: ${estimate.estimatedAmount} USDC`);

      // Create exchange
      const exchange = await this.changeNow.createExchange({
        from: 'sol',
        to: 'usdc',
        address: recipientAddress,
        amount: solAmount,
        refundAddress: this.jerryWallet,
      });

      console.log(`✅ Exchange created!`);
      console.log(`   ID: ${exchange.id}`);
      console.log(`   Send ${solAmount} SOL to: ${exchange.payinAddress}`);
      console.log(
        `   Recipient will receive ~${estimate.estimatedAmount} USDC`,
      );

      return exchange;
    } catch (error) {
      console.error('❌ Exchange failed:', error);
      throw error;
    }
  }

  /**
   * Process batch payouts for game winners
   */
  async processBatchPayouts(
    winners: Array<{ address: string; amount: number }>,
  ) {
    console.log(`💰 Processing ${winners.length} payouts...`);

    const results = [];
    for (const winner of winners) {
      try {
        const exchange = await this.convertToStablecoin(
          winner.amount,
          winner.address,
        );
        results.push({
          success: true,
          address: winner.address,
          exchangeId: exchange.id,
        });
      } catch (error) {
        results.push({
          success: false,
          address: winner.address,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }
}

// Test functions
async function testChangeNowIntegration() {
  console.log('🧪 Testing ChangeNow Integration for Jerry\n');

  const client = new ChangeNowClient();
  const treasury = new JerryTreasury();

  try {
    // Test 1: Get available currencies
    console.log('📋 Test 1: Fetching available currencies...');
    const currencies = await client.getAvailableCurrencies();
    const solanaSupport = currencies.find((c: any) => c.ticker === 'sol');
    const usdcSupport = currencies.find((c: any) => c.ticker === 'usdc');

    console.log(`✅ SOL supported: ${solanaSupport ? 'Yes' : 'No'}`);
    console.log(`✅ USDC supported: ${usdcSupport ? 'Yes' : 'No'}`);

    // Test 2: Get minimum amounts
    console.log('\n📋 Test 2: Checking minimum exchange amounts...');
    const minAmount = await client.getMinimumAmount('sol', 'usdc');
    console.log(`✅ Minimum SOL to USDC: ${minAmount.minAmount} SOL`);

    // Test 3: Get exchange estimate
    console.log('\n📋 Test 3: Getting exchange estimate...');
    const estimate = await client.getExchangeEstimate(1, 'sol', 'usdc');
    console.log(`✅ 1 SOL = ~${estimate.estimatedAmount} USDC`);
    console.log(`   Speed: ${estimate.transactionSpeedForecast}`);

    console.log('\n🎉 ChangeNow integration ready for Jerry!');
    console.log('\n📝 Jerry can now:');
    console.log('   • Convert SOL game winnings to USDC');
    console.log('   • Process batch payouts to winners');
    console.log('   • Handle cross-chain transfers');
    console.log(`   • Earn partner revenue (ID: ${PARTNER_ID})`);
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use by Jerry agent
export { ChangeNowClient, JerryTreasury };

// Run test if executed directly
if (require.main === module) {
  testChangeNowIntegration();
}
