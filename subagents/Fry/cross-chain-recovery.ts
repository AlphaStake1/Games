// subagents/Fry/cross-chain-recovery.ts
/**
 * Cross-Chain Transaction Recovery System for Fry
 *
 * Handles scenarios where users send tokens to wrong blockchain addresses:
 * - Polygon USDC sent to Ethereum address
 * - Ethereum tokens sent to Solana address
 * - Cross-chain transaction analysis and recovery options
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { ethers } from 'ethers';

export interface CrossChainRecoveryRequest {
  transactionHash: string;
  sourceChain: 'ethereum' | 'polygon' | 'solana' | 'bsc' | 'arbitrum';
  expectedChain: 'ethereum' | 'polygon' | 'solana' | 'bsc' | 'arbitrum';
  tokenAddress?: string;
  userWalletAddress: string;
  platformWalletAddress: string;
  amount?: string;
  timestamp?: number;
}

export interface CrossChainRecoveryResult {
  recoveryStatus:
    | 'recoverable'
    | 'unrecoverable'
    | 'requires_manual_intervention'
    | 'platform_credit_eligible';
  transactionFound: boolean;
  crossChainDetected: boolean;
  recoveryOptions: RecoveryOption[];
  platformCreditEligible: boolean;
  technicalAnalysis: {
    sourceChainAnalysis: ChainAnalysis;
    destinationChainAnalysis: ChainAnalysis;
    tokenCompatibility: TokenCompatibility;
    recoveryComplexity: 'simple' | 'complex' | 'impossible';
  };
  userGuidance: RecoveryGuidance;
  estimatedRecoveryTime?: string;
  estimatedCosts?: RecoveryCosts;
}

export interface RecoveryOption {
  method:
    | 'bridge_recovery'
    | 'manual_transfer'
    | 'platform_credit'
    | 'third_party_service';
  description: string;
  successRate: number;
  estimatedTime: string;
  cost: string;
  riskLevel: 'low' | 'medium' | 'high';
  automated: boolean;
  steps: RecoveryStep[];
}

export interface RecoveryStep {
  stepNumber: number;
  description: string;
  technicalAction: string;
  userAction?: string;
  estimatedTime: string;
  requiresApproval: boolean;
}

export interface ChainAnalysis {
  chainId: number;
  transactionExists: boolean;
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: string;
  status: 'success' | 'failed' | 'pending' | 'not_found';
  tokenTransfers: TokenTransfer[];
  walletBalance: string;
}

export interface TokenTransfer {
  tokenAddress: string;
  tokenSymbol: string;
  from: string;
  to: string;
  amount: string;
  decimals: number;
  usdValue?: number;
}

export interface TokenCompatibility {
  isWrappedToken: boolean;
  hasNativeEquivalent: boolean;
  bridgeSupported: boolean;
  compatibleChains: string[];
  conversionRate?: number;
}

export interface RecoveryGuidance {
  immediateActions: string[];
  preventionTips: string[];
  alternativeActions: string[];
  escalationRequired: boolean;
  contactSupport: boolean;
}

export interface RecoveryCosts {
  gasFees: string;
  bridgeFees?: string;
  serviceFees?: string;
  totalEstimated: string;
  currency: string;
}

export class CrossChainRecoverySystem {
  private solanaConnection: Connection;
  private ethereumProvider: ethers.providers.JsonRpcProvider;
  private polygonProvider: ethers.providers.JsonRpcProvider;
  private bscProvider: ethers.providers.JsonRpcProvider;
  private arbitrumProvider: ethers.providers.JsonRpcProvider;

  constructor(config: {
    solanaRPC: string;
    ethereumRPC: string;
    polygonRPC: string;
    bscRPC: string;
    arbitrumRPC: string;
  }) {
    this.solanaConnection = new Connection(config.solanaRPC, 'confirmed');
    this.ethereumProvider = new ethers.providers.JsonRpcProvider(
      config.ethereumRPC,
    );
    this.polygonProvider = new ethers.providers.JsonRpcProvider(
      config.polygonRPC,
    );
    this.bscProvider = new ethers.providers.JsonRpcProvider(config.bscRPC);
    this.arbitrumProvider = new ethers.providers.JsonRpcProvider(
      config.arbitrumRPC,
    );
  }

  /**
   * Main entry point for cross-chain recovery analysis
   */
  async analyzeRecovery(
    request: CrossChainRecoveryRequest,
  ): Promise<CrossChainRecoveryResult> {
    console.log(
      `🔗 Fry analyzing cross-chain recovery: ${request.transactionHash}`,
    );

    try {
      // Step 1: Analyze source chain transaction
      const sourceAnalysis = await this.analyzeSourceChain(request);

      // Step 2: Check destination chain for any related activity
      const destinationAnalysis = await this.analyzeDestinationChain(request);

      // Step 3: Determine token compatibility
      const tokenCompatibility = await this.analyzeTokenCompatibility(
        request,
        sourceAnalysis,
      );

      // Step 4: Generate recovery options
      const recoveryOptions = await this.generateRecoveryOptions(
        request,
        sourceAnalysis,
        destinationAnalysis,
        tokenCompatibility,
      );

      // Step 5: Determine platform credit eligibility
      const platformCreditEligible = this.assessPlatformCreditEligibility(
        request,
        sourceAnalysis,
        tokenCompatibility,
      );

      // Step 6: Generate user guidance
      const userGuidance = this.generateUserGuidance(
        request,
        recoveryOptions,
        platformCreditEligible,
      );

      const recoveryStatus = this.determineRecoveryStatus(
        sourceAnalysis,
        destinationAnalysis,
        tokenCompatibility,
        platformCreditEligible,
      );

      return {
        recoveryStatus,
        transactionFound: sourceAnalysis.transactionExists,
        crossChainDetected: this.detectCrossChainIssue(request, sourceAnalysis),
        recoveryOptions,
        platformCreditEligible,
        technicalAnalysis: {
          sourceChainAnalysis: sourceAnalysis,
          destinationChainAnalysis: destinationAnalysis,
          tokenCompatibility,
          recoveryComplexity: this.assessRecoveryComplexity(
            tokenCompatibility,
            recoveryOptions,
          ),
        },
        userGuidance,
        estimatedRecoveryTime: recoveryOptions[0]?.estimatedTime,
        estimatedCosts: recoveryOptions[0]
          ? await this.calculateRecoveryCosts(recoveryOptions[0])
          : undefined,
      };
    } catch (error) {
      console.error('🚨 Cross-chain recovery analysis failed:', error);

      return {
        recoveryStatus: 'requires_manual_intervention',
        transactionFound: false,
        crossChainDetected: false,
        recoveryOptions: [],
        platformCreditEligible: false,
        technicalAnalysis: {
          sourceChainAnalysis: {
            chainId: 0,
            transactionExists: false,
            status: 'not_found',
            tokenTransfers: [],
            walletBalance: '0',
          },
          destinationChainAnalysis: {
            chainId: 0,
            transactionExists: false,
            status: 'not_found',
            tokenTransfers: [],
            walletBalance: '0',
          },
          tokenCompatibility: {
            isWrappedToken: false,
            hasNativeEquivalent: false,
            bridgeSupported: false,
            compatibleChains: [],
          },
          recoveryComplexity: 'impossible',
        },
        userGuidance: {
          immediateActions: ['Contact support with transaction details'],
          preventionTips: [
            'Always verify recipient address and chain before sending',
          ],
          alternativeActions: [
            'Provide transaction hash for manual investigation',
          ],
          escalationRequired: true,
          contactSupport: true,
        },
      };
    }
  }

  /**
   * Analyze transaction on source chain
   */
  private async analyzeSourceChain(
    request: CrossChainRecoveryRequest,
  ): Promise<ChainAnalysis> {
    const provider = this.getProviderForChain(request.sourceChain);

    if (request.sourceChain === 'solana') {
      return await this.analyzeSolanaTransaction(request.transactionHash);
    } else {
      return await this.analyzeEVMTransaction(
        request.transactionHash,
        provider,
        request.sourceChain,
      );
    }
  }

  /**
   * Analyze Solana transaction
   */
  private async analyzeSolanaTransaction(
    txHash: string,
  ): Promise<ChainAnalysis> {
    try {
      const transaction =
        await this.solanaConnection.getConfirmedTransaction(txHash);

      if (!transaction) {
        return {
          chainId: 101, // Solana mainnet
          transactionExists: false,
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: '0',
        };
      }

      const tokenTransfers: TokenTransfer[] = [];

      // Parse Solana token transfers from transaction logs
      if (transaction.meta?.logMessages) {
        // Simplified token transfer parsing
        // In production, you'd use proper SPL token parsing
        const transferLogs = transaction.meta.logMessages.filter(
          (log) => log.includes('Transfer') || log.includes('token'),
        );

        // This would be more sophisticated in production
        if (transferLogs.length > 0) {
          tokenTransfers.push({
            tokenAddress: 'SOL', // Placeholder
            tokenSymbol: 'SOL',
            from: transaction.transaction.message.accountKeys[0].toBase58(),
            to:
              transaction.transaction.message.accountKeys[1]?.toBase58() || '',
            amount: '0', // Would parse from logs
            decimals: 9,
          });
        }
      }

      return {
        chainId: 101,
        transactionExists: true,
        blockNumber: transaction.slot,
        confirmations: 1000, // Simplified
        status: transaction.meta?.err ? 'failed' : 'success',
        tokenTransfers,
        walletBalance: '0', // Would need separate balance check
      };
    } catch (error) {
      return {
        chainId: 101,
        transactionExists: false,
        status: 'not_found',
        tokenTransfers: [],
        walletBalance: '0',
      };
    }
  }

  /**
   * Analyze EVM transaction (Ethereum, Polygon, BSC, Arbitrum)
   */
  private async analyzeEVMTransaction(
    txHash: string,
    provider: ethers.providers.JsonRpcProvider,
    chain: string,
  ): Promise<ChainAnalysis> {
    try {
      const [transaction, receipt] = await Promise.all([
        provider.getTransaction(txHash),
        provider.getTransactionReceipt(txHash).catch(() => null),
      ]);

      if (!transaction) {
        return {
          chainId: await provider.getNetwork().then((n) => n.chainId),
          transactionExists: false,
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: '0',
        };
      }

      const tokenTransfers: TokenTransfer[] = [];

      // Parse token transfers from logs
      if (receipt?.logs) {
        const erc20TransferTopic =
          '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

        for (const log of receipt.logs) {
          if (log.topics[0] === erc20TransferTopic && log.topics.length >= 3) {
            try {
              const from = ethers.utils.getAddress(
                '0x' + log.topics[1].slice(26),
              );
              const to = ethers.utils.getAddress(
                '0x' + log.topics[2].slice(26),
              );
              const amount = ethers.BigNumber.from(log.data).toString();

              // Get token info (simplified - would cache this)
              const tokenSymbol = await this.getTokenSymbol(
                log.address,
                provider,
              );
              const decimals = await this.getTokenDecimals(
                log.address,
                provider,
              );

              tokenTransfers.push({
                tokenAddress: log.address,
                tokenSymbol,
                from,
                to,
                amount,
                decimals,
              });
            } catch (parseError) {
              console.warn('Failed to parse token transfer:', parseError);
            }
          }
        }
      }

      const currentBlock = await provider.getBlockNumber();
      const confirmations = receipt ? currentBlock - receipt.blockNumber : 0;

      return {
        chainId: await provider.getNetwork().then((n) => n.chainId),
        transactionExists: true,
        blockNumber: transaction.blockNumber || 0,
        confirmations,
        gasUsed: receipt?.gasUsed.toString(),
        status: receipt?.status === 1 ? 'success' : 'failed',
        tokenTransfers,
        walletBalance: ethers.utils.formatEther(
          await provider.getBalance(transaction.from),
        ),
      };
    } catch (error) {
      return {
        chainId: 0,
        transactionExists: false,
        status: 'not_found',
        tokenTransfers: [],
        walletBalance: '0',
      };
    }
  }

  /**
   * Analyze destination chain for related activity
   */
  private async analyzeDestinationChain(
    request: CrossChainRecoveryRequest,
  ): Promise<ChainAnalysis> {
    // Check if the user's wallet has any activity on the expected chain
    const provider = this.getProviderForChain(request.expectedChain);

    if (request.expectedChain === 'solana') {
      try {
        const pubkey = new PublicKey(request.userWalletAddress);
        const balance = await this.solanaConnection.getBalance(pubkey);

        return {
          chainId: 101,
          transactionExists: false, // Not checking specific tx here
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: (balance / 1e9).toString(), // Convert lamports to SOL
        };
      } catch {
        return {
          chainId: 101,
          transactionExists: false,
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: '0',
        };
      }
    } else {
      try {
        const balance = await provider.getBalance(request.userWalletAddress);

        return {
          chainId: await provider.getNetwork().then((n) => n.chainId),
          transactionExists: false,
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: ethers.utils.formatEther(balance),
        };
      } catch {
        return {
          chainId: 0,
          transactionExists: false,
          status: 'not_found',
          tokenTransfers: [],
          walletBalance: '0',
        };
      }
    }
  }

  /**
   * Analyze token compatibility between chains
   */
  private async analyzeTokenCompatibility(
    request: CrossChainRecoveryRequest,
    sourceAnalysis: ChainAnalysis,
  ): Promise<TokenCompatibility> {
    // Simplified token compatibility analysis
    // In production, this would use comprehensive token mapping databases

    const commonWrappedTokens = {
      USDC: ['ethereum', 'polygon', 'arbitrum', 'solana'],
      USDT: ['ethereum', 'polygon', 'bsc', 'solana'],
      WETH: ['ethereum', 'polygon', 'arbitrum'],
      WBTC: ['ethereum', 'polygon'],
    };

    let isWrappedToken = false;
    let hasNativeEquivalent = false;
    let bridgeSupported = false;
    let compatibleChains: string[] = [];

    // Check if any transferred tokens are common wrapped tokens
    for (const transfer of sourceAnalysis.tokenTransfers) {
      const symbol = transfer.tokenSymbol.toUpperCase();

      if (commonWrappedTokens[symbol]) {
        isWrappedToken = true;
        compatibleChains = commonWrappedTokens[symbol];
        hasNativeEquivalent = compatibleChains.includes(request.expectedChain);
        bridgeSupported = hasNativeEquivalent;
        break;
      }
    }

    return {
      isWrappedToken,
      hasNativeEquivalent,
      bridgeSupported,
      compatibleChains,
      conversionRate: hasNativeEquivalent ? 1.0 : undefined,
    };
  }

  /**
   * Generate recovery options based on analysis
   */
  private async generateRecoveryOptions(
    request: CrossChainRecoveryRequest,
    sourceAnalysis: ChainAnalysis,
    destinationAnalysis: ChainAnalysis,
    tokenCompatibility: TokenCompatibility,
  ): Promise<RecoveryOption[]> {
    const options: RecoveryOption[] = [];

    // Option 1: Bridge Recovery (if token is bridgeable)
    if (
      tokenCompatibility.bridgeSupported &&
      sourceAnalysis.transactionExists
    ) {
      options.push({
        method: 'bridge_recovery',
        description:
          'Use cross-chain bridge to recover tokens to correct chain',
        successRate: 95,
        estimatedTime: '15-30 minutes',
        cost: '$5-15 in gas fees',
        riskLevel: 'low',
        automated: false,
        steps: [
          {
            stepNumber: 1,
            description: 'Verify token balance on source chain',
            technicalAction: 'Check token balance in source wallet',
            userAction: 'Confirm you still control the source wallet',
            estimatedTime: '2 minutes',
            requiresApproval: false,
          },
          {
            stepNumber: 2,
            description: 'Initialize bridge transfer',
            technicalAction: 'Connect to cross-chain bridge protocol',
            userAction: 'Approve bridge contract interaction',
            estimatedTime: '5 minutes',
            requiresApproval: true,
          },
          {
            stepNumber: 3,
            description: 'Execute bridge transaction',
            technicalAction:
              'Submit bridge transaction with correct destination',
            userAction: 'Wait for bridge confirmation',
            estimatedTime: '10-20 minutes',
            requiresApproval: false,
          },
        ],
      });
    }

    // Option 2: Platform Credit (if eligible)
    if (
      this.assessPlatformCreditEligibility(
        request,
        sourceAnalysis,
        tokenCompatibility,
      )
    ) {
      options.push({
        method: 'platform_credit',
        description: 'Receive platform credit equivalent to lost tokens',
        successRate: 100,
        estimatedTime: '24-48 hours',
        cost: 'Free',
        riskLevel: 'low',
        automated: true,
        steps: [
          {
            stepNumber: 1,
            description: 'Submit recovery request',
            technicalAction:
              'Generate platform credit request with transaction proof',
            userAction: 'Provide transaction details and wallet verification',
            estimatedTime: '10 minutes',
            requiresApproval: false,
          },
          {
            stepNumber: 2,
            description: 'Manual review process',
            technicalAction:
              'Support team verifies transaction and eligibility',
            userAction: 'Wait for support team review',
            estimatedTime: '24-48 hours',
            requiresApproval: true,
          },
          {
            stepNumber: 3,
            description: 'Credit issued',
            technicalAction: 'Platform credit added to user account',
            userAction: 'Use credit for platform activities',
            estimatedTime: '5 minutes',
            requiresApproval: false,
          },
        ],
      });
    }

    // Option 3: Manual Transfer (if we control the destination address)
    if (
      request.platformWalletAddress &&
      sourceAnalysis.tokenTransfers.some(
        (t) =>
          t.to.toLowerCase() === request.platformWalletAddress.toLowerCase(),
      )
    ) {
      options.push({
        method: 'manual_transfer',
        description:
          'Manual recovery by platform team (tokens sent to platform wallet)',
        successRate: 90,
        estimatedTime: '2-5 business days',
        cost: 'Gas fees ($2-10)',
        riskLevel: 'low',
        automated: false,
        steps: [
          {
            stepNumber: 1,
            description: 'Verify platform wallet received tokens',
            technicalAction: 'Confirm tokens are in platform custody',
            userAction: 'Provide proof of ownership and correct destination',
            estimatedTime: '1 hour',
            requiresApproval: false,
          },
          {
            stepNumber: 2,
            description: 'Manual review and approval',
            technicalAction: 'Support team reviews recovery request',
            userAction: 'Wait for manual review completion',
            estimatedTime: '1-3 business days',
            requiresApproval: true,
          },
          {
            stepNumber: 3,
            description: 'Execute recovery transfer',
            technicalAction: 'Transfer tokens to correct address/chain',
            userAction: 'Confirm receipt of recovered tokens',
            estimatedTime: '30 minutes',
            requiresApproval: false,
          },
        ],
      });
    }

    // Sort by success rate and estimated time
    return options.sort((a, b) => b.successRate - a.successRate);
  }

  /**
   * Assess platform credit eligibility
   */
  private assessPlatformCreditEligibility(
    request: CrossChainRecoveryRequest,
    sourceAnalysis: ChainAnalysis,
    tokenCompatibility: TokenCompatibility,
  ): boolean {
    // Platform credit eligibility criteria:
    // 1. Transaction exists and was successful
    // 2. Tokens were sent to platform wallet address
    // 3. Amount is below platform credit threshold ($500 equivalent)
    // 4. User has verified account
    // 5. No previous credit claims for similar issues

    if (
      !sourceAnalysis.transactionExists ||
      sourceAnalysis.status !== 'success'
    ) {
      return false;
    }

    // Check if tokens were sent to platform wallet
    const sentToPlatformWallet = sourceAnalysis.tokenTransfers.some(
      (transfer) =>
        transfer.to.toLowerCase() ===
        request.platformWalletAddress.toLowerCase(),
    );

    if (!sentToPlatformWallet) {
      return false;
    }

    // Check amount threshold (simplified - would use real USD values)
    const totalValue = sourceAnalysis.tokenTransfers.reduce((sum, transfer) => {
      const amount =
        parseFloat(transfer.amount) / Math.pow(10, transfer.decimals);
      // Simplified USD conversion - would use real price feeds
      const usdValue = transfer.tokenSymbol.includes('USD')
        ? amount
        : amount * 100; // Placeholder
      return sum + usdValue;
    }, 0);

    return totalValue <= 500; // $500 threshold
  }

  /**
   * Generate user guidance
   */
  private generateUserGuidance(
    request: CrossChainRecoveryRequest,
    recoveryOptions: RecoveryOption[],
    platformCreditEligible: boolean,
  ): RecoveryGuidance {
    const immediateActions: string[] = [];
    const preventionTips: string[] = [
      'Always double-check the blockchain network before sending tokens',
      "Verify recipient addresses support the token you're sending",
      'Use small test amounts first for new addresses',
      'Keep transaction hashes for all transfers',
    ];
    const alternativeActions: string[] = [];

    if (recoveryOptions.length > 0) {
      immediateActions.push('Review available recovery options below');

      if (recoveryOptions.some((opt) => opt.method === 'bridge_recovery')) {
        immediateActions.push(
          'Consider using cross-chain bridge for token recovery',
        );
      }

      if (platformCreditEligible) {
        immediateActions.push('Apply for platform credit as compensation');
        alternativeActions.push(
          'Contact support if credit option is not visible',
        );
      }
    } else {
      immediateActions.push('Contact support with transaction details');
      alternativeActions.push('Provide transaction hash and wallet addresses');
    }

    return {
      immediateActions,
      preventionTips,
      alternativeActions,
      escalationRequired: recoveryOptions.length === 0,
      contactSupport: recoveryOptions.length === 0 || platformCreditEligible,
    };
  }

  /**
   * Helper methods
   */
  private getProviderForChain(chain: string): ethers.providers.JsonRpcProvider {
    switch (chain) {
      case 'ethereum':
        return this.ethereumProvider;
      case 'polygon':
        return this.polygonProvider;
      case 'bsc':
        return this.bscProvider;
      case 'arbitrum':
        return this.arbitrumProvider;
      default:
        return this.ethereumProvider;
    }
  }

  private detectCrossChainIssue(
    request: CrossChainRecoveryRequest,
    sourceAnalysis: ChainAnalysis,
  ): boolean {
    return (
      request.sourceChain !== request.expectedChain &&
      sourceAnalysis.transactionExists
    );
  }

  private determineRecoveryStatus(
    sourceAnalysis: ChainAnalysis,
    destinationAnalysis: ChainAnalysis,
    tokenCompatibility: TokenCompatibility,
    platformCreditEligible: boolean,
  ): CrossChainRecoveryResult['recoveryStatus'] {
    if (platformCreditEligible) {
      return 'platform_credit_eligible';
    }

    if (tokenCompatibility.bridgeSupported) {
      return 'recoverable';
    }

    if (!sourceAnalysis.transactionExists) {
      return 'requires_manual_intervention';
    }

    return 'unrecoverable';
  }

  private assessRecoveryComplexity(
    tokenCompatibility: TokenCompatibility,
    recoveryOptions: RecoveryOption[],
  ): 'simple' | 'complex' | 'impossible' {
    if (recoveryOptions.length === 0) return 'impossible';
    if (tokenCompatibility.bridgeSupported) return 'simple';
    if (recoveryOptions.some((opt) => opt.automated)) return 'simple';
    return 'complex';
  }

  private async calculateRecoveryCosts(
    option: RecoveryOption,
  ): Promise<RecoveryCosts> {
    // Simplified cost calculation
    return {
      gasFees: '$5-15',
      bridgeFees: option.method === 'bridge_recovery' ? '$2-5' : undefined,
      serviceFees:
        option.method === 'third_party_service' ? '$10-25' : undefined,
      totalEstimated: option.cost,
      currency: 'USD',
    };
  }

  private async getTokenSymbol(
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<string> {
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function symbol() view returns (string)'],
        provider,
      );
      return await contract.symbol();
    } catch {
      return 'UNKNOWN';
    }
  }

  private async getTokenDecimals(
    tokenAddress: string,
    provider: ethers.providers.JsonRpcProvider,
  ): Promise<number> {
    try {
      const contract = new ethers.Contract(
        tokenAddress,
        ['function decimals() view returns (uint8)'],
        provider,
      );
      return await contract.decimals();
    } catch {
      return 18; // Default ERC20 decimals
    }
  }
}

export default CrossChainRecoverySystem;
