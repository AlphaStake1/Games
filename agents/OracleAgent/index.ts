// agents/OracleAgent/index.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { OpenAI } from 'openai';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface GameScore {
  homeScore: number;
  awayScore: number;
  quarter: number;
  timeRemaining: string;
  gameStatus: 'scheduled' | 'in_progress' | 'halftime' | 'finished';
  lastUpdate: Date;
}

interface OracleData {
  feedAddress: PublicKey;
  lastUpdate: Date;
  confidence: number;
  value: number;
}

export class OracleAgent extends EventEmitter {
  private openai: OpenAI;
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private scoreFeed: PublicKey;
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(connection: Connection, provider: AnchorProvider, program: Program) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required');
    }
    
    if (!process.env.SWITCHBOARD_SCORE_FEED) {
      throw new Error('SWITCHBOARD_SCORE_FEED is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.scoreFeed = new PublicKey(process.env.SWITCHBOARD_SCORE_FEED);

    console.log('OracleAgent initialized with GPT-4 and Switchboard Oracle');
  }

  async fetchScores(gameId: number): Promise<GameScore> {
    try {
      console.log(`Fetching scores for game ${gameId}`);

      // In real implementation, this would query Switchboard oracle
      // For now, we'll simulate score fetching
      const score = await this.simulateScoreFetch(gameId);
      
      // Update on-chain score if game is in progress
      if (score.gameStatus === 'in_progress' || score.gameStatus === 'finished') {
        await this.recordScore(gameId, score);
      }

      this.emit('scoresUpdated', { gameId, score });
      
      return score;
    } catch (error) {
      console.error('Error fetching scores:', error);
      throw error;
    }
  }

  private async simulateScoreFetch(gameId: number): Promise<GameScore> {
    // Simulate realistic NFL scoring patterns
    const quarter = Math.floor(Math.random() * 4) + 1;
    const homeScore = Math.floor(Math.random() * 35);
    const awayScore = Math.floor(Math.random() * 35);
    
    const gameStatuses = ['scheduled', 'in_progress', 'halftime', 'finished'] as const;
    const gameStatus = gameStatuses[Math.floor(Math.random() * gameStatuses.length)];
    
    const timeRemaining = quarter < 4 ? `${Math.floor(Math.random() * 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : '00:00';

    return {
      homeScore,
      awayScore,
      quarter,
      timeRemaining,
      gameStatus,
      lastUpdate: new Date(),
    };
  }

  async recordScore(gameId: number, score: GameScore): Promise<string> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.program.programId
      );

      const tx = await this.program.methods
        .recordScore(score.homeScore, score.awayScore, score.quarter)
        .accounts({
          board: boardPda,
          authority: this.provider.wallet.publicKey,
        })
        .rpc();

      this.emit('scoreRecorded', { gameId, score, signature: tx });
      
      console.log(`Score recorded for game ${gameId}: ${score.homeScore}-${score.awayScore} Q${score.quarter}`);
      
      return tx;
    } catch (error) {
      console.error('Error recording score:', error);
      throw error;
    }
  }

  async pollGameStatus(gameId: number): Promise<void> {
    console.log(`Starting game status polling for game ${gameId}`);
    
    const pollInterval = parseInt(process.env.SCORE_POLL_INTERVAL || '30000');
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const score = await this.fetchScores(gameId);
        
        if (score.gameStatus === 'finished') {
          console.log(`Game ${gameId} finished, stopping polling`);
          this.stopPolling();
          this.emit('gameFinished', { gameId, finalScore: score });
        }
      } catch (error) {
        console.error('Error in game status polling:', error);
        this.emit('pollingError', { gameId, error });
      }
    }, pollInterval);
  }

  stopPolling(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('Game status polling stopped');
    }
  }

  async analyzeGameTrends(gameId: number, historicalScores: GameScore[]): Promise<string> {
    const prompt = `
Analyze these historical scores for NFL game ${gameId} and provide insights:

Historical Scores:
${historicalScores.map(s => `Q${s.quarter}: ${s.homeScore}-${s.awayScore} (${s.timeRemaining})`).join('\n')}

Current Status: ${historicalScores[historicalScores.length - 1]?.gameStatus || 'unknown'}

Provide analysis on:
1. Scoring patterns and momentum
2. Which team is performing better
3. Likely final score prediction
4. Key scoring digits (0-9) probabilities based on patterns

Focus on the last digits of scores for Football Squares context.
Keep response under 200 words.
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 250,
        temperature: 0.7,
      });

      return response.choices[0].message.content || 'No analysis available';
    } catch (error) {
      console.error('Error analyzing game trends:', error);
      return 'Analysis unavailable due to API error';
    }
  }

  async getOracleData(feedAddress: PublicKey): Promise<OracleData | null> {
    try {
      const accountInfo = await this.connection.getAccountInfo(feedAddress);
      
      if (!accountInfo) {
        return null;
      }

      // In real implementation, this would parse Switchboard oracle data
      // For now, we'll return mock data
      return {
        feedAddress,
        lastUpdate: new Date(),
        confidence: 0.95 + Math.random() * 0.05,
        value: Math.random() * 100,
      };
    } catch (error) {
      console.error('Error getting oracle data:', error);
      return null;
    }
  }

  async validateOracleData(oracleData: OracleData): Promise<boolean> {
    // Basic validation checks
    if (!oracleData.feedAddress || !oracleData.lastUpdate) {
      return false;
    }

    // Check if data is recent (within last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (oracleData.lastUpdate < fiveMinutesAgo) {
      return false;
    }

    // Check confidence level
    if (oracleData.confidence < 0.8) {
      return false;
    }

    return true;
  }

  async getMultipleGameScores(gameIds: number[]): Promise<Map<number, GameScore>> {
    const scores = new Map<number, GameScore>();
    
    const fetchPromises = gameIds.map(async (gameId) => {
      try {
        const score = await this.fetchScores(gameId);
        scores.set(gameId, score);
      } catch (error) {
        console.error(`Error fetching score for game ${gameId}:`, error);
      }
    });

    await Promise.all(fetchPromises);
    
    return scores;
  }

  async setupGameNotifications(gameId: number): Promise<void> {
    console.log(`Setting up notifications for game ${gameId}`);
    
    // Listen for significant score changes
    this.on('scoresUpdated', (data) => {
      if (data.gameId === gameId) {
        const score = data.score;
        
        // Notify on touchdowns (7-point increments)
        if (score.homeScore % 7 === 0 || score.awayScore % 7 === 0) {
          this.emit('significantScore', {
            gameId,
            score,
            type: 'touchdown'
          });
        }
        
        // Notify on field goals (3-point increments)
        if (score.homeScore % 3 === 0 || score.awayScore % 3 === 0) {
          this.emit('significantScore', {
            gameId,
            score,
            type: 'field_goal'
          });
        }
        
        // Notify on quarter changes
        if (score.quarter > 1) {
          this.emit('quarterChange', {
            gameId,
            score,
            quarter: score.quarter
          });
        }
      }
    });
  }

  async getOracleHealthStatus(): Promise<{
    feedActive: boolean;
    lastUpdate: Date | null;
    confidence: number;
    latency: number;
  }> {
    try {
      const startTime = Date.now();
      const oracleData = await this.getOracleData(this.scoreFeed);
      const latency = Date.now() - startTime;

      if (!oracleData) {
        return {
          feedActive: false,
          lastUpdate: null,
          confidence: 0,
          latency: latency,
        };
      }

      return {
        feedActive: true,
        lastUpdate: oracleData.lastUpdate,
        confidence: oracleData.confidence,
        latency: latency,
      };
    } catch (error) {
      console.error('Error getting oracle health status:', error);
      return {
        feedActive: false,
        lastUpdate: null,
        confidence: 0,
        latency: 0,
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
      
      // Check Oracle health
      const oracleHealth = await this.getOracleHealthStatus();
      
      return oracleHealth.feedActive && oracleHealth.confidence > 0.8;
    } catch (error) {
      console.error('OracleAgent health check failed:', error);
      return false;
    }
  }
}

export default OracleAgent;