-- Football Squares Platform - Initial Schema Setup
-- Run this in Supabase SQL Editor

-- ============================================
-- STEP 1: Create Custom Schema
-- ============================================
CREATE SCHEMA IF NOT EXISTS fsq_private;
COMMENT ON SCHEMA fsq_private IS 'Private schema for Football Squares sensitive data';

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA fsq_private TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA fsq_private TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA fsq_private TO authenticated;

-- ============================================
-- STEP 2: Create Core Tables
-- ============================================

-- Users table (linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS fsq_private.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  wallet_address TEXT UNIQUE,
  discord_id TEXT UNIQUE,
  twitter_handle TEXT,
  display_name TEXT,
  total_wins INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agents table (for our ElizaOS agents)
CREATE TABLE IF NOT EXISTS fsq_private.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  wallet_address TEXT,
  permissions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game boards table
CREATE TABLE IF NOT EXISTS fsq_private.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id TEXT NOT NULL,
  sport TEXT DEFAULT 'NFL',
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  game_date TIMESTAMPTZ NOT NULL,
  board_type TEXT DEFAULT 'standard', -- standard, high_roller, charity
  square_price DECIMAL(10,2) NOT NULL,
  total_pot DECIMAL(10,2) DEFAULT 0,
  payout_structure JSONB DEFAULT '{"Q1": 0.2, "Q2": 0.3, "Q3": 0.2, "Q4": 0.3}',
  status TEXT DEFAULT 'draft', -- draft, open, locked, in_progress, completed, cancelled
  created_by UUID REFERENCES fsq_private.agents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Squares table (100 squares per board)
CREATE TABLE IF NOT EXISTS fsq_private.squares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES fsq_private.boards(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 0 AND position < 100),
  row_number INTEGER, -- 0-9, assigned after randomization
  col_number INTEGER, -- 0-9, assigned after randomization
  owner_id UUID REFERENCES fsq_private.users(id),
  purchase_tx_hash TEXT,
  purchased_at TIMESTAMPTZ,
  is_winner BOOLEAN DEFAULT FALSE,
  winning_quarter TEXT, -- Q1, Q2, Q3, Q4, OT
  UNIQUE(board_id, position)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS fsq_private.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- purchase, payout, refund
  board_id UUID REFERENCES fsq_private.boards(id),
  user_id UUID REFERENCES fsq_private.users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'SOL',
  from_address TEXT,
  to_address TEXT,
  tx_hash TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, confirmed, failed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);

-- Game results table
CREATE TABLE IF NOT EXISTS fsq_private.game_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES fsq_private.boards(id) ON DELETE CASCADE,
  quarter TEXT NOT NULL, -- Q1, Q2, Q3, Q4, OT, Final
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  home_last_digit INTEGER GENERATED ALWAYS AS (home_score % 10) STORED,
  away_last_digit INTEGER GENERATED ALWAYS AS (away_score % 10) STORED,
  winning_square_position INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  recorded_by UUID REFERENCES fsq_private.agents(id)
);

-- Audit log table (for Dean's security monitoring)
CREATE TABLE IF NOT EXISTS fsq_private.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  user_id UUID,
  agent_id UUID,
  changes JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: Create Indexes for Performance
-- ============================================

-- User indexes
CREATE INDEX idx_users_wallet ON fsq_private.users(wallet_address);
CREATE INDEX idx_users_discord ON fsq_private.users(discord_id);
CREATE INDEX idx_users_created ON fsq_private.users(created_at DESC);

-- Board indexes
CREATE INDEX idx_boards_game_id ON fsq_private.boards(game_id);
CREATE INDEX idx_boards_status ON fsq_private.boards(status);
CREATE INDEX idx_boards_game_date ON fsq_private.boards(game_date);
CREATE INDEX idx_boards_created_by ON fsq_private.boards(created_by);

-- Square indexes
CREATE INDEX idx_squares_board ON fsq_private.squares(board_id);
CREATE INDEX idx_squares_owner ON fsq_private.squares(owner_id);
CREATE INDEX idx_squares_winner ON fsq_private.squares(is_winner) WHERE is_winner = TRUE;

-- Transaction indexes
CREATE INDEX idx_transactions_user ON fsq_private.transactions(user_id);
CREATE INDEX idx_transactions_board ON fsq_private.transactions(board_id);
CREATE INDEX idx_transactions_status ON fsq_private.transactions(status);
CREATE INDEX idx_transactions_created ON fsq_private.transactions(created_at DESC);

-- Audit log indexes
CREATE INDEX idx_audit_user ON fsq_private.audit_log(user_id);
CREATE INDEX idx_audit_agent ON fsq_private.audit_log(agent_id);
CREATE INDEX idx_audit_created ON fsq_private.audit_log(created_at DESC);

-- ============================================
-- STEP 4: Enable Row Level Security
-- ============================================

ALTER TABLE fsq_private.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.squares ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE fsq_private.audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: Create Updated_at Trigger
-- ============================================

CREATE OR REPLACE FUNCTION fsq_private.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON fsq_private.users
  FOR EACH ROW EXECUTE FUNCTION fsq_private.update_updated_at_column();

-- ============================================
-- STEP 6: Insert Default Agents
-- ============================================

INSERT INTO fsq_private.agents (name, role, wallet_address, permissions) VALUES
  ('Coach B', 'operations', '7hRMzsqfmTCxzZgU6PwChBN4JLua1uTNRzPomNXJ7Q9W', '{"create_boards": true, "manage_games": true}'),
  ('Dean', 'security', NULL, '{"view_all": true, "audit": true, "ban_users": true}'),
  ('Jerry', 'general_manager', '7hRMzsqfmTCxzZgU6PwChBN4JLua1uTNRzPomNXJ7Q9W', '{"override_all": true, "approve_payouts": true}'),
  ('Trainer Reviva', 'support', NULL, '{"view_users": true, "help_users": true}'),
  ('Morgan Reese', 'business', NULL, '{"view_analytics": true, "partnerships": true}'),
  ('Jordan Banks', 'finance', NULL, '{"view_transactions": true, "process_payouts": true}'),
  ('Coach Right', 'community', NULL, '{"moderate": true, "announcements": true}'),
  ('OC Phil', 'training', NULL, '{"create_tutorials": true, "cbl_support": true}'),
  ('Patel Neil', 'marketing', NULL, '{"campaigns": true, "analytics": true}')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- DONE! Next run 002_security_policies.sql
-- ============================================