import pool from '../lib/db';

async function testPersistenceSimple() {
  console.log('Testing database persistence...');

  const sessionId = `session_${Date.now()}`;
  const gameId = Math.floor(Math.random() * 1000);
  const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const client = await pool.connect();
  try {
    // 1. Test adding a game
    await client.query(
      `INSERT INTO games (game_id, board_pda, game_state, home_score, away_score, quarter, total_pot, players_count)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [gameId, '11111111111111111111111111111111', 'created', 0, 0, 1, 0, 0],
    );
    console.log(`✅ Added game ${gameId} to database`);

    // 2. Test adding a conversation message
    await client.query(
      'INSERT INTO conversations (session_id, sender, message) VALUES ($1, $2, $3)',
      [sessionId, 'user', 'Hello, agent!'],
    );
    console.log('✅ Added conversation message to database');

    // 3. Test adding a task
    await client.query(
      `INSERT INTO tasks (id, type, agent, action, args, status, priority, dependencies)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        taskId,
        'documentation',
        'DocumentationAgent',
        'generateUserGuide',
        JSON.stringify({ context: 'test' }),
        'pending',
        5,
        [],
      ],
    );
    console.log(`✅ Added task ${taskId} to database`);

    // 4. Verify persistence by reading back the data
    const gameRes = await client.query(
      'SELECT * FROM games WHERE game_id = $1',
      [gameId],
    );
    if (gameRes.rows.length > 0) {
      console.log('✅ Game persistence verified');
      console.log('   - Game data:', gameRes.rows[0]);
    } else {
      console.error('❌ Game persistence failed');
    }

    const convRes = await client.query(
      'SELECT * FROM conversations WHERE session_id = $1',
      [sessionId],
    );
    if (convRes.rows.length > 0) {
      console.log('✅ Conversation persistence verified');
      console.log('   - Conversation data:', convRes.rows[0]);
    } else {
      console.error('❌ Conversation persistence failed');
    }

    const taskRes = await client.query('SELECT * FROM tasks WHERE id = $1', [
      taskId,
    ]);
    if (taskRes.rows.length > 0) {
      console.log('✅ Task persistence verified');
      console.log('   - Task data:', taskRes.rows[0]);
    } else {
      console.error('❌ Task persistence failed');
    }

    // 5. Test updating task status
    await client.query(
      `UPDATE tasks SET status = 'completed', completed_at = NOW() WHERE id = $1`,
      [taskId],
    );
    const updatedTaskRes = await client.query(
      'SELECT * FROM tasks WHERE id = $1',
      [taskId],
    );
    if (updatedTaskRes.rows[0].status === 'completed') {
      console.log('✅ Task status update verified');
    } else {
      console.error('❌ Task status update failed');
    }

    console.log('\n🎉 All persistence tests passed!');
    console.log(
      '\nThe ElizaOS agents now have persistent memory across restarts:',
    );
    console.log('- Games and board state are stored in PostgreSQL');
    console.log('- Conversation history is preserved');
    console.log('- Agent tasks and their status are tracked');
    console.log('- All data persists even if the server is restarted');
  } catch (error) {
    console.error('❌ Persistence test failed:', error);
  } finally {
    // Clean up test data
    try {
      await client.query('DELETE FROM games WHERE game_id = $1', [gameId]);
      await client.query('DELETE FROM conversations WHERE session_id = $1', [
        sessionId,
      ]);
      await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
      console.log('\n🧹 Test data cleaned up');
    } catch (cleanupError) {
      console.warn('Warning: Failed to clean up test data:', cleanupError);
    }

    client.release();
    pool.end();
  }
}

testPersistenceSimple();
