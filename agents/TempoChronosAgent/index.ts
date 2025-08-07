// agents/TempoChronosAgent/index.ts
import { EventEmitter } from 'events';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {
  BOARD_RELEASE_CONFIG,
  getCurrentPhase,
  shouldReleaseGame,
  getNextReleaseBatch,
} from '../../config/boardReleaseStrategy';
import { BoardAgent } from '../BoardAgent';

export interface BoardStatus {
  gameId: number;
  boardPda: PublicKey;
  fillRate: number;
  squaresFilled: number;
  totalSquares: number;
  totalPot: number;
  isVIP: boolean;
  gameType: 'MNF' | 'SNF' | 'TNF' | 'Sunday' | 'Special';
  week: number;
  status: 'pending' | 'active' | 'countdown' | 'funding_unlocked' | 'complete';
}

export interface ReleaseDecision {
  shouldRelease: boolean;
  reason: string;
  nextGames: string[];
  countdownActive: boolean;
  fundingUnlocked: boolean;
  urgencyMessage?: string;
}

export interface PlayerMetrics {
  activePlayerCount: number;
  weeklyActiveUsers: number;
  averageFillTime: number; // in minutes
  treasuryBalance: number;
}

export class TempoChronosAgent extends EventEmitter {
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private boardAgent: BoardAgent;
  private activeBoards: Map<number, BoardStatus> = new Map();
  private playerMetrics: PlayerMetrics;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring: boolean = false;

  constructor(
    connection: Connection,
    provider: AnchorProvider,
    program: Program,
  ) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;
    this.boardAgent = new BoardAgent(connection, provider, program);

    this.playerMetrics = {
      activePlayerCount: 0,
      weeklyActiveUsers: 0,
      averageFillTime: 0,
      treasuryBalance: 0,
    };

