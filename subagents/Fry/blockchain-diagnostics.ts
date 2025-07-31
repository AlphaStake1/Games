// subagents/Fry/blockchain-diagnostics.ts
/**
 * Enhanced Blockchain Diagnostic Capabilities for Fry
 *
 * Specialized tools for Solana, Anchor, and Web3 troubleshooting
 */

import {
  Connection,
  PublicKey,
  Transaction,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  AccountInfo,
  TransactionSignature,
  ConfirmedSignatureInfo,
} from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import CrossChainRecoverySystem, {
  CrossChainRecoveryRequest,
  CrossChainRecoveryResult,
} from './cross-chain-recovery';

export interface BlockchainDiagnosticRequest {
  type:
    | 'wallet'
    | 'transaction'
    | 'program'
    | 'rpc'
    | 'validator'
    | 'cross_chain_recovery';
  address?: string;
  programId?: string;
  transactionHash?: string;
  walletAddress?: string;
  errorMessage?: string;
  expectedBehavior?: string;
  // Cross-chain recovery specific fields
  sourceChain?: 'ethereum' | 'polygon' | 'solana' | 'bsc' | 'arbitrum';
  expectedChain?: 'ethereum' | 'polygon' | 'solana' | 'bsc' | 'arbitrum';
  platformWalletAddress?: string;
}

export interface BlockchainDiagnosticResult {
  issue: string;
  status: 'resolved' | 'identified' | 'investigating' | 'escalated';
  findings: DiagnosticFinding[];
  recommendations: string[];
  autoFixApplied?: string[];
  userActionRequired?: string[];
  technicalDetails: Record<string, any>;
  // Cross-chain recovery results
  crossChainRecovery?: CrossChainRecoveryResult;
}

export interface DiagnosticFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category:
    | 'connectivity'
    | 'balance'
    | 'program'
    | 'transaction'
    | 'configuration';
  description: string;
  evidence: any;
  resolution?: string;
}

export class BlockchainDiagnostics {
  private connection: Connection;
  private crossChainRecovery: CrossChainRecoverySystem;

  constructor(
    rpcEndpoint: string,
    crossChainConfig?: {
      ethereumRPC: string;
      polygonRPC: string;
      bscRPC: string;
      arbitrumRPC: string;
    },
  ) {
    this.connection = new Connection(rpcEndpoint, 'confirmed');

    if (crossChainConfig) {
      this.crossChainRecovery = new CrossChainRecoverySystem({
        solanaRPC: rpcEndpoint,
        ...crossChainConfig,
      });
    }
  }

  /**
   * Comprehensive blockchain diagnostic entry point
   */
  async diagnose(
    request: BlockchainDiagnosticRequest,
  ): Promise<BlockchainDiagnosticResult> {
    console.log(`🔗 Fry blockchain diagnosis: ${request.type}`);

    const findings: DiagnosticFinding[] = [];
    const recommendations: string[] = [];
    const autoFixApplied: string[] = [];
    let status: BlockchainDiagnosticResult['status'] = 'investigating';

    try {
      switch (request.type) {
        case 'wallet':
          await this.diagnoseWalletIssues(request, findings, recommendations);
          break;
        case 'transaction':
          await this.diagnoseTransactionIssues(
            request,
            findings,
            recommendations,
          );
          break;
        case 'program':
          await this.diagnoseProgramIssues(request, findings, recommendations);
          break;
        case 'rpc':
          await this.diagnoseRPCIssues(request, findings, recommendations);
          break;
        case 'validator':
          await this.diagnoseValidatorIssues(
            request,
            findings,
            recommendations,
          );
          break;
        case 'cross_chain_recovery':
          return await this.diagnoseCrossChainRecovery(request);
      }

      // Determine status based on findings
      const criticalFindings = findings.filter(
        (f) => f.severity === 'critical',
      );
      if (criticalFindings.length === 0) {
        status = findings.length > 0 ? 'identified' : 'resolved';
      }

      return {
        issue: request.type,
        status,
        findings,
        recommendations,
        autoFixApplied,
        technicalDetails: await this.gatherTechnicalContext(request),
      };
    } catch (error) {
      findings.push({
        severity: 'critical',
        category: 'connectivity',
        description: `Diagnostic system error: ${error.message}`,
        evidence: { error: error.stack },
      });

      return {
        issue: request.type,
        status: 'escalated',
        findings,
        recommendations: ['Manual investigation required'],
        technicalDetails: { diagnosticError: error.message },
      };
    }
  }

