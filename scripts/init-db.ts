import pool from '../lib/db';

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create a table for conversations
    await client.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        sender VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create a table for game state
    await client.query(`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        game_id INT NOT NULL,
        board_pda VARCHAR(255) NOT NULL,
        game_state VARCHAR(50) NOT NULL,
        home_score INT NOT NULL,
        away_score INT NOT NULL,
        quarter INT NOT NULL,
        total_pot BIGINT NOT NULL,
        players_count INT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create a table for tasks
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(255) PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        agent VARCHAR(255) NOT NULL,
        action VARCHAR(255) NOT NULL,
        args JSONB,
        status VARCHAR(50) NOT NULL,
        priority INT NOT NULL,
        dependencies TEXT[],
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMPTZ,
        result JSONB,
        error TEXT
      );
    `);

    await client.query('COMMIT');
    console.log('Database initialized successfully.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', e);
  } finally {
    client.release();
    pool.end();
  }
}

initDb();
