// agents/OrchestratorAgent/index.ts
import { Anthropic } from '@anthropic-ai/sdk';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3, BN } from '@coral-xyz/anchor';
import { BoardAgent } from '../BoardAgent';
import { RandomizerAgent } from '../RandomizerAgent';
import { OracleAgent } from '../OracleAgent';
import { WinnerAgent } from '../WinnerAgent';
import { EmailAgent } from '../EmailAgent';
import { DocumentationAgent } from '../DocumentationAgent';
import { CodeReviewAgent } from '../CodeReviewAgent';
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

interface SubagentTask {
  id: string;
  type: 'game_operation' | 'development' | 'documentation' | 'review';
  agent: string;
  action: string;
  args: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: number;
  dependencies: string[];
  createdAt: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

interface SubagentRegistry {
  gameAgents: Map<string, any>;
  developmentAgents: Map<string, any>;
}

export class OrchestratorAgent extends EventEmitter {
  private anthropic: Anthropic;
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private activeGames: Map<number, GameContext> = new Map();
  private taskQueue: Array<any> = [];
  private isProcessing: boolean = false;

  // Subagent system
  private subagentRegistry: SubagentRegistry;
  private subagentTasks: Map<string, SubagentTask> = new Map();
  private developmentQueue: SubagentTask[] = [];
  private isProcessingDevelopment: boolean = false;

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
    this.initializeSubagentRegistry();
    this.startProcessingLoop();
    this.startDevelopmentProcessingLoop();
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

      // TODO: Replace with actual program account fetch when smart contract is deployed
      const boardAccount = await this.connection.getAccountInfo(boardPda);

      // TODO: Implement proper game state determination when smart contract is deployed
      const gameState = 'created'; // Mock state

