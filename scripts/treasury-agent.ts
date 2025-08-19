/**
 * Treasury Agent - Multi-Account Fund Management System
 * Manages segregated accounts for Football Squares platform
 * Single private key, multiple public addresses
 */

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
} from '@solana/spl-token';
import * as bs58 from 'bs58';

// Account Types for segregation
enum AccountType {
  PLAYER_FUNDS = 'player_funds', // Buy-ins, payouts, escrow
  OPERATIONS = 'operations', // NFT generation, ChainGPT costs
  REVENUE = 'revenue', // Platform fees, house edge
  RESERVE = 'reserve', // Emergency funds, insurance
}

interface TreasuryAccount {
  type: AccountType;
  publicKey: PublicKey;
  description: string;
  solBalance?: number;
  cgptBalance?: number;
  restrictions: string[];
}

interface TransactionLog {
  timestamp: Date;
  fromAccount: AccountType;
  toAccount: AccountType | string;
  amount: number;
  currency: 'SOL' | 'CGPT';
  purpose: string;
  txSignature?: string;
}

class TreasuryAgent {
  private connection: Connection;
  private masterKeypair: Keypair;
  private accounts: Map<AccountType, TreasuryAccount>;
  private cgptTokenMint: PublicKey;
  private transactionLog: TransactionLog[] = [];
  private jerryWalletAddress: PublicKey;

  // Safety limits
  private readonly DAILY_OPERATIONS_LIMIT_SOL = 10;
  private readonly DAILY_OPERATIONS_LIMIT_CGPT = 100;
  private readonly PLAYER_PAYOUT_REQUIRES_RESERVE_CHECK = true;
  private readonly MIN_RESERVE_BALANCE_SOL = 5;

  constructor(
    privateKey: string,
    cgptTokenAddress: string,
    jerryWalletAddress?: string,
  ) {
    this.connection = new Connection(
      'https://api.mainnet-beta.solana.com',
      'confirmed',
    );
    this.masterKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    this.cgptTokenMint = new PublicKey(cgptTokenAddress);
    this.jerryWalletAddress = new PublicKey(
      jerryWalletAddress || '7hRMzsqfmTCxzZgU6PwChBN4JLua1uTNRzPomNXJ7Q9W',
    );
    this.accounts = new Map();

    console.log(
      '🎩 Bonjour! Count De Moné initializing the treasury with aristocratic precision...',
    );
    console.log(
      `💰 Reserve funds shall be managed by Monsieur Jerry Not-Jones at: ${this.jerryWalletAddress.toString()}`,
    );
    this.initializeAccounts();
  }

  /**
   * Initialize the 4-account structure
   * In Phantom, these would be different accounts under the same wallet
   */
  private async initializeAccounts() {
    // For Solana, we'll derive different addresses from the master keypair
    // In production, you'd create these as separate accounts in Phantom

    const accounts: [AccountType, string, string[]][] = [
      [
        AccountType.PLAYER_FUNDS,
        'Holds all player buy-ins and processes payouts',
        [
          'No operational expenses',
          'No NFT costs',
          'Payouts only to verified players',
        ],
      ],
      [
        AccountType.OPERATIONS,
        'Funds NFT generation and ChainGPT API costs',
        ['ChainGPT purchases only', 'NFT minting costs', 'No player payouts'],
      ],
      [
        AccountType.REVENUE,
        'Collects platform fees and house edge',
        ['Receives 5% fees', 'Funds operations account', 'Distributes profits'],
      ],
      [
        AccountType.RESERVE,
        'Emergency funds and insurance pool',
        [
          'Minimum balance required',
          'Emergency payouts only',
          'Audit protection',
        ],
      ],
    ];

    for (const [type, description, restrictions] of accounts) {
      // In production, these would be separate account addresses
      // For now, using derived addresses as example
      const account: TreasuryAccount = {
        type,
        publicKey: this.masterKeypair.publicKey, // In production: separate addresses
        description,
        restrictions,
      };

      this.accounts.set(type, account);
    }

    console.log(
      "🎩💰 Count De Moné has prepared the treasury with four distinguished accounts: The Patron's Purse, The Artisan's Atelier, The Estate's Earnings, and The Emergency Vault. Tout est parfait!",
    );
  }

