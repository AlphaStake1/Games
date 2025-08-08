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

  // Outbound message buffering when socket is not yet open
  private pendingMessages: string[] = [];

  // Connection state
  private reconnectAttempts = 0;
  private isConnecting = false;
  private isIntentionallyClosed = false;
  private isOnline: boolean =
    typeof navigator !== 'undefined' ? navigator.onLine : true;

  // Heartbeat diagnostics
  private lastPingAt: number | null = null;
  private lastPongAt: number | null = null;

  private readonly WS_URL =
    process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws';
  private readonly RECONNECT_INTERVAL = 5000; // 5 seconds
  private readonly HEARTBEAT_INTERVAL = 30000; // 30 seconds
  private readonly MAX_RECONNECT_ATTEMPTS = 10;

  // (moved to declaration block above)

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  // Lifecycle and environment hooks
  constructor() {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine;

      window.addEventListener('online', () => {
        this.isOnline = true;
        this.scheduleReconnect(true);
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.clearTimers();
        if (this.ws) {
          try {
            this.ws.close(1001, 'Network offline');
          } catch {}
        }
        this.notifyConnectionHandlers(false);
      });

      // Reduce background noise; kick a heartbeat when returning to foreground
      document.addEventListener?.('visibilitychange', () => {
        if (
          typeof document !== 'undefined' &&
          document.visibilityState === 'visible' &&
          this.isConnected()
        ) {
          try {
            this.ws!.send(
              JSON.stringify({
                type: 'ping',
                timestamp: new Date().toISOString(),
              }),
            );
          } catch {}
        }
      });
    }
  }

  // Connect to WebSocket server
  connect(): void {
    if (typeof window === 'undefined') return; // SSR/Node guard

    if (!this.isOnline) {
      // Wait until we are back online; online listener will trigger reconnect
      return;
    }

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
          `Failed to create WebSocket connection: ${
            error instanceof Error ? error.message : String(error)
          }`,
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

      // Flush any queued messages
      if (this.pendingMessages.length > 0) {
        const queued = this.pendingMessages.splice(0);
        for (const msg of queued) {
          try {
            this.ws!.send(msg);
          } catch (e) {
            // If send fails, break to avoid infinite loop
            break;
          }
        }
      }
    };

    this.ws.onclose = (event) => {
      this.isConnecting = false;
      this.notifyConnectionHandlers(false);
      this.stopHeartbeat();

      if (!this.isIntentionallyClosed && this.isOnline) {
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

        // Heartbeat response
        if (message.type === 'pong') {
          this.lastPongAt = Date.now();
          return;
        }

        this.handleMessage(message);
      } catch (error) {
        this.handleError(
          new Error(
            `Failed to parse WebSocket message: ${
              error instanceof Error ? error.message : String(error)
            }`,
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
    const message = {
      type: 'subscribe',
      data: subscription,
      timestamp: new Date().toISOString(),
    };
    const payload = JSON.stringify(message);

    if (this.isConnected()) {
      this.ws!.send(payload);
    } else {
      this.pendingMessages.push(payload);
    }
  }

  private sendUnsubscription(subscription: WebSocketSubscription): void {
    const message = {
      type: 'unsubscribe',
      data: subscription,
      timestamp: new Date().toISOString(),
    };
    const payload = JSON.stringify(message);

    if (this.isConnected()) {
      this.ws!.send(payload);
    } else {
      this.pendingMessages.push(payload);
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

  private scheduleReconnect(forceImmediate: boolean = false): void {
    if (this.isIntentionallyClosed || !this.isOnline) {
      return;
    }

    if (forceImmediate) {
      this.reconnectAttempts = 0;
    }

    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      return;
    }

    const attempt = this.reconnectAttempts++;
    const base = this.RECONNECT_INTERVAL;
    const exp = Math.min(base * Math.pow(2, attempt), 30000); // capped exponential
    const jitter = Math.random() * exp; // full jitter
    const delay = forceImmediate ? 0 : jitter;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected() && this.isOnline) {
        const visible =
          typeof document === 'undefined'
            ? true
            : document.visibilityState === 'visible';
        if (!visible) return;

        this.lastPingAt = Date.now();

        try {
          this.ws!.send(
            JSON.stringify({
              type: 'ping',
              timestamp: new Date().toISOString(),
            }),
          );
        } catch {
          // Force reconnect path on send failure
          try {
            this.ws?.close();
          } catch {}
        }
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