      return {
        gameId,
        boardPda,
        gameState,
        currentScore: {
          home: 0, // Mock score
          away: 0, // Mock score
          quarter: 1, // Mock quarter
        },
        totalPot: 0, // Mock total pot
        playersCount: 0, // Mock players count
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
        for (const [gameId, context] of Array.from(
          this.activeGames.entries(),
        )) {
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

  // ============================================================================
  // SUBAGENT SYSTEM METHODS
  // ============================================================================

  /**
   * Initialize the subagent registry with available agents
   */
  private initializeSubagentRegistry(): void {
    this.subagentRegistry = {
      gameAgents: new Map([
        ['BoardAgent', BoardAgent],
        ['RandomizerAgent', RandomizerAgent],
        ['OracleAgent', OracleAgent],
        ['WinnerAgent', WinnerAgent],
        ['EmailAgent', EmailAgent],
      ]),
      developmentAgents: new Map([
        ['DocumentationAgent', DocumentationAgent],
        ['CodeReviewAgent', CodeReviewAgent],
      ]),
    };

    console.log(
      'Subagent registry initialized with',
      this.subagentRegistry.gameAgents.size +
        this.subagentRegistry.developmentAgents.size,
      'agents',
    );
  }

  /**
   * Delegate a task to a specialized subagent
   */
  async delegateToSubagent(
    task: Omit<SubagentTask, 'id' | 'createdAt' | 'status'>,
  ): Promise<string> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const subagentTask: SubagentTask = {
      ...task,
      id: taskId,
      status: 'pending',
      createdAt: new Date(),
    };

    this.subagentTasks.set(taskId, subagentTask);

    if (
      task.type === 'development' ||
      task.type === 'documentation' ||
      task.type === 'review'
    ) {
      this.developmentQueue.push(subagentTask);
    } else {
      this.taskQueue.push(subagentTask);
    }

    this.emit('taskDelegated', { taskId, task: subagentTask });

    console.log(
      `Task delegated to ${task.agent}: ${task.action} (ID: ${taskId})`,
    );
    return taskId;
  }

  /**
   * Generate documentation for a file or component
   */
  async generateDocumentation(
    filePath: string,
    type: 'anchor_program' | 'agent_workflow' | 'api_endpoint' | 'user_guide',
    context?: any,
  ): Promise<string> {
    return this.delegateToSubagent({
      type: 'documentation',
      agent: 'DocumentationAgent',
      action:
        type === 'anchor_program'
          ? 'generateAnchorProgramDocs'
          : type === 'agent_workflow'
            ? 'generateAgentWorkflowDocs'
            : type === 'api_endpoint'
              ? 'generateAPIEndpointDocs'
              : 'generateUserGuide',
      args: { filePath, context },
      priority: 6,
      dependencies: [],
    });
  }

  /**
   * Review code with the CodeReviewAgent
   */
  async reviewCode(
    filePath: string,
    changeType: 'new_file' | 'modification' | 'refactor',
    context?: any,
  ): Promise<string> {
    return this.delegateToSubagent({
      type: 'review',
      agent: 'CodeReviewAgent',
      action: filePath.endsWith('.rs')
        ? 'reviewRustCode'
        : filePath.includes('agents/')
          ? 'reviewAgentIntegration'
          : 'reviewTypeScriptCode',
      args: {
        filePath,
        changeType,
        context,
      },
      priority: 8,
      dependencies: [],
    });
  }

  /**
   * Coordinate multiple subagents for complex tasks
   */
  async coordinateMultiAgentTask(
    tasks: Array<Omit<SubagentTask, 'id' | 'createdAt' | 'status'>>,
  ): Promise<string[]> {
    const taskIds: string[] = [];

    // Sort tasks by priority and dependencies
    const sortedTasks = this.topologicalSort(tasks);

    for (const task of sortedTasks) {
      const taskId = await this.delegateToSubagent(task);
      taskIds.push(taskId);
    }

    this.emit('multiAgentTaskCoordinated', {
      taskIds,
      taskCount: tasks.length,
    });

    console.log(`Coordinated ${tasks.length} tasks across multiple agents`);
    return taskIds;
  }

  /**
   * Development processing loop for documentation and code review tasks
   */
  private async startDevelopmentProcessingLoop(): Promise<void> {
    setInterval(async () => {
      if (this.isProcessingDevelopment || this.developmentQueue.length === 0) {
        return;
      }

      this.isProcessingDevelopment = true;

      try {
        const task = this.developmentQueue.shift();
        if (task) {
          await this.executeDevelopmentTask(task);
        }
      } catch (error) {
        console.error('Error in development processing loop:', error);
      } finally {
        this.isProcessingDevelopment = false;
      }
    }, 5000); // Process every 5 seconds
  }

  /**
   * Execute development-related tasks (documentation, code review)
   */
  private async executeDevelopmentTask(task: SubagentTask): Promise<void> {
    try {
      task.status = 'in_progress';
      this.subagentTasks.set(task.id, task);

      console.log(`Executing development task: ${task.agent}.${task.action}`);

      let result: any;

      switch (task.agent) {
        case 'DocumentationAgent':
          result = await this.executeDocumentationTask(task);
          break;
        case 'CodeReviewAgent':
          result = await this.executeCodeReviewTask(task);
          break;
        default:
          throw new Error(`Unknown development agent: ${task.agent}`);
      }

      task.status = 'completed';
      task.completedAt = new Date();
      task.result = result;

      this.subagentTasks.set(task.id, task);
      this.emit('developmentTaskCompleted', { task, result });

      console.log(`Development task completed: ${task.id}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : String(error);
      task.completedAt = new Date();

      this.subagentTasks.set(task.id, task);
      this.emit('developmentTaskFailed', { task, error });

      console.error(`Development task failed: ${task.id}`, error);
    }
  }

  /**
   * Execute documentation generation tasks
   */
  private async executeDocumentationTask(task: SubagentTask): Promise<any> {
    const agent = new DocumentationAgent();

    switch (task.action) {
      case 'generateAnchorProgramDocs':
        return await agent.generateAnchorProgramDocs(task.args.filePath);
      case 'generateAgentWorkflowDocs':
        return await agent.generateAgentWorkflowDocs(task.args.filePath);
      case 'generateAPIEndpointDocs':
        return await agent.generateAPIEndpointDocs(task.args.filePath);
      case 'generateUserGuide':
        return await agent.generateUserGuide(task.args.context);
      default:
        throw new Error(`Unknown documentation action: ${task.action}`);
    }
  }

  /**
   * Execute code review tasks
   */
  private async executeCodeReviewTask(task: SubagentTask): Promise<any> {
    const agent = new CodeReviewAgent();
    const fileContent = await require('fs/promises').readFile(
      task.args.filePath,
      'utf-8',
    );

    const request = {
      filePath: task.args.filePath,
      fileContent,
      changeType: task.args.changeType,
      context: task.args.context,
    };

    switch (task.action) {
      case 'reviewRustCode':
        return await agent.reviewRustCode(request);
      case 'reviewTypeScriptCode':
        return await agent.reviewTypeScriptCode(request);
      case 'reviewAgentIntegration':
        return await agent.reviewAgentIntegration(request);
      default:
        throw new Error(`Unknown code review action: ${task.action}`);
    }
  }

  /**
   * Get task status and results
   */
  getTaskStatus(taskId: string): SubagentTask | undefined {
    return this.subagentTasks.get(taskId);
  }

  /**
   * Get all tasks for a specific agent
   */
  getTasksByAgent(agentName: string): SubagentTask[] {
    return Array.from(this.subagentTasks.values()).filter(
      (task) => task.agent === agentName,
    );
  }

  /**
   * Get development queue status
   */
  getDevelopmentQueueStatus(): {
    pending: number;
    inProgress: number;
    completed: number;
    failed: number;
  } {
    const allTasks = Array.from(this.subagentTasks.values());
    const devTasks = allTasks.filter(
      (task) =>
        task.type === 'development' ||
        task.type === 'documentation' ||
        task.type === 'review',
    );

    return {
      pending: devTasks.filter((t) => t.status === 'pending').length,
      inProgress: devTasks.filter((t) => t.status === 'in_progress').length,
      completed: devTasks.filter((t) => t.status === 'completed').length,
      failed: devTasks.filter((t) => t.status === 'failed').length,
    };
  }

  /**
   * Simple topological sort for task dependencies
   */
  private topologicalSort(
    tasks: Array<Omit<SubagentTask, 'id' | 'createdAt' | 'status'>>,
  ): typeof tasks {
    // Simple implementation - sort by priority for now
    // In production, implement proper topological sorting based on dependencies
    return tasks.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Health check including subagent system
   */
  async healthCheckSubagents(): Promise<{
    orchestrator: boolean;
    gameAgents: Record<string, boolean>;
    developmentAgents: Record<string, boolean>;
    taskQueueStatus: any;
  }> {
    const gameAgentHealth: Record<string, boolean> = {};
    const developmentAgentHealth: Record<string, boolean> = {};

    // Test DocumentationAgent
    try {
      const docAgent = new DocumentationAgent();
      developmentAgentHealth.DocumentationAgent = await docAgent.healthCheck();
    } catch (error) {
      developmentAgentHealth.DocumentationAgent = false;
    }

    // Test CodeReviewAgent
    try {
      const reviewAgent = new CodeReviewAgent();
      developmentAgentHealth.CodeReviewAgent = await reviewAgent.healthCheck();
    } catch (error) {
      developmentAgentHealth.CodeReviewAgent = false;
    }

    return {
      orchestrator: true,
      gameAgents: gameAgentHealth,
      developmentAgents: developmentAgentHealth,
      taskQueueStatus: this.getDevelopmentQueueStatus(),
    };
  }
}

export default OrchestratorAgent;
