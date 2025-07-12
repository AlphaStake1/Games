// scripts/run-agents.ts
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import { OrchestratorAgent } from '../agents/OrchestratorAgent';
import { BoardAgent } from '../agents/BoardAgent';
import { RandomizerAgent } from '../agents/RandomizerAgent';
import { OracleAgent } from '../agents/OracleAgent';
import { WinnerAgent } from '../agents/WinnerAgent';
import { EmailAgent } from '../agents/EmailAgent';
import { ClockworkThreadManager } from './create_thread';
import WebSocketGameServer from '../server/websocket';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const PROGRAM_ID = new PublicKey('Fg6PaFprPjfrgxLbfXyAyzsK1m1S82mC2f43s5D2qQq');

interface GameConfig {
  gameId: number;
  startTime: Date;
  endTime: Date;
  monitoringEnabled: boolean;
  emailNotifications: boolean;
}

class AgentRunner {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private orchestrator: OrchestratorAgent;
  private boardAgent: BoardAgent;
  private randomizerAgent: RandomizerAgent;
  private oracleAgent: OracleAgent;
  private winnerAgent: WinnerAgent;
  private emailAgent: EmailAgent;
  private clockworkManager: ClockworkThreadManager;
  private wsServer: WebSocketGameServer;
  private activeGames: Map<number, GameConfig> = new Map();
  private isRunning: boolean = false;

  constructor() {
    this.connection = new Connection(
      process.env.RPC_ENDPOINT || 'https://api.devnet.solana.com'
    );

    const walletKeypair = this.loadWallet();
    const wallet = new Wallet(walletKeypair);
    this.provider = new AnchorProvider(this.connection, wallet, {
      commitment: 'confirmed',
    });

    // Load program
    const idl = this.loadIdl();
    this.program = new Program(idl, PROGRAM_ID, this.provider);

    // Initialize agents
    this.orchestrator = new OrchestratorAgent(this.connection, this.provider, this.program);
    this.boardAgent = new BoardAgent(this.connection, this.provider, this.program);
    this.randomizerAgent = new RandomizerAgent(this.connection, this.provider, this.program);
    this.oracleAgent = new OracleAgent(this.connection, this.provider, this.program);
    this.winnerAgent = new WinnerAgent(this.connection, this.provider, this.program);
    this.emailAgent = new EmailAgent();
    this.clockworkManager = new ClockworkThreadManager();

    // Initialize WebSocket server
    const wsPort = parseInt(process.env.WS_PORT || '8080');
    this.wsServer = new WebSocketGameServer(wsPort, this.connection, this.provider, this.program);

    this.setupEventListeners();
    console.log('AgentRunner initialized');
  }

  private loadWallet(): Keypair {
    const walletPath = process.env.KEYPAIR_PATH || path.join(process.env.HOME!, '.config/solana/id.json');
    const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf8'));
    return Keypair.fromSecretKey(new Uint8Array(walletData));
  }

  private loadIdl(): any {
    const idlPath = path.join(__dirname, '../target/idl/squares.json');
    if (fs.existsSync(idlPath)) {
      return JSON.parse(fs.readFileSync(idlPath, 'utf8'));
    }
    // Return mock IDL if file doesn't exist
    return {
      version: '0.1.0',
      name: 'squares',
      instructions: [],
      accounts: [],
    };
  }

