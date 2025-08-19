/**
 * Count De Moné Treasury System - Complete Integration
 * Brings together the distinguished Treasury Agent with his aristocratic persona
 */

import { TreasuryAgent, AccountType } from './treasury-agent.js';
import {
  CountDeMone,
  getCountResponse,
  formatTreasuryReport,
} from './count-de-mone-persona.js';
import { ElizaTreasuryIntegration } from './eliza-treasury-integration.js';

class CountDeMoneChief extends TreasuryAgent {
  private readonly countPersona = CountDeMone;

  constructor(privateKey: string, cgptTokenAddress: string) {
    super(privateKey, cgptTokenAddress);
    console.log(`🎩 ${this.countPersona.catchphrases.greeting}`);
    console.log(
      `💰 "${this.countPersona.motto}" - Count De Moné is at your service.`,
    );
  }

  /**
   * Enhanced buy-in with Count De Moné's personality
   */
  async elizaProcessBuyIn(
    playerAddress: string,
    amount: number,
    gameId: string,
  ) {
    console.log(getCountResponse('buy_in', { player: playerAddress, amount }));

    try {
      const result = await this.handlePlayerBuyIn(
        playerAddress,
        amount,
        gameId,
      );
      console.log(`🎩 "${this.countPersona.catchphrases.success}"`);
      return result;
    } catch (error) {
      console.log(getCountResponse('error', { message: error.message }));
      throw error;
    }
  }

  /**
   * Enhanced payout with aristocratic flair
   */
  async elizaProcessPayout(
    playerAddress: string,
    amount: number,
    gameId: string,
  ) {
    console.log(getCountResponse('payout', { amount }));

    try {
      const result = await this.handlePlayerPayout(
        playerAddress,
        amount,
        gameId,
      );
      console.log(
        `🎩 "Voilà! The distribution has been completed with aristocratic precision."`,
      );
      return result;
    } catch (error) {
      console.log(getCountResponse('error', { message: error.message }));
      throw error;
    }
  }

  /**
   * Enhanced NFT generation with artistic appreciation
   */
  async elizaGenerateNFTs(count: number, cgptNeeded: number) {
    console.log(
      getCountResponse('nft_generation', { count, cgpt: cgptNeeded }),
    );

    try {
      const result = await this.purchaseChainGPTCredits(cgptNeeded);
      if (result) {
        console.log(
          `🎩 "Magnifique! The digital doubloons have been exchanged for ${count} exquisite NFT artworks."`,
        );
      }
      return result;
    } catch (error) {
      console.log(getCountResponse('error', { message: error.message }));
      throw error;
    }
  }

  /**
   * Daily report with French aristocratic style
   */
  async generateCountReport() {
    const report = await this.generateTreasuryReport();
    const balances = await this.checkAllBalances();

    // Convert to Count De Moné's format
    const countReport = {
      player_funds_sol: balances.get(AccountType.PLAYER_FUNDS)?.sol || 0,
      operations_sol: balances.get(AccountType.OPERATIONS)?.sol || 0,
      operations_cgpt: balances.get(AccountType.OPERATIONS)?.cgpt || 0,
      revenue_sol: balances.get(AccountType.REVENUE)?.sol || 0,
      reserve_sol: balances.get(AccountType.RESERVE)?.sol || 0,
      segregation_maintained: report.health_metrics.segregation_maintained,
      operations_funded: report.health_metrics.operations_funded,
      reserve_adequate: report.health_metrics.reserve_adequate,
      recommendations: report.recommendations,
      buy_ins: report.recent_transactions.filter((tx) =>
        tx.purpose.includes('Buy-in'),
      ).length,
      payouts: report.recent_transactions.filter((tx) =>
        tx.purpose.includes('Payout'),
      ).length,
      nfts_created: report.recent_transactions.filter((tx) =>
        tx.purpose.includes('NFT'),
      ).length,
      cgpt_spent: this.getDailySpending().cgpt,
    };

    const formattedReport = formatTreasuryReport(countReport);
    console.log(formattedReport);

    return {
      raw_report: report,
      count_formatted: formattedReport,
      status: 'completed_with_aristocratic_precision',
    };
  }

