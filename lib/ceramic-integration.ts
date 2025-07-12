// lib/ceramic-integration.ts
import CeramicLogger from '../ceramic/client';
import { EventEmitter } from 'events';

interface LoggingConfig {
  enabled: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  bufferSize: number;
  flushInterval: number;
}

export class CeramicIntegration extends EventEmitter {
  private ceramicLogger: CeramicLogger;
  private config: LoggingConfig;
  private eventBuffer: any[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isInitialized: boolean = false;

  constructor(config: Partial<LoggingConfig> = {}) {
    super();
    
    this.config = {
      enabled: true,
      logLevel: 'info',
      bufferSize: 50,
      flushInterval: 10000, // 10 seconds
      ...config
    };

    this.ceramicLogger = new CeramicLogger();
    
    if (this.config.enabled) {
      this.initialize();
    }
  }

  private async initialize(): Promise<void> {
    try {
      await this.ceramicLogger.initialize();
      this.isInitialized = true;
      this.startBufferFlush();
      
      this.emit('initialized');
      console.log('Ceramic integration initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Ceramic integration:', error);
      this.emit('error', error);
    }
  }

  private startBufferFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flushBuffer();
    }, this.config.flushInterval);
  }

  private async flushBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0 || !this.isInitialized) {
      return;
    }

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      for (const event of eventsToFlush) {
        switch (event.type) {
          case 'game_event':
            await this.ceramicLogger.logGameEvent(event.data);
            break;
          case 'user_action':
            await this.ceramicLogger.logUserAction(event.data);
            break;
          case 'system_log':
            await this.ceramicLogger.logSystemEvent(event.data);
            break;
        }
      }
      
      this.emit('bufferFlushed', eventsToFlush.length);
    } catch (error) {
      console.error('Error flushing buffer to Ceramic:', error);
      // Re-add failed events to buffer for retry
      this.eventBuffer.unshift(...eventsToFlush);
      this.emit('flushError', error);
    }
  }

  // Public logging methods
  public logBoardCreated(gameId: number, authority: string, boardPda: string): void {
    this.addToBuffer('game_event', {
      eventType: 'board_created',
      gameId,
      timestamp: Date.now(),
      data: { authority, boardPda }
    });
  }

  public logSquarePurchased(gameId: number, squareIndex: number, buyer: string, amount: number): void {
    this.addToBuffer('game_event', {
      eventType: 'square_purchased',
      gameId,
      timestamp: Date.now(),
      data: { squareIndex, buyer, amount }
    });
  }

  public logHeadersRandomized(gameId: number, homeHeaders: number[], awayHeaders: number[]): void {
    this.addToBuffer('game_event', {
      eventType: 'headers_randomized',
      gameId,
      timestamp: Date.now(),
      data: { homeHeaders, awayHeaders }
    });
  }

  public logScoreUpdate(gameId: number, homeScore: number, awayScore: number, quarter: number): void {
    this.addToBuffer('game_event', {
      eventType: 'score_recorded',
      gameId,
      timestamp: Date.now(),
      data: { homeScore, awayScore, quarter }
    });
  }

  public logWinnerSettled(gameId: number, winner: string, payoutAmount: number, squareIndex: number): void {
    this.addToBuffer('game_event', {
      eventType: 'winner_settled',
      gameId,
      timestamp: Date.now(),
      data: { winner, payoutAmount, squareIndex }
    });
  }

  public logPayoutCompleted(gameId: number, winner: string, amount: number, transactionId: string): void {
    this.addToBuffer('game_event', {
      eventType: 'winner_paid',
      gameId,
      timestamp: Date.now(),
      data: { winner, amount, transactionId }
    });
  }

  public logUserAction(actionType: string, userId: string, gameId?: number, data?: any): void {
    this.addToBuffer('user_action', {
      actionType,
      userId,
      gameId,
      timestamp: Date.now(),
      data: data || {}
    });
  }

  public logSystemEvent(component: string, level: 'info' | 'warn' | 'error' | 'debug', message: string, metadata?: any): void {
    if (this.shouldLog(level)) {
      this.addToBuffer('system_log', {
        logLevel: level,
        component,
        message,
        timestamp: Date.now(),
        metadata
      });
    }
  }

  private shouldLog(level: string): boolean {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = levels.indexOf(this.config.logLevel);
    const messageLevel = levels.indexOf(level);
    return messageLevel >= configLevel;
  }

  private addToBuffer(type: string, data: any): void {
    if (!this.config.enabled) {
      return;
    }

    this.eventBuffer.push({ type, data });

    // Force flush if buffer is full
    if (this.eventBuffer.length >= this.config.bufferSize) {
      this.flushBuffer();
    }
  }

  // Query methods
  public async getGameHistory(gameId: number): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Ceramic integration not initialized');
    }

    const events = await this.ceramicLogger.getGameEvents(gameId);
    const actions = await this.ceramicLogger.getUserActions(undefined, gameId);
    
    return {
      events,
      actions,
      analytics: await this.ceramicLogger.getAnalytics(gameId)
    };
  }

  public async getUserHistory(userId: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Ceramic integration not initialized');
    }

    const actions = await this.ceramicLogger.getUserActions(userId);
    return { actions };
  }

  public async getSystemLogs(component?: string, logLevel?: string): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Ceramic integration not initialized');
    }

    return await this.ceramicLogger.getSystemLogs(component, logLevel);
  }

  public async getAnalytics(gameId?: number): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Ceramic integration not initialized');
    }

    return await this.ceramicLogger.getAnalytics(gameId);
  }

  // Health and status methods
  public async healthCheck(): Promise<boolean> {
    if (!this.isInitialized) {
      return false;
    }

    return await this.ceramicLogger.healthCheck();
  }

  public getStatus(): any {
    return {
      initialized: this.isInitialized,
      enabled: this.config.enabled,
      bufferSize: this.eventBuffer.length,
      streamIds: this.isInitialized ? this.ceramicLogger.getStreamIds() : null
    };
  }

  public async forceFlush(): Promise<void> {
    await this.flushBuffer();
  }

  public stop(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    
    // Final flush before stopping
    this.flushBuffer();
  }
}

// Singleton instance for global use
let ceramicIntegration: CeramicIntegration | null = null;

export function getCeramicIntegration(): CeramicIntegration {
  if (!ceramicIntegration) {
    ceramicIntegration = new CeramicIntegration();
  }
  return ceramicIntegration;
}

export function initializeCeramicIntegration(config?: Partial<LoggingConfig>): CeramicIntegration {
  ceramicIntegration = new CeramicIntegration(config);
  return ceramicIntegration;
}

export default CeramicIntegration;