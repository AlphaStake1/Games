/**
 * Monero Wallet Integration for Jerry's Wallet
 *
 * Provides real Monero wallet functionality for receiving and sending XMR
 * Based on monero-javascript and Monero RPC wallet
 */

import { EventEmitter } from 'events';
import axios, { AxiosInstance } from 'axios';

export interface MoneroWalletConfig {
  daemonHost?: string;
  daemonPort?: number;
  walletHost?: string;
  walletPort?: number;
  username?: string;
  password?: string;
  walletName?: string;
  walletPassword?: string;
}

export interface MoneroBalance {
  balance: number;
  unlockedBalance: number;
  blocksToUnlock: number;
}

export interface MoneroAddress {
  address: string;
  label?: string;
  addressIndex: number;
  used: boolean;
}

export interface MoneroTransfer {
  amount: number;
  address: string;
  paymentId?: string;
  priority?: 'default' | 'unimportant' | 'normal' | 'elevated';
  mixin?: number;
  accountIndex?: number;
  subaddressIndices?: number[];
}

export interface MoneroTransaction {
  txHash: string;
  amount: number;
  fee: number;
  confirmations: number;
  height: number;
  timestamp: Date;
  paymentId?: string;
  type: 'incoming' | 'outgoing';
  address?: string;
}

export class MoneroWallet extends EventEmitter {
  private rpcClient: AxiosInstance;
  private config: MoneroWalletConfig;
  private isConnected = false;
  private walletHeight = 0;

  constructor(config: MoneroWalletConfig = {}) {
    super();

    this.config = {
      daemonHost: config.daemonHost || 'localhost',
      daemonPort: config.daemonPort || 18081,
      walletHost: config.walletHost || 'localhost',
      walletPort: config.walletPort || 18083,
      username: config.username || '',
      password: config.password || '',
      walletName: config.walletName || 'jerry_wallet',
      walletPassword: config.walletPassword || '',
    };

    // Initialize RPC client for wallet operations
    this.rpcClient = axios.create({
      baseURL: `http://${this.config.walletHost}:${this.config.walletPort}/json_rpc`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(this.config.username &&
        this.config.password && {
          auth: {
            username: this.config.username,
            password: this.config.password,
          },
        }),
    });

    console.log('Monero Wallet initialized:', {
      walletHost: this.config.walletHost,
      walletPort: this.config.walletPort,
      walletName: this.config.walletName,
    });
  }

  /**
   * Initialize and open Monero wallet
   */
  async initialize(): Promise<void> {
    try {
      // Try to open existing wallet first
      try {
        await this.openWallet(
          this.config.walletName!,
          this.config.walletPassword!,
        );
        console.log('Existing Monero wallet opened successfully');
      } catch (error) {
        // If wallet doesn't exist, create a new one
        console.log('Creating new Monero wallet...');
        await this.createWallet(
          this.config.walletName!,
          this.config.walletPassword!,
        );
      }

      // Start wallet refresh
      await this.refresh();

      // Get initial balance and address
      const balance = await this.getBalance();
      const address = await this.getAddress();

      this.isConnected = true;
      this.emit('walletReady', { balance, address });

      console.log('Monero wallet ready:', {
        address: address.address,
        balance: balance.balance,
        unlockedBalance: balance.unlockedBalance,
      });
    } catch (error) {
      console.error('Failed to initialize Monero wallet:', error);
      throw error;
    }
  }

  /**
   * Create a new Monero wallet
   */
  async createWallet(walletName: string, password: string): Promise<void> {
    const response = await this.rpcCall('create_wallet', {
      filename: walletName,
      password: password,
      language: 'English',
    });

    if (response.error) {
      throw new Error(`Failed to create wallet: ${response.error.message}`);
    }
  }

  /**
   * Open existing Monero wallet
   */
  async openWallet(walletName: string, password: string): Promise<void> {
    const response = await this.rpcCall('open_wallet', {
      filename: walletName,
      password: password,
    });

    if (response.error) {
      throw new Error(`Failed to open wallet: ${response.error.message}`);
    }
  }

  /**
   * Get wallet balance
   */
  async getBalance(accountIndex: number = 0): Promise<MoneroBalance> {
    const response = await this.rpcCall('get_balance', {
      account_index: accountIndex,
    });

    if (response.error) {
      throw new Error(`Failed to get balance: ${response.error.message}`);
    }

    return {
      balance: response.result.balance / 1e12, // Convert from atomic units
      unlockedBalance: response.result.unlocked_balance / 1e12,
      blocksToUnlock: response.result.blocks_to_unlock || 0,
    };
  }

  /**
   * Get primary wallet address
   */
  async getAddress(
    accountIndex: number = 0,
    addressIndex: number = 0,
  ): Promise<MoneroAddress> {
    const response = await this.rpcCall('get_address', {
      account_index: accountIndex,
      address_index: [addressIndex],
    });

    if (response.error) {
      throw new Error(`Failed to get address: ${response.error.message}`);
    }

    const addressData = response.result.addresses[0];

    return {
      address: addressData.address,
      label: addressData.label,
      addressIndex: addressData.address_index,
      used: addressData.used || false,
    };
  }

