// ceramic/client.ts
import { CeramicClient } from '@ceramicnetwork/http-client';
import { TileDocument } from '@ceramicnetwork/stream-tile';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { fromString } from 'uint8arrays/from-string';
import * as dotenv from 'dotenv';

dotenv.config();

interface GameEvent {
  eventType: string;
  gameId: number;
  timestamp: number;
  data: any;
  signature?: string;
}

interface UserAction {
  actionType: string;
  userId: string;
  gameId?: number;
  timestamp: number;
  data: any;
}

interface SystemLog {
  logLevel: 'info' | 'warn' | 'error' | 'debug';
  component: string;
  message: string;
  timestamp: number;
  metadata?: any;
}

export class CeramicLogger {
  private ceramic: CeramicClient;
  private did: DID;
  private gameEventsStreamId: string | null = null;
  private userActionsStreamId: string | null = null;
  private systemLogsStreamId: string | null = null;

  constructor() {
    // Connect to Ceramic node
    const ceramicUrl = process.env.CERAMIC_URL || 'https://ceramic-clay.3boxlabs.com';
    this.ceramic = new CeramicClient(ceramicUrl);
    
    this.initializeDID();
  }

  private async initializeDID(): Promise<void> {
    try {
      // Create DID from seed
      const seed = process.env.CERAMIC_DID_SEED;
      if (!seed) {
        throw new Error('CERAMIC_DID_SEED is required');
      }

      const key = fromString(seed, 'base16');
      const provider = new Ed25519Provider(key);
      
      this.did = new DID({ provider, resolver: getResolver() });
      await this.did.authenticate();
      
      this.ceramic.did = this.did;
      
      console.log('Ceramic DID initialized:', this.did.id);
    } catch (error) {
      console.error('Error initializing DID:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    try {
      await this.initializeDID();
      await this.createDataStreams();
      console.log('Ceramic logger initialized successfully');
    } catch (error) {
      console.error('Error initializing Ceramic logger:', error);
      throw error;
    }
  }

  private async createDataStreams(): Promise<void> {
    try {
      // Create game events stream
      const gameEventsDoc = await TileDocument.create(
        this.ceramic,
        {
          name: 'Football Squares Game Events',
          description: 'Stream for recording all game-related events',
          schema: {
            type: 'object',
            properties: {
              events: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    eventType: { type: 'string' },
                    gameId: { type: 'number' },
                    timestamp: { type: 'number' },
                    data: { type: 'object' },
                    signature: { type: 'string' }
                  },
                  required: ['eventType', 'gameId', 'timestamp', 'data']
                }
              }
            }
          },
          events: []
        },
        {
          controllers: [this.did.id],
          family: 'football-squares-events'
        }
      );
      this.gameEventsStreamId = gameEventsDoc.id.toString();

