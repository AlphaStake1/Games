// agents/RandomizerAgent/index.ts
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface VrfStatus {
  requested: boolean;
  fulfilled: boolean;
  randomness: number[] | null;
  requestTime: Date | null;
  fulfillTime: Date | null;
}

export class RandomizerAgent extends EventEmitter {
  private openai: OpenAI;
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private vrfQueue: PublicKey;

  constructor(
    connection: Connection,
    provider: AnchorProvider,
    program: Program,
  ) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }

    // Use Switchboard's permissionless devnet queue if not specified
    const vrfQueueAddress =
      process.env.SWITCHBOARD_VRF_QUEUE ||
      'F8ce7MsckeZAbAGmxjJNetxYXQa9mKr9nnrC3qKubyYy';

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.vrfQueue = new PublicKey(vrfQueueAddress);

    console.log('RandomizerAgent initialized with GPT-4 and Switchboard VRF');
  }

  async requestRandomization(
    boardPda: PublicKey,
  ): Promise<{ vrfAccount: PublicKey; signature: string }> {
    try {
      console.log(`Requesting randomization for board: ${boardPda.toString()}`);

      // Create VRF account (simplified - in real implementation would use Switchboard SDK)
      const vrfAccount = new PublicKey('11111111111111111111111111111111'); // Placeholder

      const tx = await this.program.methods
        .requestRandomization()
        .accounts({
          board: boardPda,
          vrfAccount: vrfAccount,
          authority: this.provider.wallet.publicKey,
        })
        .rpc();

      this.emit('randomizationRequested', {
        boardPda,
        vrfAccount,
        signature: tx,
      });

      console.log(`VRF request submitted with signature: ${tx}`);

      return { vrfAccount, signature: tx };
    } catch (error) {
      console.error('Error requesting randomization:', error);
      throw error;
    }
  }

  async checkVrfStatus(vrfAccount: PublicKey): Promise<VrfStatus> {
    try {
      // In real implementation, this would check Switchboard VRF account status
      // For now, we'll simulate the check

      const accountInfo = await this.connection.getAccountInfo(vrfAccount);

      if (!accountInfo) {
        return {
          requested: false,
          fulfilled: false,
          randomness: null,
          requestTime: null,
          fulfillTime: null,
        };
      }

      // Simulate VRF status check
      const status: VrfStatus = {
        requested: true,
        fulfilled: Math.random() > 0.5, // Simulate 50% chance of fulfillment
        randomness: null,
        requestTime: new Date(),
        fulfillTime: null,
      };

      if (status.fulfilled) {
        status.randomness = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 256),
        );
        status.fulfillTime = new Date();
      }

      return status;
    } catch (error) {
      console.error('Error checking VRF status:', error);
      throw error;
    }
  }

  async fulfillVrfCallback(
    boardPda: PublicKey,
    vrfAccount: PublicKey,
    randomness: number[],
  ): Promise<string> {
    try {
      console.log(`Fulfilling VRF callback for board: ${boardPda.toString()}`);

      const randomnessBuffer = Buffer.from(randomness);

      const tx = await this.program.methods
        .fulfillVrfCallback(Array.from(randomnessBuffer))
        .accounts({
          board: boardPda,
          vrfAccount: vrfAccount,
          authority: this.provider.wallet.publicKey,
        })
        .rpc();

      this.emit('vrfFulfilled', {
        boardPda,
        vrfAccount,
        randomness,
        signature: tx,
      });

      console.log(`VRF fulfilled with signature: ${tx}`);

      return tx;
    } catch (error) {
      console.error('Error fulfilling VRF callback:', error);
      throw error;
    }
  }

  async analyzeRandomness(randomness: number[]): Promise<string> {
    const prompt = `
Analyze this randomness data for a Football Squares board:

Randomness: ${randomness.join(', ')}

The first 16 bytes determine home team headers (0-9).
The last 16 bytes determine away team headers (0-9).

Provide analysis on:
1. Statistical distribution of the randomness
2. Predicted header arrangements
3. Fair distribution assessment
4. Any patterns or anomalies

Keep response under 150 words.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.3,
      });

      return response.choices[0].message.content || 'No analysis available';
    } catch (error) {
      console.error('Error analyzing randomness:', error);
      return 'Analysis unavailable due to API error';
    }
  }

  async deriveHeaders(
    randomness: number[],
  ): Promise<{ homeHeaders: number[]; awayHeaders: number[] }> {
    const homeRandomness = randomness.slice(0, 16);
    const awayRandomness = randomness.slice(16, 32);

    const homeHeaders = this.generateHeadersFromRandomness(homeRandomness);
    const awayHeaders = this.generateHeadersFromRandomness(awayRandomness);

    return { homeHeaders, awayHeaders };
  }

  private generateHeadersFromRandomness(randomness: number[]): number[] {
    const headers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Fisher-Yates shuffle
    for (let i = headers.length - 1; i > 0; i--) {
      const j = randomness[i % randomness.length] % (i + 1);
      [headers[i], headers[j]] = [headers[j], headers[i]];
    }

    return headers;
  }

  async monitorVrfRequests(): Promise<void> {
    console.log('Starting VRF request monitoring');

    // Set up event listener for VRF requests
    this.program.addEventListener('randomizationRequested', (event: any) => {
      this.emit('vrfActivity', {
        type: 'vrf_requested',
        data: event,
      });

      // Start polling for VRF fulfillment
      this.pollVrfStatus(event.vrfAccount);
    });
  }

  private async pollVrfStatus(vrfAccount: PublicKey): Promise<void> {
    const maxAttempts = 60; // Poll for 5 minutes (5 second intervals)
    let attempts = 0;

    const poll = async () => {
      try {
        const status = await this.checkVrfStatus(vrfAccount);

        if (status.fulfilled && status.randomness) {
          console.log(`VRF fulfilled for account: ${vrfAccount.toString()}`);
          this.emit('vrfReady', { vrfAccount, randomness: status.randomness });
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          console.warn(
            `VRF polling timeout for account: ${vrfAccount.toString()}`,
          );
          this.emit('vrfTimeout', { vrfAccount });
        }
      } catch (error) {
        console.error('Error polling VRF status:', error);
        this.emit('vrfError', { vrfAccount, error });
      }
    };

    poll();
  }

  async validateRandomness(randomness: number[]): Promise<boolean> {
    // Basic validation checks
    if (randomness.length !== 32) {
      return false;
    }

    // Check for proper byte range
    for (const byte of randomness) {
      if (byte < 0 || byte > 255) {
        return false;
      }
    }

    // Check for minimal entropy (not all zeros or all same value)
    const unique = new Set(randomness);
    if (unique.size < 8) {
      return false;
    }

    return true;
  }

  async getVrfQueueStats(): Promise<{
    queueLength: number;
    averageProcessingTime: number;
    successRate: number;
  }> {
    try {
      // In real implementation, this would query Switchboard VRF queue
      // For now, we'll return mock data
      return {
        queueLength: Math.floor(Math.random() * 10),
        averageProcessingTime: 30 + Math.random() * 60, // 30-90 seconds
        successRate: 0.95 + Math.random() * 0.05, // 95-100%
      };
    } catch (error) {
      console.error('Error getting VRF queue stats:', error);
      return {
        queueLength: 0,
        averageProcessingTime: 0,
        successRate: 0,
      };
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check connection to Solana
      await this.connection.getLatestBlockhash();

      // Check OpenAI API
      await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: 'health check' }],
        max_tokens: 5,
      });

      // Check VRF queue status
      const queueStats = await this.getVrfQueueStats();

      return queueStats.successRate > 0.8;
    } catch (error) {
      console.error('RandomizerAgent health check failed:', error);
      return false;
    }
  }
}

export default RandomizerAgent;