  /**
   * Create new subaddress for receiving
   */
  async createSubaddress(
    accountIndex: number = 0,
    label?: string,
  ): Promise<MoneroAddress> {
    const response = await this.rpcCall('create_address', {
      account_index: accountIndex,
      label: label,
    });

    if (response.error) {
      throw new Error(`Failed to create subaddress: ${response.error.message}`);
    }

    return {
      address: response.result.address,
      addressIndex: response.result.address_index,
      label: label,
      used: false,
    };
  }

  /**
   * Send Monero to specified address
   */
  async transfer(transfer: MoneroTransfer): Promise<MoneroTransaction> {
    try {
      // Convert XMR amount to atomic units
      const atomicAmount = Math.floor(transfer.amount * 1e12);

      const response = await this.rpcCall('transfer', {
        destinations: [
          {
            address: transfer.address,
            amount: atomicAmount,
          },
        ],
        account_index: transfer.accountIndex || 0,
        subaddr_indices: transfer.subaddressIndices,
        priority: this.getPriorityValue(transfer.priority),
        mixin: transfer.mixin || 10,
        unlock_time: 0,
        payment_id: transfer.paymentId,
        get_tx_key: true,
        get_tx_hex: true,
        get_tx_metadata: true,
      });

      if (response.error) {
        throw new Error(`Transfer failed: ${response.error.message}`);
      }

      const result = response.result;

      const transaction: MoneroTransaction = {
        txHash: result.tx_hash,
        amount: transfer.amount,
        fee: result.fee / 1e12, // Convert from atomic units
        confirmations: 0, // New transaction
        height: 0, // Not yet in block
        timestamp: new Date(),
        paymentId: transfer.paymentId,
        type: 'outgoing',
        address: transfer.address,
      };

      this.emit('transactionSent', transaction);

      console.log('Monero transfer successful:', {
        txHash: transaction.txHash,
        amount: transaction.amount,
        fee: transaction.fee,
        recipient: transfer.address,
      });

      return transaction;
    } catch (error) {
      console.error('Monero transfer error:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   */
  async getTransactions(
    accountIndex: number = 0,
  ): Promise<MoneroTransaction[]> {
    const response = await this.rpcCall('get_transfers', {
      account_index: accountIndex,
      in: true,
      out: true,
      pending: true,
      failed: true,
      pool: true,
    });

    if (response.error) {
      throw new Error(`Failed to get transactions: ${response.error.message}`);
    }

    const transactions: MoneroTransaction[] = [];
    const result = response.result;

    // Process incoming transactions
    if (result.in) {
      for (const tx of result.in) {
        transactions.push({
          txHash: tx.txid,
          amount: tx.amount / 1e12,
          fee: 0, // Incoming transactions don't have fees for recipient
          confirmations: tx.confirmations,
          height: tx.height,
          timestamp: new Date(tx.timestamp * 1000),
          paymentId: tx.payment_id,
          type: 'incoming',
          address: tx.address,
        });
      }
    }

    // Process outgoing transactions
    if (result.out) {
      for (const tx of result.out) {
        transactions.push({
          txHash: tx.txid,
          amount: tx.amount / 1e12,
          fee: tx.fee / 1e12,
          confirmations: tx.confirmations,
          height: tx.height,
          timestamp: new Date(tx.timestamp * 1000),
          paymentId: tx.payment_id,
          type: 'outgoing',
          address: tx.destinations?.[0]?.address,
        });
      }
    }

    return transactions.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  /**
   * Refresh wallet (sync with blockchain)
   */
  async refresh(): Promise<void> {
    const response = await this.rpcCall('refresh');

    if (response.error) {
      throw new Error(`Failed to refresh wallet: ${response.error.message}`);
    }

    this.walletHeight = response.result.blocks_fetched || 0;
    console.log('Wallet refreshed, height:', this.walletHeight);
  }

  /**
   * Get wallet height (sync status)
   */
  async getHeight(): Promise<number> {
    const response = await this.rpcCall('get_height');

    if (response.error) {
      throw new Error(`Failed to get height: ${response.error.message}`);
    }

    return response.result.height;
  }

  /**
   * Validate Monero address
   */
  async validateAddress(address: string): Promise<boolean> {
    try {
      const response = await this.rpcCall('validate_address', {
        address: address,
      });

      return !response.error && response.result.valid === true;
    } catch (error) {
      console.error('Address validation error:', error);
      return false;
    }
  }

  /**
   * Close wallet
   */
  async close(): Promise<void> {
    if (this.isConnected) {
      await this.rpcCall('close_wallet');
      this.isConnected = false;
      console.log('Monero wallet closed');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      await this.getHeight();
      return true;
    } catch (error) {
      console.error('Monero wallet health check failed:', error);
      return false;
    }
  }

  /**
   * Make RPC call to Monero wallet
   */
  private async rpcCall(method: string, params: any = {}): Promise<any> {
    try {
      const payload = {
        jsonrpc: '2.0',
        id: Date.now().toString(),
        method: method,
        params: params,
      };

      const response = await this.rpcClient.post('', payload);
      return response.data;
    } catch (error) {
      console.error(`Monero RPC call failed [${method}]:`, error);
      throw error;
    }
  }

  /**
   * Convert priority string to numeric value
   */
  private getPriorityValue(priority?: string): number {
    const priorities: Record<string, number> = {
      unimportant: 1,
      normal: 2,
      elevated: 3,
      default: 2,
    };

    return priorities[priority || 'default'] || 2;
  }

  /**
   * Get connection status
   */
  isWalletConnected(): boolean {
    return this.isConnected;
  }
}

export default MoneroWallet;
