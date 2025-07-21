// server/websocket.ts
import { WebSocketServer } from 'ws';
import { Connection, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, BN } from '@coral-xyz/anchor';
import { EventEmitter } from 'events';
import * as dotenv from 'dotenv';

dotenv.config();

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

interface ClientSubscription {
  gameId?: number;
  boardPda?: string;
  events: string[];
}

interface ConnectedClient {
  id: string;
  ws: any;
  subscriptions: ClientSubscription[];
  lastPing: number;
}

export class WebSocketGameServer extends EventEmitter {
  private wss: WebSocketServer;
  private clients: Map<string, ConnectedClient> = new Map();
  private connection: Connection;
  private provider: AnchorProvider;
  private program: Program;
  private heartbeatInterval: NodeJS.Timeout;

  constructor(
    port: number,
    connection: Connection,
    provider: AnchorProvider,
    program: Program,
  ) {
    super();
    this.connection = connection;
    this.provider = provider;
    this.program = program;

    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });

    // Start heartbeat to keep connections alive
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, 30000); // Every 30 seconds

    console.log(`WebSocket server running on port ${port}`);
  }

  private handleConnection(ws: any, req: any): void {
    const clientId = this.generateClientId();
    const client: ConnectedClient = {
      id: clientId,
      ws,
      subscriptions: [],
      lastPing: Date.now(),
    };

    this.clients.set(clientId, client);

    console.log(`Client connected: ${clientId}`);

    ws.on('message', (data: Buffer) => {
      this.handleMessage(clientId, data);
    });

    ws.on('close', () => {
      this.handleDisconnection(clientId);
    });

    ws.on('error', (error: Error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.handleDisconnection(clientId);
    });

    // Send welcome message
    this.sendToClient(clientId, {
      type: 'connected',
      data: { clientId, timestamp: Date.now() },
      timestamp: Date.now(),
    });
  }

  private handleMessage(clientId: string, data: Buffer): void {
    try {
      const message = JSON.parse(data.toString());
      const client = this.clients.get(clientId);

      if (!client) {
        console.warn(`Message from unknown client: ${clientId}`);
        return;
      }

      switch (message.type) {
        case 'subscribe':
          this.handleSubscription(clientId, message.data);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, message.data);
          break;
        case 'ping':
          this.handlePing(clientId);
          break;
        case 'get_board_state':
          this.handleBoardStateRequest(clientId, message.data);
          break;
        case 'get_game_list':
          this.handleGameListRequest(clientId);
          break;
        default:
          console.warn(`Unknown message type: ${message.type}`);
      }
    } catch (error) {
      console.error(`Error handling message from client ${clientId}:`, error);
    }
  }

  private handleSubscription(clientId: string, subscriptionData: any): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    const subscription: ClientSubscription = {
      gameId: subscriptionData.gameId,
      boardPda: subscriptionData.boardPda,
      events: subscriptionData.events || ['all'],
    };

    client.subscriptions.push(subscription);

    console.log(`Client ${clientId} subscribed to:`, subscription);

    // Send confirmation
    this.sendToClient(clientId, {
      type: 'subscribed',
      data: subscription,
      timestamp: Date.now(),
    });

    // Send initial board state if requesting specific game
    if (subscription.gameId) {
      this.sendBoardState(clientId, subscription.gameId);
    }
  }

  private handleUnsubscription(
    clientId: string,
    unsubscriptionData: any,
  ): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.subscriptions = client.subscriptions.filter(
      (sub) => sub.gameId !== unsubscriptionData.gameId,
    );

    console.log(
      `Client ${clientId} unsubscribed from game ${unsubscriptionData.gameId}`,
    );

    this.sendToClient(clientId, {
      type: 'unsubscribed',
      data: unsubscriptionData,
      timestamp: Date.now(),
    });
  }

  private handlePing(clientId: string): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    client.lastPing = Date.now();

    this.sendToClient(clientId, {
      type: 'pong',
      data: { timestamp: Date.now() },
      timestamp: Date.now(),
    });
  }

  private async handleBoardStateRequest(
    clientId: string,
    requestData: any,
  ): Promise<void> {
    try {
      const gameId = requestData.gameId;
      if (!gameId) {
        this.sendToClient(clientId, {
          type: 'error',
          data: { message: 'gameId is required' },
          timestamp: Date.now(),
        });
        return;
      }

      await this.sendBoardState(clientId, gameId);
    } catch (error) {
      console.error('Error handling board state request:', error);
      this.sendToClient(clientId, {
        type: 'error',
        data: { message: 'Failed to fetch board state' },
        timestamp: Date.now(),
      });
    }
  }

  private async handleGameListRequest(clientId: string): Promise<void> {
    try {
      // In real implementation, this would fetch active games
      const activeGames = [
        { gameId: 1, status: 'active', playersCount: 45 },
        { gameId: 2, status: 'pending', playersCount: 12 },
        { gameId: 3, status: 'completed', playersCount: 100 },
      ];

      this.sendToClient(clientId, {
        type: 'game_list',
        data: { games: activeGames },
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error handling game list request:', error);
      this.sendToClient(clientId, {
        type: 'error',
        data: { message: 'Failed to fetch game list' },
        timestamp: Date.now(),
      });
    }
  }

  private async sendBoardState(
    clientId: string,
    gameId: number,
  ): Promise<void> {
    try {
      const [boardPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('board'), new BN(gameId).toArrayLike(Buffer, 'le', 8)],
        this.program.programId,
      );

      const boardAccount = await this.program.account.board.fetch(boardPda);

      const boardState = {
        gameId: boardAccount.gameId.toNumber(),
        authority: boardAccount.authority.toString(),
        finalized: boardAccount.finalized,
        randomized: boardAccount.randomized,
        gameStarted: boardAccount.gameStarted,
        gameEnded: boardAccount.gameEnded,
        winner: boardAccount.winner.toString(),
        payoutAmount: boardAccount.payoutAmount.toNumber(),
        totalPot: boardAccount.totalPot.toNumber(),
        homeScore: boardAccount.homeScore,
        awayScore: boardAccount.awayScore,
        quarter: boardAccount.quarter,
        squares: boardAccount.squares.map((s: any) => s.toString()),
        homeHeaders: boardAccount.homeHeaders,
        awayHeaders: boardAccount.awayHeaders,
        lastUpdated: Date.now(),
      };

      this.sendToClient(clientId, {
        type: 'board_state',
        data: boardState,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error sending board state:', error);
      this.sendToClient(clientId, {
        type: 'error',
        data: { message: 'Failed to fetch board state' },
        timestamp: Date.now(),
      });
    }
  }

  // Public methods for broadcasting events
  public broadcastBoardUpdate(gameId: number, updateData: any): void {
    const message: WebSocketMessage = {
      type: 'board_update',
      data: { gameId, ...updateData },
      timestamp: Date.now(),
    };

    this.broadcastToSubscribers(gameId, message);
  }

  public broadcastScoreUpdate(gameId: number, scoreData: any): void {
    const message: WebSocketMessage = {
      type: 'score_update',
      data: { gameId, ...scoreData },
      timestamp: Date.now(),
    };

    this.broadcastToSubscribers(gameId, message);
  }

  public broadcastWinnerAnnouncement(gameId: number, winnerData: any): void {
    const message: WebSocketMessage = {
      type: 'winner_announced',
      data: { gameId, ...winnerData },
      timestamp: Date.now(),
    };

    this.broadcastToSubscribers(gameId, message);
  }

  public broadcastSquarePurchase(gameId: number, purchaseData: any): void {
    const message: WebSocketMessage = {
      type: 'square_purchased',
      data: { gameId, ...purchaseData },
      timestamp: Date.now(),
    };

    this.broadcastToSubscribers(gameId, message);
  }

  private broadcastToSubscribers(
    gameId: number,
    message: WebSocketMessage,
  ): void {
    let sentCount = 0;

    for (const [clientId, client] of this.clients) {
      const isSubscribed = client.subscriptions.some(
        (sub) => sub.gameId === gameId || sub.events.includes('all'),
      );

      if (isSubscribed) {
        this.sendToClient(clientId, message);
        sentCount++;
      }
    }

    console.log(
      `Broadcast ${message.type} to ${sentCount} clients for game ${gameId}`,
    );
  }

  private sendToClient(clientId: string, message: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      client.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error(`Error sending message to client ${clientId}:`, error);
      this.handleDisconnection(clientId);
    }
  }

  private handleDisconnection(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      this.clients.delete(clientId);
      console.log(`Client disconnected: ${clientId}`);
    }
  }

  private sendHeartbeat(): void {
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute

    for (const [clientId, client] of this.clients) {
      if (now - client.lastPing > staleThreshold) {
        console.log(`Removing stale client: ${clientId}`);
        this.handleDisconnection(clientId);
      } else {
        this.sendToClient(clientId, {
          type: 'heartbeat',
          data: { timestamp: now },
          timestamp: now,
        });
      }
    }
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  public getStats(): {
    connectedClients: number;
    totalSubscriptions: number;
    activeGames: number;
  } {
    const totalSubscriptions = Array.from(this.clients.values()).reduce(
      (sum, client) => sum + client.subscriptions.length,
      0,
    );

    const activeGames = new Set();
    for (const client of this.clients.values()) {
      for (const sub of client.subscriptions) {
        if (sub.gameId) {
          activeGames.add(sub.gameId);
        }
      }
    }

    return {
      connectedClients: this.clients.size,
      totalSubscriptions,
      activeGames: activeGames.size,
    };
  }

  public close(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.wss.close();
    console.log('WebSocket server closed');
  }
}

// Start the WebSocket server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.WS_PORT || '8080');

  // Initialize Solana connection and program
  const connection = new Connection(
    process.env.RPC_ENDPOINT || 'https://api.devnet.solana.com',
  );
  // Note: In real implementation, you'd properly initialize the provider and program

  const server = new WebSocketGameServer(
    port,
    connection,
    null as any,
    null as any,
  );

  process.on('SIGINT', () => {
    console.log('Shutting down WebSocket server...');
    server.close();
    process.exit(0);
  });
}

export default WebSocketGameServer;
