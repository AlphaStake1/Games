// agents/OrchestratorAgent/index.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { BoardAgent } from '../BoardAgent';
import { RandomizerAgent } from '../RandomizerAgent';
import { OracleAgent } from '../OracleAgent';
import { WinnerAgent } from '../WinnerAgent';
import { EmailAgent } from '../EmailAgent';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface GameContext {
  gameId: number;
  boardPda: PublicKey;
  gameState: 'created' | 'randomized' | 'started' | 'ended' | 'settled';
  currentScore: { home: number; away: number; quarter: number };
  totalPot: number;
  playersCount: number;
}

interface TaskPlan {
  tasks: Array<{
    agent: string;
    action: string;
    args: any;
    priority: number;
    dependencies: string[];
  }>;
  reasoning: string;
}

export class OrchestratorAgent extends EventEmitter {
  private anthropic: Anthropic;
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private activeGames: Map<number, GameContext> = new Map();
  private taskQueue: Array<any> = [];
  private isProcessing: boolean = false;

  constructor(
    connection: Connection,
    provider: AnchorProvider,
    program: Program,
  ) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;

    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    console.log('OrchestratorAgent initialized with Claude Sonnet 4');
    this.startProcessingLoop();
  }

  async planTasks(gameId: number): Promise<TaskPlan> {
    const context = await this.fetchGameContext(gameId);

    const prompt = `
You are the OrchestratorAgent for a Football Squares dApp. Analyze the current game context and create a task plan.

Game Context:
- Game ID: ${context.gameId}
- Current State: ${context.gameState}
- Current Score: ${context.currentScore.home}-${context.currentScore.away} Q${context.currentScore.quarter}
- Total Pot: ${context.totalPot} lamports
- Players: ${context.playersCount}

Available Agents:
- BoardAgent: create_board, get_board_state, purchase_square
- RandomizerAgent: request_randomization, check_vrf_status
- OracleAgent: fetch_scores, poll_game_status
- WinnerAgent: settle_winner, calculate_payout
- EmailAgent: send_winner_notification, send_game_updates

Based on the current state, determine what tasks need to be executed next. Consider:
1. Game flow progression
2. Time-sensitive operations
3. Dependencies between tasks
4. Error handling and retries

Respond with a JSON object containing:
{
  "tasks": [
    {
      "agent": "AgentName",
      "action": "action_name",
      "args": {},
      "priority": 1-10,
      "dependencies": []
    }
  ],
  "reasoning": "Explanation of the task plan"
}
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = response.content[0];
      if (content.type === 'text') {
        const taskPlan = JSON.parse(content.text) as TaskPlan;
        console.log('Task plan generated:', taskPlan);
        return taskPlan;
      } else {
        throw new Error('Invalid response format from Claude');
      }
    } catch (error) {
      console.error('Error planning tasks:', error);
      // Fallback to basic task planning
      return this.generateFallbackPlan(context);
    }
  }

  private generateFallbackPlan(context: GameContext): TaskPlan {
    const tasks = [];

    switch (context.gameState) {
      case 'created':
        tasks.push({
          agent: 'RandomizerAgent',
          action: 'request_randomization',
          args: { boardPda: context.boardPda.toString() },
          priority: 10,
          dependencies: [],
        });
        break;
      case 'randomized':
        tasks.push({
          agent: 'OracleAgent',
          action: 'poll_game_status',
          args: { gameId: context.gameId },
          priority: 8,
          dependencies: [],
        });
        break;
      case 'started':
        tasks.push({
          agent: 'OracleAgent',
          action: 'fetch_scores',
          args: { gameId: context.gameId },
          priority: 9,
          dependencies: [],
        });
        break;
      case 'ended':
        tasks.push({
          agent: 'WinnerAgent',
          action: 'settle_winner',
          args: { boardPda: context.boardPda.toString() },
          priority: 10,
          dependencies: [],
        });
        break;
    }

    return {
      tasks,
      reasoning: 'Fallback task plan based on game state',
    };
  }

  async executeTaskPlan(taskPlan: TaskPlan): Promise<void> {
    // Sort tasks by priority
    const sortedTasks = taskPlan.tasks.sort((a, b) => b.priority - a.priority);

    for (const task of sortedTasks) {
      try {
        await this.executeTask(task);
      } catch (error) {
        console.error(
          `Error executing task ${task.agent}:${task.action}:`,
          error,
        );
        this.emit('taskError', { task, error });
      }
    }
  }

  private async executeTask(task: any): Promise<void> {
    console.log(`Executing task: ${task.agent}:${task.action}`);

    switch (task.agent) {
      case 'BoardAgent':
        await this.executeBoardTask(task);
        break;
      case 'RandomizerAgent':
        await this.executeRandomizerTask(task);
        break;
      case 'OracleAgent':
        await this.executeOracleTask(task);
        break;
      case 'WinnerAgent':
        await this.executeWinnerTask(task);
        break;
      case 'EmailAgent':
        await this.executeEmailTask(task);
        break;
      default:
        console.warn(`Unknown agent: ${task.agent}`);
    }
  }

  private async executeBoardTask(task: any): Promise<void> {
    const boardAgent = new BoardAgent(
      this.connection,
      this.provider,
      this.program,
    );

    switch (task.action) {
      case 'create_board':
        await boardAgent.createBoard(task.args.gameId);
        break;
      case 'get_board_state':
        await boardAgent.getBoardState(task.args.boardPda);
        break;
      default:
        console.warn(`Unknown board action: ${task.action}`);
    }
  }

  private async executeRandomizerTask(task: any): Promise<void> {
    const randomizerAgent = new RandomizerAgent(
      this.connection,
      this.provider,
      this.program,
    );

    switch (task.action) {
      case 'request_randomization':
        await randomizerAgent.requestRandomization(task.args.boardPda);
        break;
      case 'check_vrf_status':
        await randomizerAgent.checkVrfStatus(task.args.vrfAccount);
        break;
      default:
        console.warn(`Unknown randomizer action: ${task.action}`);
    }
  }

  private async executeOracleTask(task: any): Promise<void> {
    const oracleAgent = new OracleAgent(
      this.connection,
      this.provider,
      this.program,
    );

    switch (task.action) {
      case 'fetch_scores':
        await oracleAgent.fetchScores(task.args.gameId);
        break;
      case 'poll_game_status':
        await oracleAgent.pollGameStatus(task.args.gameId);
        break;
      default:
        console.warn(`Unknown oracle action: ${task.action}`);
    }
  }

  private async executeWinnerTask(task: any): Promise<void> {
    const winnerAgent = new WinnerAgent(
      this.connection,
      this.provider,
      this.program,
    );

    switch (task.action) {
      case 'settle_winner':
        await winnerAgent.settleWinner(task.args.boardPda);
        break;
      case 'calculate_payout':
        await winnerAgent.calculatePayout(task.args.boardPda);
        break;
      default:
        console.warn(`Unknown winner action: ${task.action}`);
    }
  }

  private async executeEmailTask(task: any): Promise<void> {
    const emailAgent = new EmailAgent();

    switch (task.action) {
      case 'send_winner_notification':
        await emailAgent.sendWinnerNotification({
          recipient: task.args.recipient,
          gameId: task.args.gameId,
          amount: task.args.amount,
          transactionId: task.args.transactionId || '',
          finalScore: task.args.finalScore || { home: 0, away: 0 },
          squareIndex: task.args.squareIndex || 0,
        });
        break;
      case 'send_game_updates':
        await emailAgent.sendGameUpdates({
          recipients: task.args.recipients,
          gameId: task.args.gameId,
          currentScore: task.args.score || { home: 0, away: 0, quarter: 1 },
          timeRemaining: task.args.timeRemaining || '15:00',
        });
        break;
      default:
        console.warn(`Unknown email action: ${task.action}`);
    }
  }

  private async fetchGameContext(gameId: number): Promise<GameContext> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.program.programId,
      );

      const boardAccount = await this.program.account.board.fetch(boardPda);

      const gameState = this.determineGameState(boardAccount);

      return {
        gameId,
        boardPda,
        gameState,
        currentScore: {
          home: boardAccount.homeScore,
          away: boardAccount.awayScore,
          quarter: boardAccount.quarter,
        },
        totalPot: boardAccount.totalPot.toNumber(),
        playersCount: boardAccount.squares.filter(
          (s) => !s.equals(PublicKey.default),
        ).length,
      };
    } catch (error) {
      console.error('Error fetching game context:', error);
      throw error;
    }
  }

  private determineGameState(
    boardAccount: any,
  ): 'created' | 'randomized' | 'started' | 'ended' | 'settled' {
    if (!boardAccount.winner.equals(PublicKey.default)) {
      return 'settled';
    }
    if (boardAccount.gameEnded) {
      return 'ended';
    }
    if (boardAccount.gameStarted) {
      return 'started';
    }
    if (boardAccount.randomized) {
      return 'randomized';
    }
    return 'created';
  }

  async addGame(gameId: number): Promise<void> {
    const context = await this.fetchGameContext(gameId);
    this.activeGames.set(gameId, context);
    console.log(`Added game ${gameId} to active games`);
  }

  async removeGame(gameId: number): Promise<void> {
    this.activeGames.delete(gameId);
    console.log(`Removed game ${gameId} from active games`);
  }

  private startProcessingLoop(): void {
    setInterval(async () => {
      if (this.isProcessing) return;

      this.isProcessing = true;
      try {
        for (const [gameId, context] of this.activeGames) {
          const taskPlan = await this.planTasks(gameId);
          if (taskPlan.tasks.length > 0) {
            await this.executeTaskPlan(taskPlan);
          }
        }
      } catch (error) {
        console.error('Error in processing loop:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 30000); // Run every 30 seconds
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Check connection to Solana
      await this.connection.getLatestBlockhash();

      // Check Anthropic API
      await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'health check' }],
      });

      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default OrchestratorAgent;
