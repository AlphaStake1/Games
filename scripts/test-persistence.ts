import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import OrchestratorAgent from '../agents/OrchestratorAgent';
import pool from '../lib/db';

async function testPersistence() {
  // Mock Solana connection and program
  const connection = new Connection('https://api.devnet.solana.com');
  const provider = new AnchorProvider(
    connection,
    { keypair: Keypair.generate() } as any,
    {},
  );
  const program = {
    programId: new PublicKey('11111111111111111111111111111111'),
  } as Program;

  const orchestrator = new OrchestratorAgent(connection, provider, program);

  const sessionId = `session_${Date.now()}`;
  const gameId = Math.floor(Math.random() * 1000);

  console.log('Testing persistence...');

  // 1. Add a game
  await orchestrator.addGame(gameId);
  console.log(`Added game ${gameId}`);

  // 2. Add a conversation message
  await orchestrator.addConversationMessage(sessionId, 'user', 'Hello, agent!');
  console.log('Added conversation message');

  // 3. Delegate a task
  const taskId = await orchestrator.delegateToSubagent({
    type: 'documentation',
    agent: 'DocumentationAgent',
    action: 'generateUserGuide',
    args: { context: 'test' },
    priority: 5,
    dependencies: [],
  });
  console.log(`Delegated task ${taskId}`);

  // 4. Verify persistence
  const client = await pool.connect();
  try {
    // Verify game
    const gameRes = await client.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameId],
    );
    if (gameRes.rows.length > 0) {
      console.log('✅ Game persistence verified');
    } else {
      console.error('❌ Game persistence failed');
    }

    // Verify conversation
    const convRes = await client.query(
      'SELECT * FROM conversations WHERE session_id = $1',
      [sessionId],
    );
    if (convRes.rows.length > 0) {
      console.log('✅ Conversation persistence verified');
    } else {
      console.error('❌ Conversation persistence failed');
    }

    // Verify task
    const taskRes = await client.query('SELECT * FROM tasks WHERE id = $1', [
      taskId,
    ]);
    if (taskRes.rows.length > 0) {
      console.log('✅ Task persistence verified');
    } else {
      console.error('❌ Task persistence failed');
    }
  } finally {
    // Clean up
    await client.query('DELETE FROM games WHERE game_id = $1', [gameId]);
    await client.query('DELETE FROM conversations WHERE session_id = $1', [
      sessionId,
    ]);
    await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    client.release();
    pool.end();
  }
}

testPersistence();