  /**
   * Diagnose wallet-related issues
   */
  private async diagnoseWalletIssues(
    request: BlockchainDiagnosticRequest,
    findings: DiagnosticFinding[],
    recommendations: string[],
  ) {
    if (!request.walletAddress) {
      findings.push({
        severity: 'medium',
        category: 'configuration',
        description: 'No wallet address provided',
        evidence: {},
      });
      return;
    }

    try {
      const walletPubkey = new PublicKey(request.walletAddress);

      // Check wallet existence and balance
      const accountInfo = await this.connection.getAccountInfo(walletPubkey);
      const balance = await this.connection.getBalance(walletPubkey);

      if (!accountInfo) {
        findings.push({
          severity: 'high',
          category: 'configuration',
          description: 'Wallet address not found on blockchain',
          evidence: { address: request.walletAddress },
          resolution: 'Verify wallet address is correct and on mainnet',
        });
      } else {
        findings.push({
          severity: 'info',
          category: 'balance',
          description: `Wallet balance: ${balance / LAMPORTS_PER_SOL} SOL`,
          evidence: { balance, lamports: balance },
        });
      }

      // Check for common wallet issues
      if (balance === 0) {
        findings.push({
          severity: 'medium',
          category: 'balance',
          description: 'Wallet has zero SOL balance',
          evidence: { balance: 0 },
          resolution: 'Fund wallet with SOL for transaction fees',
        });
        recommendations.push('Add SOL to wallet for gas fees');
      }

      // Check recent transaction activity
      const signatures = await this.connection.getSignaturesForAddress(
        walletPubkey,
        { limit: 5 },
      );

      if (signatures.length === 0) {
        findings.push({
          severity: 'info',
          category: 'transaction',
          description: 'No recent transaction history',
          evidence: { recentTransactions: 0 },
        });
      } else {
        const recentTx = signatures[0];
        findings.push({
          severity: 'info',
          category: 'transaction',
          description: `Last transaction: ${recentTx.signature}`,
          evidence: {
            lastTransaction: recentTx.signature,
            blockTime: recentTx.blockTime,
            slot: recentTx.slot,
          },
        });

        // Check if recent transactions failed
        const failedTx = signatures.filter((sig) => sig.err !== null);
        if (failedTx.length > 0) {
          findings.push({
            severity: 'medium',
            category: 'transaction',
            description: `${failedTx.length} recent transactions failed`,
            evidence: { failedTransactions: failedTx },
            resolution: 'Investigate transaction failure reasons',
          });
        }
      }

      // Check token accounts
      await this.checkTokenAccounts(walletPubkey, findings);
    } catch (error) {
      findings.push({
        severity: 'high',
        category: 'connectivity',
        description: `Wallet diagnostic failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Diagnose transaction issues
   */
  private async diagnoseTransactionIssues(
    request: BlockchainDiagnosticRequest,
    findings: DiagnosticFinding[],
    recommendations: string[],
  ) {
    if (!request.transactionHash) {
      findings.push({
        severity: 'medium',
        category: 'configuration',
        description: 'No transaction hash provided',
        evidence: {},
      });
      return;
    }

    try {
      const txHash = request.transactionHash;
      const transaction = await this.connection.getConfirmedTransaction(txHash);

      if (!transaction) {
        findings.push({
          severity: 'high',
          category: 'transaction',
          description: 'Transaction not found on blockchain',
          evidence: { transactionHash: txHash },
          resolution: 'Verify transaction hash is correct',
        });
        return;
      }

      // Check transaction status
      if (transaction.meta?.err) {
        findings.push({
          severity: 'high',
          category: 'transaction',
          description: 'Transaction failed',
          evidence: {
            error: transaction.meta.err,
            logs: transaction.meta.logMessages,
          },
          resolution: 'Analyze error logs for specific failure reason',
        });
        recommendations.push('Review transaction logs for error details');
      } else {
        findings.push({
          severity: 'info',
          category: 'transaction',
          description: 'Transaction succeeded',
          evidence: {
            slot: transaction.slot,
            blockTime: transaction.blockTime,
            fee: transaction.meta?.fee,
          },
        });
      }

      // Analyze transaction details
      const preBalances = transaction.meta?.preBalances || [];
      const postBalances = transaction.meta?.postBalances || [];

      if (preBalances.length > 0 && postBalances.length > 0) {
        const balanceChanges = preBalances.map((pre, index) => ({
          account: index,
          change: (postBalances[index] || 0) - pre,
        }));

        findings.push({
          severity: 'info',
          category: 'transaction',
          description: 'Balance changes analyzed',
          evidence: { balanceChanges },
        });
      }
    } catch (error) {
      findings.push({
        severity: 'high',
        category: 'connectivity',
        description: `Transaction diagnostic failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Diagnose Anchor program issues
   */
  private async diagnoseProgramIssues(
    request: BlockchainDiagnosticRequest,
    findings: DiagnosticFinding[],
    recommendations: string[],
  ) {
    if (!request.programId) {
      findings.push({
        severity: 'medium',
        category: 'configuration',
        description: 'No program ID provided',
        evidence: {},
      });
      return;
    }

    try {
      const programPubkey = new PublicKey(request.programId);
      const programAccount =
        await this.connection.getAccountInfo(programPubkey);

      if (!programAccount) {
        findings.push({
          severity: 'critical',
          category: 'program',
          description: 'Program not found on blockchain',
          evidence: { programId: request.programId },
          resolution: 'Verify program ID and deployment status',
        });
        return;
      }

      // Check if account is executable (is a program)
      if (!programAccount.executable) {
        findings.push({
          severity: 'critical',
          category: 'program',
          description: 'Account is not an executable program',
          evidence: {
            executable: programAccount.executable,
            owner: programAccount.owner.toBase58(),
          },
          resolution: 'Verify this is the correct program address',
        });
      } else {
        findings.push({
          severity: 'info',
          category: 'program',
          description: 'Program found and executable',
          evidence: {
            programId: request.programId,
            dataLength: programAccount.data.length,
            owner: programAccount.owner.toBase58(),
          },
        });
      }

      // Check program data accounts (if any)
      await this.checkProgramDataAccounts(programPubkey, findings);
    } catch (error) {
      findings.push({
        severity: 'high',
        category: 'connectivity',
        description: `Program diagnostic failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Diagnose RPC connection issues
   */
  private async diagnoseRPCIssues(
    request: BlockchainDiagnosticRequest,
    findings: DiagnosticFinding[],
    recommendations: string[],
  ) {
    try {
      // Test basic RPC health
      const startTime = Date.now();
      const health = await this.connection.getHealth();
      const responseTime = Date.now() - startTime;

      if (health === 'ok') {
        findings.push({
          severity: 'info',
          category: 'connectivity',
          description: `RPC healthy (${responseTime}ms response)`,
          evidence: { health, responseTime },
        });
      } else {
        findings.push({
          severity: 'high',
          category: 'connectivity',
          description: 'RPC health check failed',
          evidence: { health, responseTime },
          resolution: 'Try alternative RPC endpoint',
        });
        recommendations.push('Switch to backup RPC provider');
      }

      // Test RPC performance
      if (responseTime > 2000) {
        findings.push({
          severity: 'medium',
          category: 'connectivity',
          description: 'RPC response time is slow',
          evidence: { responseTime },
          resolution: 'Consider using faster RPC endpoint',
        });
      }

      // Check current slot and block height
      const slot = await this.connection.getSlot();
      const blockHeight = await this.connection.getBlockHeight();

      findings.push({
        severity: 'info',
        category: 'connectivity',
        description: 'RPC sync status',
        evidence: { slot, blockHeight, syncTime: new Date() },
      });

      // Test transaction sending capability
      const recentBlockhash = await this.connection.getLatestBlockhash();
      findings.push({
        severity: 'info',
        category: 'connectivity',
        description: 'Recent blockhash retrieved successfully',
        evidence: {
          blockhash: recentBlockhash.blockhash,
          lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
        },
      });
    } catch (error) {
      findings.push({
        severity: 'critical',
        category: 'connectivity',
        description: `RPC diagnostic failed: ${error.message}`,
        evidence: { error: error.message },
        resolution: 'Check network connection and RPC endpoint',
      });
      recommendations.push('Verify RPC endpoint URL and network connectivity');
    }
  }

  /**
   * Diagnose cross-chain recovery scenarios
   */
  private async diagnoseCrossChainRecovery(
    request: BlockchainDiagnosticRequest,
  ): Promise<BlockchainDiagnosticResult> {
    if (!this.crossChainRecovery) {
      return {
        issue: 'Cross-chain recovery not configured',
        status: 'escalated',
        findings: [
          {
            severity: 'high',
            category: 'configuration',
            description: 'Cross-chain recovery system not initialized',
            evidence: {
              missingConfig: 'Cross-chain RPC endpoints not provided',
            },
            resolution:
              'Configure cross-chain RPC endpoints to enable recovery analysis',
          },
        ],
        recommendations: [
          'Configure cross-chain RPC endpoints',
          'Contact support for manual recovery',
        ],
        technicalDetails: {
          error: 'Cross-chain recovery system not available',
        },
      };
    }

    if (
      !request.transactionHash ||
      !request.sourceChain ||
      !request.expectedChain ||
      !request.walletAddress
    ) {
      return {
        issue: 'Insufficient cross-chain recovery information',
        status: 'escalated',
        findings: [
          {
            severity: 'medium',
            category: 'configuration',
            description:
              'Missing required information for cross-chain recovery analysis',
            evidence: {
              providedFields: {
                transactionHash: !!request.transactionHash,
                sourceChain: !!request.sourceChain,
                expectedChain: !!request.expectedChain,
                walletAddress: !!request.walletAddress,
              },
            },
            resolution:
              'Provide transaction hash, source chain, expected chain, and wallet address',
          },
        ],
        recommendations: [
          'Provide the transaction hash from the original transfer',
          'Specify which blockchain the tokens were sent from',
          'Specify which blockchain the tokens should have been sent to',
          'Provide the wallet address that sent the tokens',
        ],
        technicalDetails: {
          missingFields: [
            'transactionHash',
            'sourceChain',
            'expectedChain',
            'walletAddress',
          ],
        },
      };
    }

    try {
      const recoveryRequest: CrossChainRecoveryRequest = {
        transactionHash: request.transactionHash,
        sourceChain: request.sourceChain,
        expectedChain: request.expectedChain,
        userWalletAddress: request.walletAddress,
        platformWalletAddress:
          request.platformWalletAddress ||
          process.env.PLATFORM_WALLET_ADDRESS ||
          '',
        tokenAddress: request.address,
      };

      const recoveryResult =
        await this.crossChainRecovery.analyzeRecovery(recoveryRequest);

      // Convert recovery result to diagnostic format
      const findings: DiagnosticFinding[] = [];
      const recommendations: string[] = [];

      // Add findings based on recovery analysis
      if (recoveryResult.transactionFound) {
        findings.push({
          severity: 'info',
          category: 'transaction',
          description: `Transaction found on ${request.sourceChain}`,
          evidence: recoveryResult.technicalAnalysis.sourceChainAnalysis,
        });
      } else {
        findings.push({
          severity: 'high',
          category: 'transaction',
          description: `Transaction not found on ${request.sourceChain}`,
          evidence: { transactionHash: request.transactionHash },
          resolution:
            'Verify transaction hash is correct and from the right blockchain',
        });
      }

      if (recoveryResult.crossChainDetected) {
        findings.push({
          severity: 'high',
          category: 'transaction',
          description: `Cross-chain transaction detected: ${request.sourceChain} → ${request.expectedChain}`,
          evidence: {
            sourceChain: request.sourceChain,
            expectedChain: request.expectedChain,
            recoveryStatus: recoveryResult.recoveryStatus,
          },
        });
      }

      if (recoveryResult.platformCreditEligible) {
        findings.push({
          severity: 'info',
          category: 'balance',
          description: 'Eligible for platform credit compensation',
          evidence: { creditEligible: true },
          resolution: 'Apply for platform credit through support system',
        });
        recommendations.push(
          'Apply for platform credit as immediate compensation',
        );
      }

      // Add recovery options as recommendations
      recoveryResult.recoveryOptions.forEach((option, index) => {
        recommendations.push(
          `Option ${index + 1}: ${option.description} (${option.successRate}% success rate, ${option.estimatedTime})`,
        );
      });

      // Add user guidance
      recommendations.push(...recoveryResult.userGuidance.immediateActions);

      const status = this.mapRecoveryStatusToDiagnostic(
        recoveryResult.recoveryStatus,
      );

      return {
        issue: `Cross-chain recovery analysis: ${recoveryResult.recoveryStatus}`,
        status,
        findings,
        recommendations,
        userActionRequired: recoveryResult.userGuidance.immediateActions,
        technicalDetails: {
          ...recoveryResult.technicalAnalysis,
          estimatedCosts: recoveryResult.estimatedCosts,
          recoveryTime: recoveryResult.estimatedRecoveryTime,
        },
        crossChainRecovery: recoveryResult,
      };
    } catch (error) {
      return {
        issue: 'Cross-chain recovery analysis failed',
        status: 'escalated',
        findings: [
          {
            severity: 'critical',
            category: 'connectivity',
            description: `Cross-chain recovery analysis error: ${error.message}`,
            evidence: { error: error.stack },
            resolution:
              'Contact support for manual cross-chain recovery investigation',
          },
        ],
        recommendations: [
          'Contact support with transaction details',
          'Provide screenshot of the failed transaction',
          'Include wallet addresses and expected destination',
        ],
        technicalDetails: { error: error.message },
      };
    }
  }

  /**
   * Map recovery status to diagnostic status
   */
  private mapRecoveryStatusToDiagnostic(
    recoveryStatus: CrossChainRecoveryResult['recoveryStatus'],
  ): BlockchainDiagnosticResult['status'] {
    switch (recoveryStatus) {
      case 'recoverable':
      case 'platform_credit_eligible':
        return 'resolved';
      case 'unrecoverable':
        return 'escalated';
      case 'requires_manual_intervention':
        return 'investigating';
      default:
        return 'investigating';
    }
  }

  /**
   * Diagnose validator issues (for node operators)
   */
  private async diagnoseValidatorIssues(
    request: BlockchainDiagnosticRequest,
    findings: DiagnosticFinding[],
    recommendations: string[],
  ) {
    try {
      // Get cluster nodes
      const clusterNodes = await this.connection.getClusterNodes();

      findings.push({
        severity: 'info',
        category: 'validator',
        description: `Cluster has ${clusterNodes.length} nodes`,
        evidence: { nodeCount: clusterNodes.length },
      });

      // Check vote accounts
      const voteAccounts = await this.connection.getVoteAccounts();

      findings.push({
        severity: 'info',
        category: 'validator',
        description: 'Vote account status',
        evidence: {
          current: voteAccounts.current.length,
          delinquent: voteAccounts.delinquent.length,
        },
      });

      if (voteAccounts.delinquent.length > 0) {
        findings.push({
          severity: 'medium',
          category: 'validator',
          description: `${voteAccounts.delinquent.length} delinquent validators`,
          evidence: { delinquentValidators: voteAccounts.delinquent },
          resolution: 'Monitor validator performance',
        });
      }

      // Check epoch info
      const epochInfo = await this.connection.getEpochInfo();

      findings.push({
        severity: 'info',
        category: 'validator',
        description: 'Current epoch status',
        evidence: {
          epoch: epochInfo.epoch,
          slotIndex: epochInfo.slotIndex,
          slotsInEpoch: epochInfo.slotsInEpoch,
        },
      });
    } catch (error) {
      findings.push({
        severity: 'high',
        category: 'connectivity',
        description: `Validator diagnostic failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Check token accounts for a wallet
   */
  private async checkTokenAccounts(
    walletPubkey: PublicKey,
    findings: DiagnosticFinding[],
  ) {
    try {
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        walletPubkey,
        { programId: TOKEN_PROGRAM_ID },
      );

      if (tokenAccounts.value.length === 0) {
        findings.push({
          severity: 'info',
          category: 'balance',
          description: 'No token accounts found',
          evidence: { tokenAccounts: 0 },
        });
      } else {
        const tokens = tokenAccounts.value.map((account) => {
          const data = account.account.data.parsed?.info;
          return {
            mint: data?.mint,
            balance: data?.tokenAmount?.uiAmount,
            decimals: data?.tokenAmount?.decimals,
          };
        });

        findings.push({
          severity: 'info',
          category: 'balance',
          description: `Found ${tokens.length} token accounts`,
          evidence: { tokenAccounts: tokens },
        });
      }
    } catch (error) {
      findings.push({
        severity: 'medium',
        category: 'balance',
        description: `Token account check failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Check program data accounts
   */
  private async checkProgramDataAccounts(
    programPubkey: PublicKey,
    findings: DiagnosticFinding[],
  ) {
    try {
      // Look for program data accounts (simplified)
      const programAccounts = await this.connection.getProgramAccounts(
        programPubkey,
        {
          dataSlice: { offset: 0, length: 0 }, // Just count
        },
      );

      findings.push({
        severity: 'info',
        category: 'program',
        description: `Program has ${programAccounts.length} data accounts`,
        evidence: { dataAccounts: programAccounts.length },
      });
    } catch (error) {
      findings.push({
        severity: 'medium',
        category: 'program',
        description: `Program data account check failed: ${error.message}`,
        evidence: { error: error.message },
      });
    }
  }

  /**
   * Gather technical context for diagnosis
   */
  private async gatherTechnicalContext(request: BlockchainDiagnosticRequest) {
    const context: Record<string, any> = {
      timestamp: new Date().toISOString(),
      requestType: request.type,
    };

    try {
      // Add network context
      context.network = {
        slot: await this.connection.getSlot(),
        blockHeight: await this.connection.getBlockHeight(),
        epochInfo: await this.connection.getEpochInfo(),
      };

      // Add performance context
      const startTime = Date.now();
      await this.connection.getHealth();
      context.rpcPerformance = {
        healthCheckTime: Date.now() - startTime,
      };
    } catch (error) {
      context.contextError = error.message;
    }

    return context;
  }

  /**
   * Suggest auto-fixes for common blockchain issues
   */
  async suggestAutoFixes(
    findings: DiagnosticFinding[],
  ): Promise<
    { action: string; automated: boolean; risk: 'low' | 'medium' | 'high' }[]
  > {
    const fixes = [];

    // Analyze findings and suggest fixes
    for (const finding of findings) {
      if (finding.category === 'connectivity' && finding.severity === 'high') {
        fixes.push({
          action: 'Switch to backup RPC endpoint',
          automated: true,
          risk: 'low' as const,
        });
      }

      if (
        finding.category === 'balance' &&
        finding.description.includes('zero SOL')
      ) {
        fixes.push({
          action: 'Suggest wallet funding options',
          automated: false,
          risk: 'low' as const,
        });
      }
    }

    return fixes;
  }
}

export default BlockchainDiagnostics;
