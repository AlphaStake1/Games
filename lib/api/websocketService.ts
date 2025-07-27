// WebSocket Service - Handles real-time board availability updates
// Replaces polling with efficient real-time communication

import {
  BoardUpdateEvent,
  WebSocketMessage,
  WebSocketSubscription,
  SquarePurchasedEvent,
  VRFCompletedEvent,
  ApiErrorCode,
} from './types';

export type WebSocketEventHandler = (event: BoardUpdateEvent) => void;
export type WebSocketErrorHandler = (error: Error) => void;
export type WebSocketConnectionHandler = (connected: boolean) => void;

export class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private subscriptions: Set<string> = new Set();
  private eventHandlers: Map<string, Set<WebSocketEventHandler>> = new Map();
  private errorHandlers: Set<WebSocketErrorHandler> = new Set();
  private connectionHandlers: Set<WebSocketConnectionHandler> = new Set();

  private readonly WS_URL =
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly MAX_RECONNECT_ATTEMPTS = 10;

  private reconnectAttempts = 0;
  private isConnecting = false;
  private isIntentionallyClosed = false;

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Connect to WebSocket server
  connect(): void {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.isConnecting = true;
    this.isIntentionallyClosed = false;

    try {
      this.ws = new WebSocket(this.WS_URL);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(
        new Error(
          `Failed to create WebSocket connection: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
      this.scheduleReconnect();
    }
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    this.isIntentionallyClosed = true;
    this.clearTimers();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.notifyConnectionHandlers(false);
  }

  // Subscribe to board updates
  subscribeToBoard(boardId: string, handler: WebSocketEventHandler): void {
    // Add handler
    if (!this.eventHandlers.has(boardId)) {
      this.eventHandlers.set(boardId, new Set());
    }
    this.eventHandlers.get(boardId)!.add(handler);

    // Subscribe to board if not already subscribed
    if (!this.subscriptions.has(boardId)) {
      this.subscriptions.add(boardId);
      this.sendSubscription({ boardIds: [boardId] });
    }
  }

  // Unsubscribe from board updates
  unsubscribeFromBoard(boardId: string, handler?: WebSocketEventHandler): void {
    if (handler) {
      // Remove specific handler
      const handlers = this.eventHandlers.get(boardId);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(boardId);
          this.subscriptions.delete(boardId);
          this.sendUnsubscription({ boardIds: [boardId] });
        }
      }
    } else {
      // Remove all handlers for this board
      this.eventHandlers.delete(boardId);
      this.subscriptions.delete(boardId);
      this.sendUnsubscription({ boardIds: [boardId] });
    }
  }

  // Subscribe to game updates
  subscribeToGame(gameId: string, handler: WebSocketEventHandler): void {
    const key = `game:${gameId}`;

    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set());
    }
    this.eventHandlers.get(key)!.add(handler);

    if (!this.subscriptions.has(key)) {
      this.subscriptions.add(key);
      this.sendSubscription({ gameIds: [gameId] });
    }
  }

  // Unsubscribe from game updates
  unsubscribeFromGame(gameId: string, handler?: WebSocketEventHandler): void {
    const key = `game:${gameId}`;

    if (handler) {
      const handlers = this.eventHandlers.get(key);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.eventHandlers.delete(key);
          this.subscriptions.delete(key);
          this.sendUnsubscription({ gameIds: [gameId] });
        }
      }
    } else {
      this.eventHandlers.delete(key);
      this.subscriptions.delete(key);
      this.sendUnsubscription({ gameIds: [gameId] });
    }
  }

  // Subscribe to user-specific updates
  subscribeToUser(walletAddress: string, handler: WebSocketEventHandler): void {
    const key = `user:${walletAddress}`;

    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set());
    }
    this.eventHandlers.get(key)!.add(handler);

    if (!this.subscriptions.has(key)) {
      this.subscriptions.add(key);
      this.sendSubscription({ userWallet: walletAddress });
    }
  }

  // Add error handler
  addErrorHandler(handler: WebSocketErrorHandler): void {
    this.errorHandlers.add(handler);
  }

  // Remove error handler
  removeErrorHandler(handler: WebSocketErrorHandler): void {
    this.errorHandlers.delete(handler);
  }

  // Add connection status handler
  addConnectionHandler(handler: WebSocketConnectionHandler): void {
    this.connectionHandlers.add(handler);
  }

  // Remove connection status handler
  removeConnectionHandler(handler: WebSocketConnectionHandler): void {
    this.connectionHandlers.delete(handler);
  }

  // Get connection status
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Get connection state
  getConnectionState(): string {
    if (!this.ws) return 'disconnected';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting';
      case WebSocket.OPEN:
        return 'connected';
      case WebSocket.CLOSING:
        return 'closing';
      case WebSocket.CLOSED:
        return 'disconnected';
      default:
        return 'unknown';
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyConnectionHandlers(true);
      this.startHeartbeat();
      this.resubscribeAll();
    };

    this.ws.onclose = (event) => {
      this.isConnecting = false;
      this.notifyConnectionHandlers(false);
      this.stopHeartbeat();

      if (!this.isIntentionallyClosed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (event) => {
      this.isConnecting = false;
      this.handleError(new Error('WebSocket connection error'));
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        this.handleError(
          new Error(
            `Failed to parse WebSocket message: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      }
    };
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, boardId, gameId, data, timestamp } = message;

    // Create board update event
    const event: BoardUpdateEvent = {
      type: type as any,
      boardId: boardId || '',
      timestamp,
      data,
    };

    // Notify board-specific handlers
    if (boardId) {
      const handlers = this.eventHandlers.get(boardId);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error('Error in board event handler:', error);
          }
        });
      }
    }

    // Notify game-specific handlers
    if (gameId) {
      const key = `game:${gameId}`;
      const handlers = this.eventHandlers.get(key);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error('Error in game event handler:', error);
          }
        });
      }
    }

    // Notify user-specific handlers if applicable
    if (data.userWallet) {
      const key = `user:${data.userWallet}`;
      const handlers = this.eventHandlers.get(key);
      if (handlers) {
        handlers.forEach((handler) => {
          try {
            handler(event);
          } catch (error) {
            console.error('Error in user event handler:', error);
          }
        });
      }
    }
  }

  private sendSubscription(subscription: WebSocketSubscription): void {
    if (this.isConnected()) {
      const message = {
        type: 'subscribe',
        data: subscription,
        timestamp: new Date().toISOString(),
      };
      this.ws!.send(JSON.stringify(message));
    }
  }

  private sendUnsubscription(subscription: WebSocketSubscription): void {
    if (this.isConnected()) {
      const message = {
        type: 'unsubscribe',
        data: subscription,
        timestamp: new Date().toISOString(),
      };
      this.ws!.send(JSON.stringify(message));
    }
  }

  private resubscribeAll(): void {
    // Group subscriptions by type
    const boardIds: string[] = [];
    const gameIds: string[] = [];
    const userWallets: string[] = [];

    this.subscriptions.forEach((sub) => {
      if (sub.startsWith('game:')) {
        gameIds.push(sub.substring(5));
      } else if (sub.startsWith('user:')) {
        userWallets.push(sub.substring(5));
      } else {
        boardIds.push(sub);
      }
    });

    // Send resubscription requests
    if (boardIds.length > 0) {
      this.sendSubscription({ boardIds });
    }
    if (gameIds.length > 0) {
      this.sendSubscription({ gameIds });
    }
    userWallets.forEach((wallet) => {
      this.sendSubscription({ userWallet: wallet });
    });
  }

  private scheduleReconnect(): void {
    if (
      this.isIntentionallyClosed ||
      this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS
    ) {
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.RECONNECT_INTERVAL * this.reconnectAttempts,
      30000,
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.ws!.send(
          JSON.stringify({
            type: 'ping',
            timestamp: new Date().toISOString(),
          }),
        );
      }
    }, this.HEARTBEAT_INTERVAL);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.stopHeartbeat();
  }

  private handleError(error: Error): void {
    console.error('WebSocket error:', error);
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (err) {
        console.error('Error in WebSocket error handler:', err);
      }
    });
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (error) {
        console.error('Error in connection handler:', error);
      }
    });
  }
}