      // Create user actions stream
      const userActionsDoc = await TileDocument.create(
        this.ceramic,
        {
          name: 'Football Squares User Actions',
          description: 'Stream for recording user interactions',
          schema: {
            type: 'object',
            properties: {
              actions: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    actionType: { type: 'string' },
                    userId: { type: 'string' },
                    gameId: { type: 'number' },
                    timestamp: { type: 'number' },
                    data: { type: 'object' }
                  },
                  required: ['actionType', 'userId', 'timestamp', 'data']
                }
              }
            }
          },
          actions: []
        },
        {
          controllers: [this.did.id],
          family: 'football-squares-users'
        }
      );
      this.userActionsStreamId = userActionsDoc.id.toString();

      // Create system logs stream
      const systemLogsDoc = await TileDocument.create(
        this.ceramic,
        {
          name: 'Football Squares System Logs',
          description: 'Stream for system logging and monitoring',
          schema: {
            type: 'object',
            properties: {
              logs: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    logLevel: { type: 'string', enum: ['info', 'warn', 'error', 'debug'] },
                    component: { type: 'string' },
                    message: { type: 'string' },
                    timestamp: { type: 'number' },
                    metadata: { type: 'object' }
                  },
                  required: ['logLevel', 'component', 'message', 'timestamp']
                }
              }
            }
          },
          logs: []
        },
        {
          controllers: [this.did.id],
          family: 'football-squares-system'
        }
      );
      this.systemLogsStreamId = systemLogsDoc.id.toString();

      console.log('Ceramic data streams created:');
      console.log('Game Events:', this.gameEventsStreamId);
      console.log('User Actions:', this.userActionsStreamId);
      console.log('System Logs:', this.systemLogsStreamId);
    } catch (error) {
      console.error('Error creating data streams:', error);
      throw error;
    }
  }

  async logGameEvent(event: GameEvent): Promise<void> {
    try {
      if (!this.gameEventsStreamId) {
        throw new Error('Game events stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.gameEventsStreamId);
      const currentData = doc.content as any;
      
      const updatedEvents = [...(currentData.events || []), event];
      
      await doc.update({
        ...currentData,
        events: updatedEvents,
        lastUpdated: Date.now()
      });

      console.log(`Game event logged: ${event.eventType} for game ${event.gameId}`);
    } catch (error) {
      console.error('Error logging game event:', error);
      throw error;
    }
  }

  async logUserAction(action: UserAction): Promise<void> {
    try {
      if (!this.userActionsStreamId) {
        throw new Error('User actions stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.userActionsStreamId);
      const currentData = doc.content as any;
      
      const updatedActions = [...(currentData.actions || []), action];
      
      await doc.update({
        ...currentData,
        actions: updatedActions,
        lastUpdated: Date.now()
      });

      console.log(`User action logged: ${action.actionType} by ${action.userId}`);
    } catch (error) {
      console.error('Error logging user action:', error);
      throw error;
    }
  }

  async logSystemEvent(log: SystemLog): Promise<void> {
    try {
      if (!this.systemLogsStreamId) {
        throw new Error('System logs stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.systemLogsStreamId);
      const currentData = doc.content as any;
      
      const updatedLogs = [...(currentData.logs || []), log];
      
      // Keep only the last 1000 logs to prevent excessive growth
      const trimmedLogs = updatedLogs.slice(-1000);
      
      await doc.update({
        ...currentData,
        logs: trimmedLogs,
        lastUpdated: Date.now()
      });

      console.log(`System log recorded: ${log.logLevel} - ${log.message}`);
    } catch (error) {
      console.error('Error logging system event:', error);
      throw error;
    }
  }

  async getGameEvents(gameId?: number, limit: number = 100): Promise<GameEvent[]> {
    try {
      if (!this.gameEventsStreamId) {
        throw new Error('Game events stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.gameEventsStreamId);
      const data = doc.content as any;
      
      let events = data.events || [];
      
      if (gameId !== undefined) {
        events = events.filter((event: GameEvent) => event.gameId === gameId);
      }
      
      return events
        .sort((a: GameEvent, b: GameEvent) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting game events:', error);
      return [];
    }
  }

  async getUserActions(userId?: string, gameId?: number, limit: number = 100): Promise<UserAction[]> {
    try {
      if (!this.userActionsStreamId) {
        throw new Error('User actions stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.userActionsStreamId);
      const data = doc.content as any;
      
      let actions = data.actions || [];
      
      if (userId) {
        actions = actions.filter((action: UserAction) => action.userId === userId);
      }
      
      if (gameId !== undefined) {
        actions = actions.filter((action: UserAction) => action.gameId === gameId);
      }
      
      return actions
        .sort((a: UserAction, b: UserAction) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting user actions:', error);
      return [];
    }
  }

  async getSystemLogs(component?: string, logLevel?: string, limit: number = 100): Promise<SystemLog[]> {
    try {
      if (!this.systemLogsStreamId) {
        throw new Error('System logs stream not initialized');
      }

      const doc = await TileDocument.load(this.ceramic, this.systemLogsStreamId);
      const data = doc.content as any;
      
      let logs = data.logs || [];
      
      if (component) {
        logs = logs.filter((log: SystemLog) => log.component === component);
      }
      
      if (logLevel) {
        logs = logs.filter((log: SystemLog) => log.logLevel === logLevel);
      }
      
      return logs
        .sort((a: SystemLog, b: SystemLog) => b.timestamp - a.timestamp)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting system logs:', error);
      return [];
    }
  }

  async getAnalytics(gameId?: number): Promise<any> {
    try {
      const events = await this.getGameEvents(gameId, 1000);
      const actions = gameId ? await this.getUserActions(undefined, gameId, 1000) : [];

      const analytics = {
        totalEvents: events.length,
        totalActions: actions.length,
        eventTypes: {},
        actionTypes: {},
        timeline: [],
        gameStats: gameId ? this.calculateGameStats(events, actions) : null
      };

      // Count event types
      events.forEach(event => {
        analytics.eventTypes[event.eventType] = (analytics.eventTypes[event.eventType] || 0) + 1;
      });

      // Count action types
      actions.forEach(action => {
        analytics.actionTypes[action.actionType] = (analytics.actionTypes[action.actionType] || 0) + 1;
      });

      // Create timeline
      const allItems = [...events, ...actions].sort((a, b) => a.timestamp - b.timestamp);
      analytics.timeline = allItems.slice(-50); // Last 50 items

      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      return null;
    }
  }

  private calculateGameStats(events: GameEvent[], actions: UserAction[]): any {
    const stats = {
      boardCreated: false,
      randomized: false,
      gameStarted: false,
      gameEnded: false,
      totalSquaresPurchased: 0,
      uniquePlayers: new Set(),
      scoreUpdates: 0,
      winnerSettled: false,
      payoutCompleted: false
    };

    events.forEach(event => {
      switch (event.eventType) {
        case 'board_created':
          stats.boardCreated = true;
          break;
        case 'headers_randomized':
          stats.randomized = true;
          break;
        case 'game_started':
          stats.gameStarted = true;
          break;
        case 'game_ended':
          stats.gameEnded = true;
          break;
        case 'square_purchased':
          stats.totalSquaresPurchased++;
          if (event.data.buyer) {
            stats.uniquePlayers.add(event.data.buyer);
          }
          break;
        case 'score_recorded':
          stats.scoreUpdates++;
          break;
        case 'winner_settled':
          stats.winnerSettled = true;
          break;
        case 'winner_paid':
          stats.payoutCompleted = true;
          break;
      }
    });

    return {
      ...stats,
      uniquePlayers: stats.uniquePlayers.size
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Test ceramic connection
      const nodeInfo = await this.ceramic.getSupportedChains();
      
      // Test DID authentication
      if (!this.did.authenticated) {
        await this.did.authenticate();
      }

      // Test stream access
      if (this.gameEventsStreamId) {
        await TileDocument.load(this.ceramic, this.gameEventsStreamId);
      }

      return true;
    } catch (error) {
      console.error('Ceramic health check failed:', error);
      return false;
    }
  }

  getStreamIds(): { gameEvents: string | null; userActions: string | null; systemLogs: string | null } {
    return {
      gameEvents: this.gameEventsStreamId,
      userActions: this.userActionsStreamId,
      systemLogs: this.systemLogsStreamId
    };
  }
}

export default CeramicLogger;