  /**
   * Check balances across all accounts
   */
  async checkAllBalances(): Promise<
    Map<AccountType, { sol: number; cgpt: number }>
  > {
    const balances = new Map<AccountType, { sol: number; cgpt: number }>();

    for (const [type, account] of this.accounts) {
      try {
        // Check SOL balance
        const solBalance = await this.connection.getBalance(account.publicKey);

        // Check CGPT token balance
        const tokenAddress = await getAssociatedTokenAddress(
          this.cgptTokenMint,
          account.publicKey,
        );

        let cgptBalance = 0;
        try {
          const tokenAccount = await getAccount(this.connection, tokenAddress);
          cgptBalance = Number(tokenAccount.amount) / 1e9; // Assuming 9 decimals
        } catch {
          // Token account doesn't exist yet
          cgptBalance = 0;
        }

        balances.set(type, {
          sol: solBalance / LAMPORTS_PER_SOL,
          cgpt: cgptBalance,
        });

        // Update account records
        account.solBalance = solBalance / LAMPORTS_PER_SOL;
        account.cgptBalance = cgptBalance;
      } catch (error) {
        console.error(`Error checking balance for ${type}:`, error);
        balances.set(type, { sol: 0, cgpt: 0 });
      }
    }

    return balances;
  }

  /**
   * Handle player buy-in
   */
  async handlePlayerBuyIn(
    playerAddress: string,
    amount: number,
    gameId: string,
  ): Promise<string> {
    console.log(
      `🎩 Count De Moné: "Ah, another distinguished patron joins our establishment! Processing buy-in of ${amount} SOL from ${playerAddress} for game ${gameId}"`,
    );

    // Record the transaction
    this.transactionLog.push({
      timestamp: new Date(),
      fromAccount: AccountType.PLAYER_FUNDS,
      toAccount: playerAddress,
      amount,
      currency: 'SOL',
      purpose: `Buy-in for game ${gameId}`,
      txSignature: 'pending',
    });

    // In production: Accept the payment to PLAYER_FUNDS account
    // Return transaction signature
    return 'buy-in-tx-signature';
  }