    console.log(
      '⏰ Tempo Chronos Agent initialized - Board Release Specialist',
    );
  }

  /**
   * Start monitoring board fill rates
   */
  async startMonitoring(intervalMs: number = 60000): Promise<void> {
    if (this.isMonitoring) {
      console.log('Already monitoring board fill rates');
      return;
    }

    this.isMonitoring = true;
    console.log(`Starting board monitoring with ${intervalMs}ms interval`);

    this.checkInterval = setInterval(async () => {
      await this.checkAllBoards();
    }, intervalMs);

    // Initial check
    await this.checkAllBoards();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      this.isMonitoring = false;
      console.log('Stopped board monitoring');
    }
  }

  /**
   * Check all active boards and make release decisions
   */
  private async checkAllBoards(): Promise<void> {
    try {
      for (const [gameId, board] of this.activeBoards) {
        const decision = await this.evaluateBoardForRelease(gameId);

        // Update board status based on fill rate
        if (board.fillRate >= 90 && board.fillRate < 95) {
          board.status = 'countdown';
          this.emitCountdownMessage(board);
        } else if (board.fillRate >= 95 && board.fillRate < 100) {
          board.status = 'funding_unlocked';
          this.emitFundingUnlockedMessage(board);
        } else if (board.fillRate >= 100) {
          board.status = 'complete';
          await this.handleBoardCompletion(board);
        }

        // Emit status update
        this.emit('boardStatusUpdate', { gameId, board, decision });
      }
    } catch (error) {
      console.error('Error checking boards:', error);
      this.emit('monitoringError', error);
    }
  }

  /**
   * Evaluate a specific board for release decision
   */
  async evaluateBoardForRelease(gameId: number): Promise<ReleaseDecision> {
    const board = this.activeBoards.get(gameId);
    if (!board) {
      return {
        shouldRelease: false,
        reason: 'Board not found',
        nextGames: [],
        countdownActive: false,
        fundingUnlocked: false,
      };
    }

    const phase = getCurrentPhase(this.playerMetrics.activePlayerCount);
    const shouldRelease = shouldReleaseGame(
      board.gameType,
      board.fillRate,
      phase,
      board.isVIP,
    );

    const decision: ReleaseDecision = {
      shouldRelease,
      reason: this.getReleaseReason(board, phase),
      nextGames: [],
      countdownActive: board.fillRate >= 90,
      fundingUnlocked: board.fillRate >= 95,
      urgencyMessage: this.generateUrgencyMessage(board),
    };

    // Determine next games to release
    if (board.fillRate >= 95) {
      const completedGames = Array.from(this.activeBoards.values())
        .filter((b) => b.status === 'complete')
        .map((b) => b.gameType);

      decision.nextGames = getNextReleaseBatch(
        completedGames,
        this.getTimeSlot(board.gameType),
        board.week,
      );
    }

    return decision;
  }

  /**
   * Get release reason based on board and phase
   */
  private getReleaseReason(board: BoardStatus, phase: any): string {
    if (board.fillRate < 90) {
      return `Waiting for 90% fill (current: ${board.fillRate}%)`;
    } else if (board.fillRate < 95) {
      return `Countdown active - ${95 - board.fillRate}% until funding unlock`;
    } else if (board.fillRate < 100) {
      return `Funding unlocked - ${100 - board.fillRate}% until automatic release`;
    } else {
      return `Board complete - ready for next release (Phase: ${phase.description})`;
    }
  }

  /**
   * Generate urgency message based on fill rate
   */
  private generateUrgencyMessage(board: BoardStatus): string {
    const squaresLeft = board.totalSquares - board.squaresFilled;

    if (board.fillRate >= 96 && board.fillRate < 100) {
      return `🔥 FINAL ${squaresLeft} SQUARES! Be the hero who unlocks the next game!`;
    } else if (board.fillRate >= 90 && board.fillRate < 95) {
      return `⏰ ${squaresLeft} squares until next game unlocks!`;
    } else if (board.fillRate >= 95 && board.fillRate < 96) {
      return `🔓 Funding unlocked! Only ${squaresLeft} squares left!`;
    } else if (board.fillRate >= 85 && board.fillRate < 90) {
      return `📈 Board filling fast - ${squaresLeft} squares available`;
    }

    return '';
  }

  /**
   * Handle board completion and trigger next releases
   */
  private async handleBoardCompletion(board: BoardStatus): Promise<void> {
    console.log(
      `✅ Board ${board.gameId} complete! Triggering next releases...`,
    );

    const phase = getCurrentPhase(this.playerMetrics.activePlayerCount);
    const completedGames = Array.from(this.activeBoards.values())
      .filter((b) => b.status === 'complete')
      .map((b) => b.gameType);

    const nextGames = getNextReleaseBatch(
      completedGames,
      this.getNextTimeSlot(board.gameType),
      board.week,
    );

    for (const game of nextGames) {
      await this.requestBoardCreation(game, board.week);
    }

    this.emit('boardCompleted', {
      board,
      nextGames,
      phase: phase.description,
    });
  }

  /**
   * Request creation of a new board
   */
  private async requestBoardCreation(
    game: string,
    week: number,
  ): Promise<void> {
    this.emit('requestBoardCreation', {
      game,
      week,
      timestamp: new Date(),
      reason: 'Automatic release after previous board completion',
    });

    console.log(`📋 Requested creation of ${game} board for week ${week}`);
  }

  /**
   * Emit countdown message
   */
  private emitCountdownMessage(board: BoardStatus): void {
    const squaresNeeded =
      Math.ceil(board.totalSquares * 0.05) -
      (board.squaresFilled - Math.floor(board.totalSquares * 0.9));

    this.emit('countdownActive', {
      gameId: board.gameId,
      fillRate: board.fillRate,
      squaresNeeded,
      message: `⏰ COUNTDOWN: ${squaresNeeded} squares until ${this.getNextGameName(board)} unlocks!`,
    });
  }

  /**
   * Emit funding unlocked message
   */
  private emitFundingUnlockedMessage(board: BoardStatus): void {
    const squaresLeft = board.totalSquares - board.squaresFilled;

    this.emit('fundingUnlocked', {
      gameId: board.gameId,
      fillRate: board.fillRate,
      squaresLeft,
      message: `🔓 FUNDING UNLOCKED! ${squaresLeft} squares remaining - ${this.getNextGameName(board)} ready to launch!`,
    });
  }

  /**
   * Get next game name based on current game type
   */
  private getNextGameName(board: BoardStatus): string {
    const progression = {
      MNF: 'SNF',
      SNF: 'TNF',
      TNF: 'Sunday Games',
      Sunday: 'Next Sunday Wave',
      Special: 'Next Special Event',
    };

    return progression[board.gameType] || 'Next Game';
  }

  /**
   * Get time slot based on game type
   */
  private getTimeSlot(
    gameType: string,
  ): 'primetime' | 'lateAfternoon' | 'early' {
    if (['MNF', 'SNF', 'TNF'].includes(gameType)) {
      return 'primetime';
    }
    // Default to late afternoon for Sunday games
    return 'lateAfternoon';
  }

  /**
   * Get next time slot in progression
   */
  private getNextTimeSlot(
    currentType: string,
  ): 'primetime' | 'lateAfternoon' | 'early' {
    if (currentType === 'MNF' || currentType === 'SNF') {
      return 'primetime';
    } else if (currentType === 'TNF') {
      return 'lateAfternoon';
    }
    return 'early';
  }

  /**
   * Add a board to monitoring
   */
  async addBoard(boardData: Partial<BoardStatus>): Promise<void> {
    if (!boardData.gameId) {
      throw new Error('Game ID is required');
    }

    const board: BoardStatus = {
      gameId: boardData.gameId,
      boardPda: boardData.boardPda || PublicKey.default,
      fillRate: boardData.fillRate || 0,
      squaresFilled: boardData.squaresFilled || 0,
      totalSquares: boardData.totalSquares || 100,
      totalPot: boardData.totalPot || 0,
      isVIP: boardData.isVIP || false,
      gameType: boardData.gameType || 'Sunday',
      week: boardData.week || 1,
      status: boardData.status || 'pending',
    };

    this.activeBoards.set(board.gameId, board);
    console.log(`Added board ${board.gameId} to monitoring`);
  }

  /**
   * Remove a board from monitoring
   */
  removeBoard(gameId: number): void {
    this.activeBoards.delete(gameId);
    console.log(`Removed board ${gameId} from monitoring`);
  }

  /**
   * Update player metrics
   */
  updatePlayerMetrics(metrics: Partial<PlayerMetrics>): void {
    this.playerMetrics = { ...this.playerMetrics, ...metrics };
    console.log('Updated player metrics:', this.playerMetrics);
  }

  /**
   * Get current monitoring status
   */
  getMonitoringStatus(): {
    isMonitoring: boolean;
    activeBoards: number;
    currentPhase: string;
    playerCount: number;
    treasuryBalance: number;
  } {
    const phase = getCurrentPhase(this.playerMetrics.activePlayerCount);

    return {
      isMonitoring: this.isMonitoring,
      activeBoards: this.activeBoards.size,
      currentPhase: phase.description,
      playerCount: this.playerMetrics.activePlayerCount,
      treasuryBalance: this.playerMetrics.treasuryBalance,
    };
  }

  /**
   * Generate full status report
   */
  async generateStatusReport(): Promise<string> {
    const status = this.getMonitoringStatus();
    const boards = Array.from(this.activeBoards.values());

    let report = `📊 TEMPO CHRONOS STATUS REPORT\n\n`;
    report += `Phase: ${status.currentPhase}\n`;
    report += `Active Players: ${status.playerCount}\n`;
    report += `Treasury: $${status.treasuryBalance.toLocaleString()}\n`;
    report += `Monitoring: ${status.isMonitoring ? '✅' : '❌'}\n\n`;

    report += `ACTIVE BOARDS (${boards.length}):\n`;
    for (const board of boards) {
      report += `\n${board.gameType} Week ${board.week}:\n`;
      report += `  Fill: ${board.fillRate}% (${board.squaresFilled}/${board.totalSquares})\n`;
      report += `  Status: ${board.status}\n`;
      report += `  VIP: ${board.isVIP ? 'Yes' : 'No'}\n`;
      report += `  Pot: $${board.totalPot.toLocaleString()}\n`;
    }

    return report;
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.connection.getLatestBlockhash();
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

export default TempoChronosAgent;
