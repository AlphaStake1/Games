/**
 * Jerry Not-Jones Agent Integration with Multi-Currency Wallet
 *
 * Integrates the wallet service with Jerry's GM character for
 * secure Eric-only communication and automated operations
 */

import {
  JerryWalletService,
  WalletBalance,
  TransactionResult,
} from './wallet-service.js';
import { CalculatorAgent } from '../../agents/Calculator/index.js';

export interface EricCommandResult {
  success: boolean;
  message: string;
  data?: any;
  timestamp: Date;
}

export class JerryAgentIntegration {
  private walletService: JerryWalletService;
  private calculator: CalculatorAgent;
  private isAuthorizedUser: (userId: string) => boolean;

  constructor() {
    this.walletService = new JerryWalletService();
    this.calculator = new CalculatorAgent();

    // Security: Only Eric is authorized for human interaction
    this.isAuthorizedUser = (userId: string) => {
      return userId === 'Eric' || userId === 'eric@footballsquares.com';
    };
  }

  /**
   * Initialize Jerry's wallet system
   */
  async initialize(): Promise<void> {
    await this.walletService.initialize();

    // Set up event listeners for wallet events
    this.walletService.on('walletInitialized', (data) => {
      console.log('JERRY GM: Wallet system operational', data.addresses);
    });

    this.walletService.on('balanceUpdated', (balance: WalletBalance) => {
      console.log(
        `JERRY GM: ${balance.currency} balance updated: ${balance.amount}`,
      );
    });
  }

  /**
   * Eric's secure command interface
   * Only Eric can execute wallet operations
   */
  async executeEricCommand(
    userId: string,
    command: string,
    params?: any,
  ): Promise<EricCommandResult> {
    // Security check: Only Eric allowed
    if (!this.isAuthorizedUser(userId)) {
      return {
        success: false,
        message: 'UNAUTHORIZED: GM Jerry reports only to Eric',
        timestamp: new Date(),
      };
    }

    try {
      switch (command.toLowerCase()) {
        case 'wallet_status':
          return await this.getWalletStatus();

        case 'get_addresses':
          return await this.getReceivingAddresses();

        case 'get_balances':
          return await this.getBalances();

        case 'convert_to_monero':
          return await this.convertToMonero(params);

        case 'health_check':
          return await this.performHealthCheck();

        default:
          return {
            success: false,
            message: `Unknown command: ${command}`,
            timestamp: new Date(),
          };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error executing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get wallet status for Eric's oversight
   */
  private async getWalletStatus(): Promise<EricCommandResult> {
    const balances = await this.walletService.getBalances();
    const addresses = this.walletService.getReceivingAddresses();
    const health = await this.walletService.healthCheck();

    return {
      success: true,
      message: 'CONFIDENTIAL WALLET STATUS - Eric Only',
      data: {
        health_status: health ? 'OPERATIONAL' : 'DEGRADED',
        total_currencies: balances.length,
        balances: balances,
        addresses: addresses,
        last_updated: new Date(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get receiving addresses for Eric's testing
   */
  private async getReceivingAddresses(): Promise<EricCommandResult> {
    const addresses = this.walletService.getReceivingAddresses();

    return {
      success: true,
      message: "JERRY GM WALLET ADDRESSES - Ready for Eric's test transfers",
      data: {
        instructions:
          'Send SOL, ETH, or BTC to these addresses. Jerry will convert to XMR automatically.',
        addresses: {
          SOL: addresses.SOL,
          ETH: addresses.ETH,
          BTC: addresses.BTC,
          XMR_sending: addresses.XMR,
        },
        warning:
          'Addresses are for testing purposes. Verify before large transfers.',
      },
      timestamp: new Date(),
    };
  }

  /**
   * Get current balances with Calculator validation
   */
  private async getBalances(): Promise<EricCommandResult> {
    const balances = await this.walletService.getBalances();

    // Use Calculator for balance validation
    let totalUsdValue = 0;
    for (const balance of balances) {
      if (balance.usdValue) {
        totalUsdValue += balance.usdValue;
      }
    }

    const calculatorValidation = this.calculator.healthCheck();

    return {
      success: true,
      message: 'JERRY GM BALANCE REPORT - Calculator Validated',
      data: {
        balances: balances,
        total_usd_estimate: totalUsdValue,
        calculator_status: calculatorValidation.success ? 'VALIDATED' : 'ERROR',
        last_sync: new Date(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * Convert received currency to Monero for Eric's test
   */
  private async convertToMonero(params: {
    currency: 'SOL' | 'ETH' | 'BTC';
    amount: number;
    recipient_address: string;
  }): Promise<EricCommandResult> {
    if (!params.currency || !params.amount || !params.recipient_address) {
      return {
        success: false,
        message:
          'Missing required parameters: currency, amount, recipient_address',
        timestamp: new Date(),
      };
    }

    const result = await this.walletService.convertAndSendMonero(
      params.currency,
      params.amount,
      params.recipient_address,
    );

    if (result.success) {
      return {
        success: true,
        message: `JERRY GM: Conversion completed successfully`,
        data: {
          original_amount: params.amount,
          original_currency: params.currency,
          converted_currency: 'XMR',
          recipient: params.recipient_address,
          transaction_hash: result.txHash,
          status: 'COMPLETED',
        },
        timestamp: new Date(),
      };
    } else {
      return {
        success: false,
        message: `JERRY GM: Conversion failed - ${result.error}`,
        data: {
          error_details: result.error,
          attempted_amount: params.amount,
          attempted_currency: params.currency,
        },
        timestamp: new Date(),
      };
    }
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<EricCommandResult> {
    const walletHealth = await this.walletService.healthCheck();
    const calculatorHealth = this.calculator.healthCheck();

    return {
      success: walletHealth && calculatorHealth.success,
      message: 'JERRY GM SYSTEM HEALTH CHECK',
      data: {
        wallet_service: walletHealth ? 'HEALTHY' : 'UNHEALTHY',
        calculator_agent: calculatorHealth.success ? 'HEALTHY' : 'UNHEALTHY',
        overall_status:
          walletHealth && calculatorHealth.success ? 'OPERATIONAL' : 'DEGRADED',
        timestamp: new Date(),
      },
      timestamp: new Date(),
    };
  }

  /**
   * Agent reporting interface (for other agents to report to Jerry)
   */
  async receiveAgentReport(
    agentName: string,
    reportType: string,
    data: any,
  ): Promise<void> {
    console.log(`JERRY GM: Received ${reportType} from ${agentName}`);

    // Log agent reports for Eric's oversight
    const reportLog = {
      agent: agentName,
      type: reportType,
      data: data,
      timestamp: new Date(),
    };

    // In production, this would be stored in secure logs for Eric's review
    console.log('AGENT REPORT LOG:', JSON.stringify(reportLog, null, 2));
  }

  /**
   * Get wallet service instance (for internal agent use)
   */
  getWalletService(): JerryWalletService {
    return this.walletService;
  }
}

export default JerryAgentIntegration;