// Export singleton instance
export const websocketService = WebSocketService.getInstance();

// Utility functions for creating specific event handlers
export const WebSocketUtils = {
  // Create handler for square purchase events
  createSquarePurchaseHandler(
    callback: (event: SquarePurchasedEvent) => void,
  ): WebSocketEventHandler {
    return (event: BoardUpdateEvent) => {
      if (event.type === 'square_purchased') {
        callback(event.data as SquarePurchasedEvent);
      }
    };
  },

  // Create handler for VRF completion events
  createVRFCompletionHandler(
    callback: (event: VRFCompletedEvent) => void,
  ): WebSocketEventHandler {
    return (event: BoardUpdateEvent) => {
      if (event.type === 'vrf_completed') {
        callback(event.data as VRFCompletedEvent);
      }
    };
  },

  // Create handler for board state changes
  createBoardStateHandler(
    callback: (boardId: string, newState: string, data: any) => void,
  ): WebSocketEventHandler {
    return (event: BoardUpdateEvent) => {
      if (event.type === 'board_locked' || event.type === 'board_cancelled') {
        callback(event.boardId, event.type, event.data);
      }
    };
  },

  // Create handler for game score updates
  createScoreUpdateHandler(
    callback: (gameId: string, scoreData: any) => void,
  ): WebSocketEventHandler {
    return (event: BoardUpdateEvent) => {
      if (event.type === 'score_update' && event.data.gameId) {
        callback(event.data.gameId, event.data);
      }
    };
  },
};
