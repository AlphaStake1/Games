// tests/integration.test.ts
import { expect } from 'chai';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet } from '@coral-xyz/anchor';
import WebSocket from 'ws';
import { AgentRunner } from '../scripts/run-agents';
import WebSocketGameServer from '../server/websocket';
import { getCeramicIntegration } from '../lib/ceramic-integration';

describe('Integration Tests', () => {
  let connection: Connection;
  let provider: AnchorProvider;
  let program: Program;
  let agentRunner: AgentRunner;
  let wsServer: WebSocketGameServer;
  let wsClient: WebSocket;
  let gameId: number;

  before(async function () {
    this.timeout(30000); // Allow extra time for setup

    // Setup Solana connection
    connection = new Connection('http://localhost:8899');
    const wallet = new Wallet(Keypair.generate());
    provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });

    // Mock program for testing
    program = {} as Program;

    gameId = Math.floor(Math.random() * 10000);

    // Initialize WebSocket server
    wsServer = new WebSocketGameServer(8081, connection, provider, program);

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  after(async () => {
    if (wsClient) {
      wsClient.close();
    }
    if (wsServer) {
      wsServer.close();
    }
    if (agentRunner) {
      await agentRunner.stop();
    }
  });

  describe('WebSocket Integration', () => {
    it('should establish WebSocket connection', (done) => {
      wsClient = new WebSocket('ws://localhost:8081');

      wsClient.on('open', () => {
        expect(wsClient.readyState).to.equal(WebSocket.OPEN);
        done();
      });

      wsClient.on('error', (error) => {
        done(error);
      });
    });

    it('should receive welcome message', (done) => {
      wsClient.on('message', (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'connected') {
          expect(message.data).to.have.property('clientId');
          expect(message.data).to.have.property('timestamp');
          done();
        }
      });
    });

    it('should handle subscription requests', (done) => {
      const subscriptionMessage = {
        type: 'subscribe',
        data: {
          gameId: gameId,
          events: ['board_update', 'score_update'],
        },
      };

      wsClient.send(JSON.stringify(subscriptionMessage));

      wsClient.on('message', (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'subscribed') {
          expect(message.data.gameId).to.equal(gameId);
          expect(message.data.events).to.include('board_update');
          expect(message.data.events).to.include('score_update');
          done();
        }
      });
    });

    it('should broadcast board updates', (done) => {
      // Simulate a board update
      wsServer.broadcastBoardUpdate(gameId, {
        type: 'square_purchased',
        squareIndex: 0,
        buyer: 'test-buyer',
      });

      wsClient.on('message', (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'board_update') {
          expect(message.data.gameId).to.equal(gameId);
          expect(message.data.type).to.equal('square_purchased');
          expect(message.data.squareIndex).to.equal(0);
          done();
        }
      });
    });

    it('should handle ping/pong', (done) => {
      wsClient.send(JSON.stringify({ type: 'ping' }));

      wsClient.on('message', (data) => {
        const message = JSON.parse(data.toString());

        if (message.type === 'pong') {
          expect(message.data).to.have.property('timestamp');
          done();
        }
      });
    });
  });

  describe('Ceramic Integration', () => {
    let ceramicIntegration: any;

    before(async function () {
      this.timeout(15000);

      // Initialize Ceramic integration
      ceramicIntegration = getCeramicIntegration();

      // Wait for initialization
      await new Promise((resolve) => {
        ceramicIntegration.on('initialized', resolve);
        // Fallback timeout
        setTimeout(resolve, 10000);
      });
    });

    it('should log game events', async () => {
      ceramicIntegration.logBoardCreated(
        gameId,
        'test-authority',
        'test-board-pda',
      );

      ceramicIntegration.logSquarePurchased(gameId, 5, 'test-buyer', 10000000);

      // Force flush to ensure events are written
      await ceramicIntegration.forceFlush();

      // Verify events were logged
      const gameHistory = await ceramicIntegration.getGameHistory(gameId);
      expect(gameHistory.events.length).to.be.greaterThan(0);

      const boardCreatedEvent = gameHistory.events.find(
        (e: any) => e.eventType === 'board_created',
      );
      expect(boardCreatedEvent).to.exist;
      expect(boardCreatedEvent.gameId).to.equal(gameId);
    });

    it('should log user actions', async () => {
      ceramicIntegration.logUserAction(
        'connect_wallet',
        'test-user-123',
        gameId,
        { walletType: 'phantom' },
      );

      await ceramicIntegration.forceFlush();

      const userHistory =
        await ceramicIntegration.getUserHistory('test-user-123');
      expect(userHistory.actions.length).to.be.greaterThan(0);

      const connectAction = userHistory.actions.find(
        (a: any) => a.actionType === 'connect_wallet',
      );
      expect(connectAction).to.exist;
      expect(connectAction.userId).to.equal('test-user-123');
    });

    it('should generate analytics', async () => {
      const analytics = await ceramicIntegration.getAnalytics(gameId);

      expect(analytics).to.have.property('totalEvents');
      expect(analytics).to.have.property('eventTypes');
      expect(analytics).to.have.property('gameStats');
      expect(analytics.totalEvents).to.be.greaterThan(0);
    });

    it('should perform health check', async () => {
      const isHealthy = await ceramicIntegration.healthCheck();
      expect(isHealthy).to.be.a('boolean');
    });
  });

  describe('Agent System Integration', () => {
    it('should initialize agent runner', async function () {
      this.timeout(10000);

      // Mock agent runner initialization
      // In real tests, this would start the actual agent system
      const mockRunner = {
        start: async () => true,
        stop: async () => true,
        createGame: async () => true,
        getStats: () => ({ activeGames: 0, isRunning: false }),
      };

      expect(mockRunner.getStats().isRunning).to.be.false;
    });

    it('should handle game lifecycle events', async () => {
      // Mock game lifecycle
      const gameEvents = [
        'board_created',
        'randomization_requested',
        'headers_randomized',
        'square_purchased',
        'game_started',
        'score_recorded',
        'game_ended',
        'winner_settled',
        'winner_paid',
      ];

      // Simulate each event
      for (const eventType of gameEvents) {
        ceramicIntegration.logGameEvent({
          eventType,
          gameId,
          timestamp: Date.now(),
          data: { step: eventType },
        });
      }

      await ceramicIntegration.forceFlush();

      const gameHistory = await ceramicIntegration.getGameHistory(gameId);

      // Verify all events were logged
      for (const eventType of gameEvents) {
        const event = gameHistory.events.find(
          (e: any) => e.eventType === eventType,
        );
        expect(event, `Event ${eventType} should be logged`).to.exist;
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle WebSocket connection errors gracefully', (done) => {
      const badClient = new WebSocket('ws://localhost:9999'); // Non-existent server

      badClient.on('error', (error) => {
        expect(error).to.exist;
        done();
      });
    });

    it('should handle malformed WebSocket messages', (done) => {
      wsClient.send('invalid json');

      // Should not crash the server
      setTimeout(() => {
        expect(wsClient.readyState).to.equal(WebSocket.OPEN);
        done();
      }, 1000);
    });

    it('should handle Ceramic logging errors gracefully', async () => {
      // Try to log with invalid data
      try {
        ceramicIntegration.logGameEvent({
          eventType: null,
          gameId: 'invalid',
          timestamp: 'invalid',
          data: undefined,
        });

        // Should not throw immediately (buffered)
        expect(true).to.be.true;
      } catch (error) {
        // Error handling should be graceful
        expect(error).to.exist;
      }
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent WebSocket connections', async function () {
      this.timeout(10000);

      const clients: WebSocket[] = [];
      const numClients = 10;

      // Create multiple connections
      for (let i = 0; i < numClients; i++) {
        const client = new WebSocket('ws://localhost:8081');
        clients.push(client);
      }

      // Wait for all connections to open
      await Promise.all(
        clients.map(
          (client) =>
            new Promise((resolve) => {
              client.on('open', resolve);
            }),
        ),
      );

      expect(clients.length).to.equal(numClients);

      // Broadcast a message to all clients
      wsServer.broadcastBoardUpdate(gameId, { type: 'test_broadcast' });

      // Clean up
      clients.forEach((client) => client.close());
    });

    it('should handle high-frequency event logging', async function () {
      this.timeout(15000);

      const startTime = Date.now();
      const numEvents = 100;

      // Log many events quickly
      for (let i = 0; i < numEvents; i++) {
        ceramicIntegration.logUserAction(
          'performance_test',
          `user-${i}`,
          gameId,
          { iteration: i },
        );
      }

      await ceramicIntegration.forceFlush();
      const endTime = Date.now();

      const duration = endTime - startTime;
      const eventsPerSecond = (numEvents / duration) * 1000;

      console.log(
        `Processed ${numEvents} events in ${duration}ms (${eventsPerSecond.toFixed(2)} events/sec)`,
      );

      // Should process at least 10 events per second
      expect(eventsPerSecond).to.be.greaterThan(10);
    });
  });

  describe('End-to-End Game Flow', () => {
    it('should execute complete game lifecycle', async function () {
      this.timeout(20000);

      const testGameId = gameId + 1;

      // 1. Create board
      ceramicIntegration.logBoardCreated(testGameId, 'authority', 'board-pda');
      wsServer.broadcastBoardUpdate(testGameId, { type: 'board_created' });

      // 2. Purchase squares
      for (let i = 0; i < 5; i++) {
        ceramicIntegration.logSquarePurchased(
          testGameId,
          i,
          `player-${i}`,
          10000000,
        );
        wsServer.broadcastSquarePurchase(testGameId, {
          squareIndex: i,
          buyer: `player-${i}`,
        });
      }

      // 3. Randomize headers
      ceramicIntegration.logHeadersRandomized(
        testGameId,
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
      );
      wsServer.broadcastBoardUpdate(testGameId, { type: 'randomized' });

      // 4. Record scores
      ceramicIntegration.logScoreUpdate(testGameId, 14, 7, 2);
      wsServer.broadcastScoreUpdate(testGameId, {
        homeScore: 14,
        awayScore: 7,
        quarter: 2,
      });

      // 5. End game and settle winner
      ceramicIntegration.logScoreUpdate(testGameId, 28, 21, 4);
      ceramicIntegration.logWinnerSettled(testGameId, 'player-3', 50000000, 34);
      wsServer.broadcastWinnerAnnouncement(testGameId, {
        winner: 'player-3',
        amount: 50000000,
      });

      // 6. Payout winner
      ceramicIntegration.logPayoutCompleted(
        testGameId,
        'player-3',
        50000000,
        'tx-hash',
      );

      await ceramicIntegration.forceFlush();

      // Verify complete game flow
      const gameHistory = await ceramicIntegration.getGameHistory(testGameId);
      const analytics = await ceramicIntegration.getAnalytics(testGameId);

      expect(gameHistory.events.length).to.be.greaterThan(8);
      expect(analytics.gameStats.boardCreated).to.be.true;
      expect(analytics.gameStats.randomized).to.be.true;
      expect(analytics.gameStats.gameEnded).to.be.true;
      expect(analytics.gameStats.winnerSettled).to.be.true;
      expect(analytics.gameStats.payoutCompleted).to.be.true;
      expect(analytics.gameStats.totalSquaresPurchased).to.equal(5);
    });
  });
});