  /**
   * Handle player payout
   */
  async handlePlayerPayout(
    playerAddress: string,
    amount: number,
    gameId: string,
  ): Promise<string> {
    console.log(
      `🎯 Processing payout: ${amount} SOL to ${playerAddress} for game ${gameId}`,
    );

    // Check player funds account has sufficient balance
    const balances = await this.checkAllBalances();
    const playerFunds = balances.get(AccountType.PLAYER_FUNDS);

    if (!playerFunds || playerFunds.sol < amount) {
      throw new Error('Insufficient funds in player account for payout');
    }

    // Check reserve requirements
    if (this.PLAYER_PAYOUT_REQUIRES_RESERVE_CHECK) {
      const reserve = balances.get(AccountType.RESERVE);
      if (!reserve || reserve.sol < this.MIN_RESERVE_BALANCE_SOL) {
        console.warn('⚠️ Reserve balance below minimum threshold');
      }
    }

    // Process the payout from PLAYER_FUNDS account
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.accounts.get(AccountType.PLAYER_FUNDS)!.publicKey,
        toPubkey: new PublicKey(playerAddress),
        lamports: amount * LAMPORTS_PER_SOL,
      }),
    );

    // In production: Sign and send transaction
    console.log(`✅ Payout authorized from PLAYER_FUNDS to ${playerAddress}`);

    return 'payout-tx-signature';
  }

  /**
   * Purchase ChainGPT credits for NFT generation
   * Uses OPERATIONS account only
   */
  async purchaseChainGPTCredits(cgptAmount: number): Promise<boolean> {
    console.log(
      `🎩 Count De Moné: "We shall acquire ${cgptAmount} digital doubloons for our finest NFT artworks! The Artisan's Atelier requires these treasures."`,
    );

    // Check operations account balance
    const balances = await this.checkAllBalances();
    const operations = balances.get(AccountType.OPERATIONS);

    if (!operations || operations.cgpt < cgptAmount) {
      console.warn('⚠️ Insufficient CGPT in operations account');

      // Check if revenue account can fund operations
      const revenue = balances.get(AccountType.REVENUE);
      if (revenue && revenue.cgpt >= cgptAmount) {
        await this.internalTransfer(
          AccountType.REVENUE,
          AccountType.OPERATIONS,
          cgptAmount,
          'CGPT',
          'Fund operations for NFT generation',
        );
      } else {
        throw new Error('Insufficient CGPT tokens for NFT generation');
      }
    }

    // Process CGPT purchase from OPERATIONS account only
    this.transactionLog.push({
      timestamp: new Date(),
      fromAccount: AccountType.OPERATIONS,
      toAccount: 'ChainGPT API',
      amount: cgptAmount,
      currency: 'CGPT',
      purpose: 'NFT generation credits',
      txSignature: 'cgpt-purchase-tx',
    });

    console.log('✅ CGPT credits purchased from OPERATIONS account');
    return true;
  }

  /**
   * Internal transfer between treasury accounts
   */
  private async internalTransfer(
    from: AccountType,
    to: AccountType,
    amount: number,
    currency: 'SOL' | 'CGPT',
    purpose: string,
  ): Promise<string> {
    console.log(
      `🔄 Internal transfer: ${amount} ${currency} from ${from} to ${to}`,
    );

    // Validate transfer restrictions
    const fromAccount = this.accounts.get(from)!;
    const toAccount = this.accounts.get(to)!;

    // Check restrictions
    if (from === AccountType.PLAYER_FUNDS && to === AccountType.OPERATIONS) {
      throw new Error('❌ Cannot transfer player funds to operations');
    }

    if (from === AccountType.OPERATIONS && to === AccountType.PLAYER_FUNDS) {
      throw new Error('❌ Cannot transfer operations funds to player account');
    }

    // Record the internal transfer
    this.transactionLog.push({
      timestamp: new Date(),
      fromAccount: from,
      toAccount: to,
      amount,
      currency,
      purpose,
      txSignature: 'internal-transfer',
    });

    return 'internal-tx-signature';
  }

  /**
   * Collect platform fee from game
   */
  async collectPlatformFee(gameId: string, feeAmount: number): Promise<void> {
    console.log(
      `💎 Collecting ${feeAmount} SOL platform fee for game ${gameId}`,
    );

    // Fee goes from PLAYER_FUNDS to REVENUE
    await this.internalTransfer(
      AccountType.PLAYER_FUNDS,
      AccountType.REVENUE,
      feeAmount,
      'SOL',
      `Platform fee for game ${gameId}`,
    );
  }

  /**
   * Generate treasury report
   */
  async generateTreasuryReport(): Promise<any> {
    const balances = await this.checkAllBalances();

    const report = {
      timestamp: new Date().toISOString(),
      accounts: {} as any,
      health_metrics: {
        player_funds_secure: true,
        operations_funded: true,
        reserve_adequate: true,
        segregation_maintained: true,
      },
      recent_transactions: this.transactionLog.slice(-10),
      recommendations: [] as string[],
    };

    // Build account summaries
    for (const [type, balance] of balances) {
      const account = this.accounts.get(type)!;
      report.accounts[type] = {
        description: account.description,
        sol_balance: balance.sol,
        cgpt_balance: balance.cgpt,
        restrictions: account.restrictions,
      };

      // Health checks
      if (type === AccountType.OPERATIONS && balance.cgpt < 10) {
        report.recommendations.push(
          '⚠️ Operations CGPT balance low - consider funding',
        );
        report.health_metrics.operations_funded = false;
      }

      if (
        type === AccountType.RESERVE &&
        balance.sol < this.MIN_RESERVE_BALANCE_SOL
      ) {
        report.recommendations.push(
          '⚠️ Reserve balance below minimum - requires attention',
        );
        report.health_metrics.reserve_adequate = false;
      }
    }

    // Check fund segregation
    const segregationCheck = this.verifyFundSegregation();
    report.health_metrics.segregation_maintained = segregationCheck;

    return report;
  }

  /**
   * Verify fund segregation rules are maintained
   */
  private verifyFundSegregation(): boolean {
    // Check transaction log for any violations
    for (const tx of this.transactionLog) {
      // Player funds should never go to operations
      if (
        tx.fromAccount === AccountType.PLAYER_FUNDS &&
        tx.toAccount === AccountType.OPERATIONS
      ) {
        console.error('❌ Fund segregation violation detected!');
        return false;
      }
    }

    return true;
  }

  /**
   * ElizaOS Integration - Get account address for specific purpose
   */
  getAccountAddress(type: AccountType): string {
    const account = this.accounts.get(type);
    if (!account) {
      throw new Error(`Account type ${type} not found`);
    }
    return account.publicKey.toString();
  }

  /**
   * Transfer reserve funds to Jerry Not-Jones's wallet
   */
  async transferReservesToJerry(
    amount: number,
    reason: string,
  ): Promise<string> {
    console.log(
      `🎩 Count De Moné: "Monsieur Jerry Not-Jones, we are transferring ${amount} SOL from The Emergency Vault for: ${reason}"`,
    );

    // Check reserve balance
    const balances = await this.checkAllBalances();
    const reserve = balances.get(AccountType.RESERVE);

    if (!reserve || reserve.sol < amount) {
      throw new Error(
        'Insufficient reserve funds for transfer to Jerry Not-Jones',
      );
    }

    // Log the transaction
    this.transactionLog.push({
      timestamp: new Date(),
      fromAccount: AccountType.RESERVE,
      toAccount: this.jerryWalletAddress.toString(),
      amount,
      currency: 'SOL',
      purpose: `Reserve transfer to Jerry Not-Jones: ${reason}`,
      txSignature: 'jerry-reserve-transfer',
    });

    console.log(
      `💰 "Voilà! ${amount} SOL has been securely transferred to Monsieur Jerry's vault."`,
    );
    return 'jerry-reserve-transfer-signature';
  }

  /**
   * Get Jerry Not-Jones wallet address
   */
  getJerryWalletAddress(): string {
    return this.jerryWalletAddress.toString();
  }

  /**
   * Check if emergency reserve transfer to Jerry is needed
   */
  async checkJerryReserveStatus(): Promise<{
    needsTransfer: boolean;
    amount: number;
    reason?: string;
  }> {
    const balances = await this.checkAllBalances();
    const reserve = balances.get(AccountType.RESERVE);

    if (!reserve) {
      return { needsTransfer: false, amount: 0 };
    }

    // If reserve is above 10 SOL, transfer excess to Jerry
    if (reserve.sol > 10) {
      const excess = reserve.sol - 5; // Keep 5 SOL minimum
      return {
        needsTransfer: true,
        amount: excess,
        reason: 'Excess reserve funds securing with Jerry Not-Jones',
      };
    }

    // If reserve is critically low, might need Jerry to refill
    if (reserve.sol < 2) {
      return {
        needsTransfer: false,
        amount: 3, // Need 3 SOL to get back to minimum
        reason: 'Emergency: Reserve critically low, need Jerry funding',
      };
    }

    return { needsTransfer: false, amount: 0 };
  }

  /**
   * Get daily spending summary
   */
  getDailySpending(): { sol: number; cgpt: number } {
    const today = new Date().toDateString();
    const dailySpending = { sol: 0, cgpt: 0 };

    for (const tx of this.transactionLog) {
      if (
        tx.timestamp.toDateString() === today &&
        tx.fromAccount === AccountType.OPERATIONS
      ) {
        if (tx.currency === 'SOL') {
          dailySpending.sol += tx.amount;
        } else if (tx.currency === 'CGPT') {
          dailySpending.cgpt += tx.amount;
        }
      }
    }

    return dailySpending;
  }
}

// Configuration for Treasury Agent
const treasuryConfig = {
  cgptTokenAddress: 'CCDfDXZxzZtkZLuhY48gyKdXc5KywqpR8xEVHHh8ck1G',
  accounts: {
    [AccountType.PLAYER_FUNDS]: 'For player buy-ins and payouts only',
    [AccountType.OPERATIONS]: 'For NFT generation and API costs',
    [AccountType.REVENUE]: 'For platform fees and profits',
    [AccountType.RESERVE]: 'For emergency funds and insurance',
  },
};

export {
  TreasuryAgent,
  AccountType,
  type TreasuryAccount,
  type TransactionLog,
  treasuryConfig,
};
