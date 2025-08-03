/**
 * ChangeNow Exchange Integration for Jerry's Wallet
 *
 * Provides real cryptocurrency exchange services for SOL/ETH/BTC → XMR conversion
 * Documentation: https://changenow.io/api/docs
 */

import axios, { AxiosInstance } from 'axios';

export interface ChangeNowQuote {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  estimatedAmount: number;
  minAmount: number;
  maxAmount: number;
  rateId: string;
  validUntil: Date;
  networkFee?: number;
  serviceFee?: number;
}

export interface ChangeNowExchange {
  id: string;
  status:
    | 'new'
    | 'waiting'
    | 'confirming'
    | 'exchanging'
    | 'sending'
    | 'finished'
    | 'failed'
    | 'refunded';
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  payinAddress: string;
  payoutAddress: string;
  payinHash?: string;
  payoutHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChangeNowExchangeRequest {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAddress: string;
  rateId?: string;
  refundAddress?: string;
  userId?: string;
}

export class ChangeNowAPI {
  private client: AxiosInstance;
  private apiKey: string;
  private baseUrl = 'https://api.changenow.io/v2';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.CHANGENOW_API_KEY || '';

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey && { 'x-changenow-api-key': this.apiKey }),
      },
    });

    console.log('ChangeNow API initialized', { hasApiKey: !!this.apiKey });
  }

  /**
   * Get estimated exchange amount
   */
  async getEstimate(
    fromCurrency: string,
    toCurrency: string,
    fromAmount: number,
  ): Promise<ChangeNowQuote> {
    try {
      const response = await this.client.get('/exchange/estimated-amount', {
        params: {
          fromCurrency: fromCurrency.toLowerCase(),
          toCurrency: toCurrency.toLowerCase(),
          fromAmount: fromAmount,
          fromNetwork: this.getNetworkForCurrency(fromCurrency),
          toNetwork: this.getNetworkForCurrency(toCurrency),
        },
      });

      const data = response.data;

      return {
        fromCurrency: fromCurrency.toUpperCase(),
        toCurrency: toCurrency.toUpperCase(),
        fromAmount: fromAmount,
        toAmount: data.toAmount,
        estimatedAmount: data.toAmount,
        minAmount: data.minAmount || 0,
        maxAmount: data.maxAmount || 999999,
        rateId: data.rateId || '',
        validUntil: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        networkFee: data.networkFee,
        serviceFee: data.serviceFee,
      };
    } catch (error) {
      console.error('ChangeNow estimate error:', error);
      throw new Error(`Failed to get exchange estimate: ${error}`);
    }
  }

  /**
   * Get minimum exchange amount
   */
  async getMinAmount(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    try {
      const response = await this.client.get('/exchange/min-amount', {
        params: {
          fromCurrency: fromCurrency.toLowerCase(),
          toCurrency: toCurrency.toLowerCase(),
          fromNetwork: this.getNetworkForCurrency(fromCurrency),
          toNetwork: this.getNetworkForCurrency(toCurrency),
        },
      });

      return response.data.minAmount;
    } catch (error) {
      console.error('ChangeNow min amount error:', error);
      throw new Error(`Failed to get minimum amount: ${error}`);
    }
  }

  /**
   * Create a new exchange
   */
  async createExchange(
    request: ChangeNowExchangeRequest,
  ): Promise<ChangeNowExchange> {
    try {
      const payload = {
        fromCurrency: request.fromCurrency.toLowerCase(),
        toCurrency: request.toCurrency.toLowerCase(),
        fromAmount: request.fromAmount,
        toAddress: request.toAddress,
        fromNetwork: this.getNetworkForCurrency(request.fromCurrency),
        toNetwork: this.getNetworkForCurrency(request.toCurrency),
        ...(request.rateId && { rateId: request.rateId }),
        ...(request.refundAddress && { refundAddress: request.refundAddress }),
        ...(request.userId && { userId: request.userId }),
      };

      const response = await this.client.post('/exchange', payload);
      const data = response.data;

      return {
        id: data.id,
        status: data.status,
        fromCurrency: request.fromCurrency.toUpperCase(),
        toCurrency: request.toCurrency.toUpperCase(),
        fromAmount: request.fromAmount,
        toAmount: data.toAmount,
        payinAddress: data.payinAddress,
        payoutAddress: data.payoutAddress,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error('ChangeNow create exchange error:', error);
      throw new Error(`Failed to create exchange: ${error}`);
    }
  }

  /**
   * Get exchange status
   */
  async getExchangeStatus(exchangeId: string): Promise<ChangeNowExchange> {
    try {
      const response = await this.client.get(`/exchange/by-id`, {
        params: { id: exchangeId },
      });

      const data = response.data;

      return {
        id: data.id,
        status: data.status,
        fromCurrency: data.fromCurrency.toUpperCase(),
        toCurrency: data.toCurrency.toUpperCase(),
        fromAmount: data.fromAmount,
        toAmount: data.toAmount,
        payinAddress: data.payinAddress,
        payoutAddress: data.payoutAddress,
        payinHash: data.payinHash,
        payoutHash: data.payoutHash,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error('ChangeNow status error:', error);
      throw new Error(`Failed to get exchange status: ${error}`);
    }
  }

  /**
   * Get available currencies
   */
  async getAvailableCurrencies(): Promise<string[]> {
    try {
      const response = await this.client.get('/exchange/currencies');
      return response.data.map((currency: any) =>
        currency.ticker.toUpperCase(),
      );
    } catch (error) {
      console.error('ChangeNow currencies error:', error);
      throw new Error(`Failed to get available currencies: ${error}`);
    }
  }

  /**
   * Validate address for specific currency
   */
  async validateAddress(currency: string, address: string): Promise<boolean> {
    try {
      const response = await this.client.get('/validate/address', {
        params: {
          currency: currency.toLowerCase(),
          address: address,
          network: this.getNetworkForCurrency(currency),
        },
      });

      return response.data.result === true;
    } catch (error) {
      console.error('ChangeNow address validation error:', error);
      return false;
    }
  }

  /**
   * Get network identifier for currency
   */
  private getNetworkForCurrency(currency: string): string {
    const networks: Record<string, string> = {
      SOL: 'sol',
      ETH: 'eth',
      BTC: 'btc',
      XMR: 'xmr',
    };

    return networks[currency.toUpperCase()] || currency.toLowerCase();
  }

  /**
   * Check if API key is configured
   */
  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  /**
   * Health check for ChangeNow API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.getAvailableCurrencies();
      return true;
    } catch (error) {
      console.error('ChangeNow health check failed:', error);
      return false;
    }
  }
}

export default ChangeNowAPI;