  private setupEventListeners(): void {
    // Orchestrator events
    this.orchestrator.on('taskError', (data) => {
      console.error('Task error:', data);
      this.handleTaskError(data);
    });

    // Board agent events
    this.boardAgent.on('boardCreated', (data) => {
      console.log('Board created:', data);
      this.wsServer.broadcastBoardUpdate(data.gameId, { type: 'board_created', ...data });
    });

    this.boardAgent.on('squarePurchased', (data) => {
      console.log('Square purchased:', data);
      this.wsServer.broadcastSquarePurchase(data.gameId, data);
    });

    // Randomizer agent events
    this.randomizerAgent.on('vrfFulfilled', (data) => {
      console.log('VRF fulfilled:', data);
      this.wsServer.broadcastBoardUpdate(data.gameId, { type: 'randomized', ...data });
    });

    // Oracle agent events
    this.oracleAgent.on('scoresUpdated', (data) => {
      console.log('Scores updated:', data);
      this.wsServer.broadcastScoreUpdate(data.gameId, data.score);
    });

    this.oracleAgent.on('gameFinished', (data) => {
      console.log('Game finished:', data);
      this.handleGameFinished(data.gameId, data.finalScore);
    });

    // Winner agent events
    this.winnerAgent.on('winnerSettled', (data) => {
      console.log('Winner settled:', data);
      this.wsServer.broadcastWinnerAnnouncement(data.gameId, data.winnerInfo);
      this.handleWinnerSettled(data.gameId, data.winnerInfo);
    });

    this.winnerAgent.on('payoutCompleted', (data) => {
      console.log('Payout completed:', data);
      this.wsServer.broadcastBoardUpdate(data.gameId, { type: 'payout_completed', ...data });
    });

    // Email agent events
    this.emailAgent.on('emailSent', (data) => {
      console.log('Email sent:', data);
    });

    this.emailAgent.on('emailError', (data) => {
      console.error('Email error:', data);
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('Agent runner is already running');
      return;
    }

    console.log('Starting agent runner...');
    this.isRunning = true;

    try {
      // Health check all agents
      await this.performHealthChecks();

      // Start main processing loop
      this.startProcessingLoop();

      console.log('Agent runner started successfully');
    } catch (error) {
      console.error('Error starting agent runner:', error);
      this.isRunning = false;
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      console.log('Agent runner is not running');
      return;
    }

    console.log('Stopping agent runner...');
    this.isRunning = false;

    // Stop WebSocket server
    this.wsServer.close();

    // Stop all oracle polling
    this.oracleAgent.stopPolling();

    console.log('Agent runner stopped');
  }

  async createGame(gameConfig: GameConfig): Promise<void> {
    console.log(`Creating game ${gameConfig.gameId}...`);

    try {
      // Create the board
      const { boardPda } = await this.boardAgent.createBoard(gameConfig.gameId);
      console.log(`Board created for game ${gameConfig.gameId}: ${boardPda.toString()}`);

      // Add to orchestrator
      await this.orchestrator.addGame(gameConfig.gameId);

      // Create Clockwork threads
      if (gameConfig.monitoringEnabled) {
        await this.clockworkManager.createGameMonitoringThread(gameConfig.gameId);
        await this.clockworkManager.createRandomizationThread(gameConfig.gameId, gameConfig.startTime);
        await this.clockworkManager.createWinnerSettlementThread(gameConfig.gameId, gameConfig.endTime);
      }

      // Start Oracle polling
      this.oracleAgent.pollGameStatus(gameConfig.gameId);

      // Store game config
      this.activeGames.set(gameConfig.gameId, gameConfig);

      console.log(`Game ${gameConfig.gameId} created successfully`);
    } catch (error) {
      console.error(`Error creating game ${gameConfig.gameId}:`, error);
      throw error;
    }
  }

  async endGame(gameId: number): Promise<void> {
    console.log(`Ending game ${gameId}...`);

    try {
      // Remove from orchestrator
      await this.orchestrator.removeGame(gameId);

      // Stop Oracle polling
      this.oracleAgent.stopPolling();

      // Clean up threads
      const threads = await this.clockworkManager.listThreads();
      for (const thread of threads) {
        if (thread.id.includes(gameId.toString())) {
          await this.clockworkManager.deleteThread(thread.id);
        }
      }

      // Remove from active games
      this.activeGames.delete(gameId);

      console.log(`Game ${gameId} ended successfully`);
    } catch (error) {
      console.error(`Error ending game ${gameId}:`, error);
      throw error;
    }
  }

  private async performHealthChecks(): Promise<void> {
    console.log('Performing health checks...');

    const healthChecks = [
      { name: 'Orchestrator', check: () => this.orchestrator.healthCheck() },
      { name: 'BoardAgent', check: () => this.boardAgent.healthCheck() },
      { name: 'RandomizerAgent', check: () => this.randomizerAgent.healthCheck() },
      { name: 'OracleAgent', check: () => this.oracleAgent.healthCheck() },
      { name: 'WinnerAgent', check: () => this.winnerAgent.healthCheck() },
      { name: 'EmailAgent', check: () => this.emailAgent.healthCheck() },
    ];

    for (const { name, check } of healthChecks) {
      try {
        const isHealthy = await check();
        console.log(`${name}: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
        if (!isHealthy) {
          console.warn(`${name} health check failed`);
        }
      } catch (error) {
        console.error(`${name} health check error:`, error);
      }
    }
  }

  private startProcessingLoop(): void {
    const processInterval = setInterval(async () => {
      if (!this.isRunning) {
        clearInterval(processInterval);
        return;
      }

      try {
        // Process each active game
        for (const [gameId] of this.activeGames) {
          const taskPlan = await this.orchestrator.planTasks(gameId);
          if (taskPlan.tasks.length > 0) {
            await this.orchestrator.executeTaskPlan(taskPlan);
          }
        }
      } catch (error) {
        console.error('Error in processing loop:', error);
      }
    }, 30000); // Run every 30 seconds
  }

  private async handleTaskError(data: any): Promise<void> {
    console.error('Handling task error:', data);
    
    // Implement retry logic or error notification
    if (data.task.agent === 'EmailAgent' && data.task.action === 'send_winner_notification') {
      // Retry email sending
      setTimeout(async () => {
        try {
          await this.orchestrator.executeTaskPlan({ tasks: [data.task], reasoning: 'Retry after error' });
        } catch (error) {
          console.error('Retry failed:', error);
        }
      }, 60000); // Retry after 1 minute
    }
  }

  private async handleGameFinished(gameId: number, finalScore: any): Promise<void> {
    console.log(`Game ${gameId} finished with score:`, finalScore);
    
    // Trigger winner settlement
    try {
      const boardPda = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), Buffer.from(gameId.toString())],
        PROGRAM_ID
      )[0];

      await this.winnerAgent.settleWinner(boardPda);
    } catch (error) {
      console.error('Error settling winner:', error);
    }
  }

  private async handleWinnerSettled(gameId: number, winnerInfo: any): Promise<void> {
    const gameConfig = this.activeGames.get(gameId);
    
    if (gameConfig?.emailNotifications) {
      try {
        await this.emailAgent.sendWinnerNotification({
          recipient: 'winner@example.com', // In real implementation, get from user data
          gameId,
          amount: winnerInfo.payoutAmount,
          transactionId: 'placeholder-tx-id',
          finalScore: { home: winnerInfo.homeScore, away: winnerInfo.awayScore },
          squareIndex: winnerInfo.squareIndex,
        });
      } catch (error) {
        console.error('Error sending winner notification:', error);
      }
    }
  }

  getStats(): any {
    return {
      activeGames: this.activeGames.size,
      wsStats: this.wsServer.getStats(),
      isRunning: this.isRunning,
    };
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const runner = new AgentRunner();

  switch (command) {
    case 'start':
      await runner.start();
      break;

    case 'stop':
      await runner.stop();
      break;

    case 'create-game':
      if (args.length < 4) {
        console.error('Usage: npm run dev:agents create-game <gameId> <startTime> <endTime>');
        process.exit(1);
      }
      const gameId = parseInt(args[1]);
      const startTime = new Date(args[2]);
      const endTime = new Date(args[3]);
      
      await runner.createGame({
        gameId,
        startTime,
        endTime,
        monitoringEnabled: true,
        emailNotifications: true,
      });
      break;

    case 'end-game':
      if (args.length < 2) {
        console.error('Usage: npm run dev:agents end-game <gameId>');
        process.exit(1);
      }
      await runner.endGame(parseInt(args[1]));
      break;

    case 'stats':
      const stats = runner.getStats();
      console.log('Agent runner stats:', JSON.stringify(stats, null, 2));
      break;

    default:
      console.log('Available commands:');
      console.log('  start');
      console.log('  stop');
      console.log('  create-game <gameId> <startTime> <endTime>');
      console.log('  end-game <gameId>');
      console.log('  stats');
      
      // Start by default
      await runner.start();
      
      // Keep running until Ctrl+C
      process.on('SIGINT', async () => {
        console.log('\nShutting down...');
        await runner.stop();
        process.exit(0);
      });
      
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { AgentRunner };