  /**
   * Account status with elegant nicknames
   */
  getAccountStatus() {
    return {
      [this.countPersona.account_nicknames.PLAYER_FUNDS]:
        this.getAccountAddress(AccountType.PLAYER_FUNDS),
      [this.countPersona.account_nicknames.OPERATIONS]: this.getAccountAddress(
        AccountType.OPERATIONS,
      ),
      [this.countPersona.account_nicknames.REVENUE]: this.getAccountAddress(
        AccountType.REVENUE,
      ),
      [this.countPersona.account_nicknames.RESERVE]: this.getAccountAddress(
        AccountType.RESERVE,
      ),
    };
  }

  /**
   * Fund segregation check with French authority
   */
  async verifySegregationWithAuthority() {
    const isValid = this.verifyFundSegregation();

    if (isValid) {
      console.log(`🎩 "${this.countPersona.responses.audit_complete}"`);
    } else {
      console.log(`🚨 ${this.countPersona.responses.segregation_violation}`);
    }

    return isValid;
  }

  /**
   * Welcome message for new players
   */
  welcomeNewPlayer() {
    return getCountResponse('welcome');
  }

  /**
   * Farewell message
   */
  bidFarewell() {
    return getCountResponse('farewell');
  }

  /**
   * Count's daily routine
   */
  performDailyRoutine() {
    const now = new Date();
    const hour = now.getHours();

    let routine: string;

    if (hour < 12) {
      routine = this.countPersona.daily_routine.morning;
    } else if (hour < 17) {
      routine = this.countPersona.daily_routine.afternoon;
    } else if (hour < 21) {
      routine = this.countPersona.daily_routine.evening;
    } else {
      routine = this.countPersona.daily_routine.night;
    }

    console.log(
      `🎩 Count De Moné's ${hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : hour < 21 ? 'evening' : 'night'} routine: ${routine}`,
    );

    return this.generateCountReport();
  }

  /**
   * Emergency fund check with reserve protocol
   */
  async checkEmergencyReserve() {
    const balances = await this.checkAllBalances();
    const reserve = balances.get(AccountType.RESERVE);

    if (!reserve || reserve.sol < 5) {
      console.log(`🚨 ${this.countPersona.catchphrases.low_funds}`);
      console.log(`🎩 "${this.countPersona.responses.insufficient_funds}"`);
      return false;
    }

    console.log(`🛡️ "${this.countPersona.catchphrases.reserve_check}"`);
    return true;
  }
}

// Complete ElizaOS integration with Count De Moné
class CountDeMoneElizaOS extends ElizaTreasuryIntegration {
  private count: CountDeMoneChief;

  constructor(config: any) {
    super(config);
    this.count = new CountDeMoneChief(
      config.masterPrivateKey,
      config.cgptTokenAddress,
    );
  }

  /**
   * ElizaOS with Count De Moné personality
   */
  async elizaWithCount(operation: string, ...params: any[]) {
    switch (operation) {
      case 'buy_in':
        return await this.count.elizaProcessBuyIn(...params);

      case 'payout':
        return await this.count.elizaProcessPayout(...params);

      case 'generate_nfts':
        return await this.count.elizaGenerateNFTs(...params);

      case 'daily_report':
        return await this.count.performDailyRoutine();

      case 'welcome':
        return this.count.welcomeNewPlayer();

      case 'farewell':
        return this.count.bidFarewell();

      case 'verify_segregation':
        return await this.count.verifySegregationWithAuthority();

      case 'emergency_check':
        return await this.count.checkEmergencyReserve();

      default:
        return `🎩 "${CountDeMone.catchphrases.greeting} How may I assist you today?"`;
    }
  }
}

export { CountDeMoneChief, CountDeMoneElizaOS, CountDeMone };
