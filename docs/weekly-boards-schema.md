# Weekly Football Squares - Database Schema Specification

> **Status:** TECHNICAL SPECIFICATION  
> **Version:** 1.0  
> **Last Updated:** 2025-07-26  
> **Related Docs:** [weekly-boards.md](./weekly-boards.md), [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 1. Overview

This document provides comprehensive database schema specifications for the Weekly Football Squares system, including detailed table structures, indexes, constraints, API endpoints, and implementation guidance for developers building the backend infrastructure.

The schema supports the v0.4 specification requirements:

- **7-tier pricing system** ($5 → $500)
- **95% threshold logic** for auto-fill vs cancellation
- **VRF timing** (40 minutes before kickoff)
- **Rake structure** (5% for <$100 House boards, 8% for $100+ House boards; 5% for <$50 CBL boards, 8% for $50+ CBL mixed boards, 10% for $50+ CBL VIP-only boards)
- **Weekly reset cycle** (every Tuesday)

---

## 2. Database Schema

### 2.1 Core Tables

#### `weekly_games`

Stores NFL game schedule information for weekly board creation.

```sql
CREATE TABLE weekly_games (
  game_id VARCHAR(32) PRIMARY KEY,          -- NFL API game identifier
  week_number INTEGER NOT NULL,             -- NFL week number (1-18 + playoffs)
  season_year INTEGER NOT NULL,             -- NFL season year
  home_team VARCHAR(3) NOT NULL,            -- 3-letter team code (e.g., 'DAL')
  away_team VARCHAR(3) NOT NULL,            -- 3-letter team code (e.g., 'NYG')
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,
  game_status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, live, completed, cancelled
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  current_quarter INTEGER DEFAULT 0,        -- 0=pre-game, 1-4=quarters, 5=OT
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_teams CHECK (home_team != away_team),
  CONSTRAINT valid_quarter CHECK (current_quarter >= 0 AND current_quarter <= 5),
  CONSTRAINT valid_week CHECK (week_number >= 1 AND week_number <= 22)
);

-- Indexes
CREATE INDEX idx_weekly_games_week_season ON weekly_games (week_number, season_year);
CREATE INDEX idx_weekly_games_kickoff ON weekly_games (kickoff_time);
CREATE INDEX idx_weekly_games_status ON weekly_games (game_status);
CREATE UNIQUE INDEX idx_weekly_games_teams_time ON weekly_games (home_team, away_team, kickoff_time);
```

#### `weekly_tiers`

Configuration table for the 7-tier pricing system.

```sql
CREATE TABLE weekly_tiers (
  tier_id VARCHAR(10) PRIMARY KEY,          -- 'tier_1' through 'tier_7'
  tier_number INTEGER UNIQUE NOT NULL,      -- 1-7
  entry_price_cents INTEGER NOT NULL,       -- Price in cents (500, 1000, 2000, 5000, 10000, 25000, 50000)
  total_pool_cents INTEGER NOT NULL,        -- Total pool when full (50000, 100000, 200000, 500000, 1000000, 2500000, 5000000)
  house_rake_percentage DECIMAL(5,2) NOT NULL, -- 5.00 or 8.00
  player_pool_cents INTEGER NOT NULL,       -- After rake deduction
  vip_required BOOLEAN DEFAULT FALSE,       -- TRUE for tiers 5-7
  max_squares_standard INTEGER DEFAULT 5,   -- Max squares for standard users
  max_squares_vip INTEGER DEFAULT 10,       -- Max squares for VIP users
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_tier_number CHECK (tier_number >= 1 AND tier_number <= 7),
  CONSTRAINT valid_rake_percentage CHECK (house_rake_percentage IN (5.00, 8.00)),
  CONSTRAINT valid_entry_price CHECK (entry_price_cents > 0),
  CONSTRAINT pool_calculation CHECK (player_pool_cents = total_pool_cents - (total_pool_cents * house_rake_percentage / 100))
);

-- Insert default tier configuration
INSERT INTO weekly_tiers VALUES
('tier_1', 1, 500, 50000, 5.00, 47500, FALSE, 5, 10, TRUE, NOW()),
('tier_2', 2, 1000, 100000, 5.00, 95000, FALSE, 5, 10, TRUE, NOW()),
('tier_3', 3, 2000, 200000, 5.00, 190000, FALSE, 5, 10, TRUE, NOW()),
('tier_4', 4, 5000, 500000, 5.00, 475000, FALSE, 5, 10, TRUE, NOW()),
('tier_5', 5, 10000, 1000000, 8.00, 920000, TRUE, 5, 10, TRUE, NOW()),
('tier_6', 6, 25000, 2500000, 8.00, 2300000, TRUE, 5, 10, TRUE, NOW()),
('tier_7', 7, 50000, 5000000, 8.00, 4600000, TRUE, 5, 10, TRUE, NOW());
-- Note: CBL rake percentages (5%, 8%, 10%) are handled at the application layer, not in this table.
-- This table defines the base House rake.
```

#### `weekly_boards`

Core table storing board instances for each game/tier combination.

```sql
CREATE TABLE weekly_boards (
  board_id VARCHAR(64) PRIMARY KEY,         -- Format: {game_id}_{tier_id}_{timestamp}
  game_id VARCHAR(32) NOT NULL REFERENCES weekly_games(game_id) ON DELETE CASCADE,
  tier_id VARCHAR(10) NOT NULL REFERENCES weekly_tiers(tier_id),
  week_number INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'open',        -- open, locked, filled, randomized, live, completed, cancelled
  squares_sold INTEGER DEFAULT 0,
  squares_auto_filled INTEGER DEFAULT 0,
  fill_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE WHEN squares_sold + squares_auto_filled = 0 THEN 0
         ELSE (squares_sold * 100.0) / 100.0
    END
  ) STORED,

  -- VRF and randomization
  vrf_request_id VARCHAR(128),              -- Chainlink VRF request ID
  vrf_seed VARCHAR(128),                    -- VRF seed value
  vrf_tx_hash VARCHAR(128),                 -- Blockchain transaction hash
  home_digits INTEGER[10],                  -- Array of 10 digits [0-9] for home team
  away_digits INTEGER[10],                  -- Array of 10 digits [0-9] for away team
  randomized_at TIMESTAMP WITH TIME ZONE,

  -- Timing
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL, -- kickoff - 60 minutes
  auto_fill_deadline TIMESTAMP WITH TIME ZONE NOT NULL,    -- kickoff - 45 minutes
  vrf_trigger_time TIMESTAMP WITH TIME ZONE NOT NULL,      -- kickoff - 40 minutes
  kickoff_time TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Payout variant configuration
  payout_variant VARCHAR(20) DEFAULT 'forward',            -- forward, forward_backward, forward_plus_5
  payout_splits JSONB DEFAULT '{
    "q1": {"forward": 15, "alt": 0},
    "q2": {"forward": 25, "alt": 0},
    "q3": {"forward": 15, "alt": 0},
    "q4": {"forward": 45, "alt": 0}
  }',

  CONSTRAINT valid_status CHECK (status IN ('open', 'locked', 'filled', 'randomized', 'live', 'completed', 'cancelled')),
  CONSTRAINT valid_squares_sold CHECK (squares_sold >= 0 AND squares_sold <= 100),
  CONSTRAINT valid_auto_filled CHECK (squares_auto_filled >= 0 AND squares_auto_filled <= 5),
  CONSTRAINT valid_total_squares CHECK (squares_sold + squares_auto_filled <= 100),
  CONSTRAINT valid_payout_variant CHECK (payout_variant IN ('forward', 'forward_backward', 'forward_plus_5')),
  CONSTRAINT timing_sequence CHECK (
    registration_deadline < auto_fill_deadline AND
    auto_fill_deadline < vrf_trigger_time AND
    vrf_trigger_time < kickoff_time
  ),
  UNIQUE(game_id, tier_id)
);

-- Indexes
CREATE INDEX idx_weekly_boards_status ON weekly_boards (status);
CREATE INDEX idx_weekly_boards_week ON weekly_boards (week_number);
CREATE INDEX idx_weekly_boards_timing ON weekly_boards (registration_deadline, auto_fill_deadline, vrf_trigger_time);
CREATE INDEX idx_weekly_boards_fill_rate ON weekly_boards (fill_percentage) WHERE status IN ('open', 'locked');
CREATE INDEX idx_weekly_boards_vrf ON weekly_boards (vrf_request_id) WHERE vrf_request_id IS NOT NULL;
```

#### `weekly_squares`

Individual square ownership and purchase tracking.

```sql
CREATE TABLE weekly_squares (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id) ON DELETE CASCADE,
  square_index INTEGER NOT NULL,            -- 0-99 (row * 10 + col)
  home_index INTEGER GENERATED ALWAYS AS (square_index / 10) STORED,     -- 0-9
  away_index INTEGER GENERATED ALWAYS AS (square_index % 10) STORED,     -- 0-9

  -- Ownership
  owner_wallet VARCHAR(44) NOT NULL,        -- Solana wallet address (base58)
  owner_user_id VARCHAR(64),                -- Optional user ID reference
  is_vip_user BOOLEAN DEFAULT FALSE,

  -- Purchase details
  purchase_tx VARCHAR(128) NOT NULL,        -- Blockchain transaction hash
  purchase_signature VARCHAR(128),          -- Transaction signature
  purchase_block_height BIGINT,
  auto_filled BOOLEAN DEFAULT FALSE,        -- TRUE if filled by house
  reserved_at TIMESTAMP WITH TIME ZONE,     -- When square was reserved
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_square_index CHECK (square_index >= 0 AND square_index <= 99),
  CONSTRAINT valid_wallet_address CHECK (LENGTH(owner_wallet) BETWEEN 32 AND 44),
  UNIQUE(board_id, square_index)
);

-- Indexes
CREATE INDEX idx_weekly_squares_board ON weekly_squares (board_id);
CREATE INDEX idx_weekly_squares_owner ON weekly_squares (owner_wallet);
CREATE INDEX idx_weekly_squares_purchase_tx ON weekly_squares (purchase_tx);
CREATE INDEX idx_weekly_squares_auto_filled ON weekly_squares (auto_filled) WHERE auto_filled = TRUE;
CREATE INDEX idx_weekly_squares_user ON weekly_squares (owner_user_id) WHERE owner_user_id IS NOT NULL;
```

#### `weekly_reservations`

Temporary square reservations before purchase confirmation.

```sql
CREATE TABLE weekly_reservations (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id) ON DELETE CASCADE,
  square_indices INTEGER[] NOT NULL,        -- Array of reserved square indices
  user_wallet VARCHAR(44) NOT NULL,
  user_id VARCHAR(64),
  reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
  status VARCHAR(20) DEFAULT 'active',      -- active, expired, confirmed, cancelled
  session_id VARCHAR(128),                  -- Frontend session tracking

  CONSTRAINT valid_reservation_status CHECK (status IN ('active', 'expired', 'confirmed', 'cancelled')),
  CONSTRAINT valid_expiry CHECK (expires_at > reserved_at),
  CONSTRAINT valid_square_indices CHECK (array_length(square_indices, 1) <= 10) -- Max 10 squares for VIP
);

-- Indexes
CREATE INDEX idx_weekly_reservations_board ON weekly_reservations (board_id);
CREATE INDEX idx_weekly_reservations_wallet ON weekly_reservations (user_wallet);
CREATE INDEX idx_weekly_reservations_expires ON weekly_reservations (expires_at) WHERE status = 'active';
CREATE INDEX idx_weekly_reservations_session ON weekly_reservations (session_id) WHERE session_id IS NOT NULL;
```

#### `weekly_payouts`

Winner tracking and payout processing.

```sql
CREATE TABLE weekly_payouts (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id) ON DELETE CASCADE,
  square_index INTEGER NOT NULL,
  home_digit INTEGER NOT NULL,              -- Winning home team last digit
  away_digit INTEGER NOT NULL,              -- Winning away team last digit
  quarter VARCHAR(10) NOT NULL,             -- 'q1', 'q2', 'q3', 'q4', 'ot'
  payout_type VARCHAR(20) NOT NULL,         -- 'forward', 'backward', 'plus_5'

  -- Score context
  home_score INTEGER NOT NULL,
  away_score INTEGER NOT NULL,
  score_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Payout details
  base_amount_cents INTEGER NOT NULL,       -- Base payout before VIP bonus
  vip_bonus_cents INTEGER DEFAULT 0,        -- 5% VIP bonus if applicable
  total_amount_cents INTEGER NOT NULL,      -- Total payout amount
  winner_wallet VARCHAR(44) NOT NULL,

  -- Processing
  payout_tx VARCHAR(128),                   -- Blockchain payout transaction
  payout_signature VARCHAR(128),            -- Transaction signature
  processed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',     -- pending, processing, completed, failed
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,

  CONSTRAINT valid_quarter CHECK (quarter IN ('q1', 'q2', 'q3', 'q4', 'ot')),
  CONSTRAINT valid_payout_type CHECK (payout_type IN ('forward', 'backward', 'plus_5')),
  CONSTRAINT valid_digits CHECK (home_digit >= 0 AND home_digit <= 9 AND away_digit >= 0 AND away_digit <= 9),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  CONSTRAINT valid_amounts CHECK (base_amount_cents > 0 AND total_amount_cents >= base_amount_cents),
  FOREIGN KEY (board_id, square_index) REFERENCES weekly_squares(board_id, square_index)
);

-- Indexes
CREATE INDEX idx_weekly_payouts_board ON weekly_payouts (board_id);
CREATE INDEX idx_weekly_payouts_quarter ON weekly_payouts (quarter);
CREATE INDEX idx_weekly_payouts_status ON weekly_payouts (status);
CREATE INDEX idx_weekly_payouts_winner ON weekly_payouts (winner_wallet);
CREATE INDEX idx_weekly_payouts_tx ON weekly_payouts (payout_tx) WHERE payout_tx IS NOT NULL;
CREATE INDEX idx_weekly_payouts_retry ON weekly_payouts (retry_count) WHERE status = 'failed';
```

### 2.2 Supporting Tables

#### `weekly_board_analytics`

Performance metrics and analytics data.

```sql
CREATE TABLE weekly_board_analytics (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id) ON DELETE CASCADE,
  metric_name VARCHAR(50) NOT NULL,
  metric_value DECIMAL(15,2) NOT NULL,
  metric_metadata JSONB DEFAULT '{}',
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_metric_name CHECK (metric_name ~ '^[a-z_]+$')
);

CREATE INDEX idx_weekly_analytics_board_metric ON weekly_board_analytics (board_id, metric_name);
CREATE INDEX idx_weekly_analytics_recorded ON weekly_board_analytics (recorded_at);
```

#### `weekly_user_limits`

User purchase limits and VIP status tracking.

```sql
CREATE TABLE weekly_user_limits (
  id BIGSERIAL PRIMARY KEY,
  user_wallet VARCHAR(44) NOT NULL,
  user_id VARCHAR(64),
  week_number INTEGER NOT NULL,
  season_year INTEGER NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  max_squares_per_board INTEGER DEFAULT 5,
  total_squares_purchased INTEGER DEFAULT 0,
  total_spend_cents INTEGER DEFAULT 0,
  last_purchase_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_wallet, week_number, season_year)
);

CREATE INDEX idx_weekly_user_limits_wallet_week ON weekly_user_limits (user_wallet, week_number, season_year);
CREATE INDEX idx_weekly_user_limits_vip ON weekly_user_limits (is_vip) WHERE is_vip = TRUE;
```

#### `weekly_refunds`

Tracking refunds for cancelled boards.

```sql
CREATE TABLE weekly_refunds (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id) ON DELETE CASCADE,
  original_square_id BIGINT NOT NULL,       -- Reference to cancelled square
  refund_wallet VARCHAR(44) NOT NULL,
  refund_amount_cents INTEGER NOT NULL,
  refund_tx VARCHAR(128),
  refund_signature VARCHAR(128),
  processed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',     -- pending, processing, completed, failed
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weekly_refunds_board ON weekly_refunds (board_id);
CREATE INDEX idx_weekly_refunds_wallet ON weekly_refunds (refund_wallet);
CREATE INDEX idx_weekly_refunds_status ON weekly_refunds (status);
```

---

## 3. Database Constraints and Business Rules

### 3.1 Critical Constraints

```sql
-- Ensure board fill percentage triggers correct state transitions
CREATE OR REPLACE FUNCTION check_board_fill_threshold()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-fill logic: if >= 95% sold at deadline, fill remaining squares
  IF NEW.fill_percentage >= 95.0 AND NEW.status = 'locked' AND NOW() >= NEW.auto_fill_deadline THEN
    NEW.status := 'filled';
    NEW.squares_auto_filled := 100 - NEW.squares_sold;
  -- Cancellation logic: if < 95% sold at deadline, cancel board
  ELSIF NEW.fill_percentage < 95.0 AND NEW.status = 'locked' AND NOW() >= NEW.auto_fill_deadline THEN
    NEW.status := 'cancelled';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_board_fill_check
  BEFORE UPDATE ON weekly_boards
  FOR EACH ROW
  EXECUTE FUNCTION check_board_fill_threshold();

-- Prevent VIP tier access for non-VIP users
CREATE OR REPLACE FUNCTION check_vip_tier_access()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM weekly_tiers
    WHERE tier_id = (SELECT tier_id FROM weekly_boards WHERE board_id = NEW.board_id)
    AND vip_required = TRUE
  ) AND NEW.is_vip_user = FALSE THEN
    RAISE EXCEPTION 'VIP status required for this tier';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_vip_access_check
  BEFORE INSERT ON weekly_squares
  FOR EACH ROW
  EXECUTE FUNCTION check_vip_tier_access();

-- Enforce square purchase limits
CREATE OR REPLACE FUNCTION check_square_limits()
RETURNS TRIGGER AS $$
DECLARE
  user_square_count INTEGER;
  max_allowed INTEGER;
  is_vip BOOLEAN;
BEGIN
  -- Get user's VIP status and current square count for this board
  SELECT COUNT(*), COALESCE(MAX(is_vip_user), FALSE)
  INTO user_square_count, is_vip
  FROM weekly_squares
  WHERE board_id = NEW.board_id AND owner_wallet = NEW.owner_wallet;

  max_allowed := CASE WHEN is_vip THEN 10 ELSE 5 END;

  IF user_square_count >= max_allowed THEN
    RAISE EXCEPTION 'Square purchase limit exceeded. Max allowed: %', max_allowed;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_square_limits_check
  BEFORE INSERT ON weekly_squares
  FOR EACH ROW
  EXECUTE FUNCTION check_square_limits();
```

### 3.2 Data Integrity Functions

```sql
-- Automatic board creation for new games
CREATE OR REPLACE FUNCTION create_boards_for_game()
RETURNS TRIGGER AS $$
BEGIN
  -- Create one board per active tier for the new game
  INSERT INTO weekly_boards (
    board_id, game_id, tier_id, week_number,
    registration_deadline, auto_fill_deadline, vrf_trigger_time, kickoff_time
  )
  SELECT
    NEW.game_id || '_' || tier_id || '_' || EXTRACT(epoch FROM NOW()),
    NEW.game_id,
    tier_id,
    NEW.week_number,
    NEW.kickoff_time - INTERVAL '60 minutes',
    NEW.kickoff_time - INTERVAL '45 minutes',
    NEW.kickoff_time - INTERVAL '40 minutes',
    NEW.kickoff_time
  FROM weekly_tiers
  WHERE active = TRUE;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_boards
  AFTER INSERT ON weekly_games
  FOR EACH ROW
  EXECUTE FUNCTION create_boards_for_game();

-- Update board squares_sold counter
CREATE OR REPLACE FUNCTION update_board_squares_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE weekly_boards
    SET squares_sold = squares_sold + 1
    WHERE board_id = NEW.board_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE weekly_boards
    SET squares_sold = squares_sold - 1
    WHERE board_id = OLD.board_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_squares_count
  AFTER INSERT OR DELETE ON weekly_squares
  FOR EACH ROW
  EXECUTE FUNCTION update_board_squares_count();
```

---

## 4. API Endpoints Specification

### 4.1 Board Management Endpoints

#### `GET /api/weekly/games`

Get available games for the current week.

```typescript
interface GetGamesResponse {
  games: {
    gameId: string;
    week: number;
    homeTeam: string;
    awayTeam: string;
    kickoffTime: string;
    status: 'scheduled' | 'live' | 'completed';
    availableTiers: TierInfo[];
  }[];
}

interface TierInfo {
  tierId: string;
  tierNumber: number;
  entryPrice: number;
  totalPool: number;
  availableSquares: number;
  fillPercentage: number;
  vipRequired: boolean;
}
```

#### `GET /api/weekly/boards/{boardId}`

Get detailed board information.

```typescript
interface GetBoardResponse {
  board: {
    boardId: string;
    gameId: string;
    tier: TierInfo;
    status: BoardStatus;
    squaresSold: number;
    squaresAutoFilled: number;
    fillPercentage: number;
    homeDigits?: number[];
    awayDigits?: number[];
    randomizedAt?: string;
    timing: {
      registrationDeadline: string;
      autoFillDeadline: string;
      vrfTriggerTime: string;
      kickoffTime: string;
    };
    payoutVariant: 'forward' | 'forward_backward' | 'forward_plus_5';
    payoutSplits: {
      q1: { forward: number; alt: number };
      q2: { forward: number; alt: number };
      q3: { forward: number; alt: number };
      q4: { forward: number; alt: number };
    };
  };
  squares: SquareInfo[];
  game: GameInfo;
}

type BoardStatus =
  | 'open'
  | 'locked'
  | 'filled'
  | 'randomized'
  | 'live'
  | 'completed'
  | 'cancelled';

interface SquareInfo {
  index: number;
  homeIndex: number;
  awayIndex: number;
  owner?: string;
  purchasedAt?: string;
  autoFilled: boolean;
}
```

#### `POST /api/weekly/reservations`

Reserve squares before purchase.

```typescript
interface ReserveSquaresRequest {
  boardId: string;
  squareIndices: number[];
  userWallet: string;
  sessionId?: string;
}

interface ReserveSquaresResponse {
  reservationId: string;
  expiresAt: string;
  squareIndices: number[];
  totalCost: number;
  estimatedGas: number;
}
```

#### `POST /api/weekly/purchases/{reservationId}/confirm`

Confirm square purchase with transaction hash.

```typescript
interface ConfirmPurchaseRequest {
  transactionHash: string;
  signature: string;
}

interface ConfirmPurchaseResponse {
  success: boolean;
  squares: {
    index: number;
    purchasedAt: string;
  }[];
  boardStatus: BoardStatus;
}
```

### 4.2 Game and Scoring Endpoints

#### `POST /api/weekly/vrf/{boardId}/trigger`

Trigger VRF randomization (automated/admin only).

```typescript
interface TriggerVRFRequest {
  boardId: string;
  force?: boolean; // Override timing checks
}

interface TriggerVRFResponse {
  vrfRequestId: string;
  transactionHash: string;
  estimatedCompletionTime: string;
}
```

#### `POST /api/weekly/scores/{gameId}/update`

Update game scores (oracle/admin only).

```typescript
interface UpdateScoreRequest {
  homeScore: number;
  awayScore: number;
  quarter: number;
  timestamp: string;
  oracleSignature: string;
}

interface UpdateScoreResponse {
  success: boolean;
  winners: {
    boardId: string;
    quarter: string;
    squareIndex: number;
    winnerWallet: string;
    payoutAmount: number;
    homeDigit: number;
    awayDigit: number;
  }[];
}
```

### 4.3 User and Analytics Endpoints

#### `GET /api/weekly/users/{wallet}/history`

Get user's purchase and win history.

```typescript
interface GetUserHistoryResponse {
  user: {
    wallet: string;
    isVip: boolean;
    weeklyStats: {
      week: number;
      totalSquares: number;
      totalSpent: number;
      totalWon: number;
      netResult: number;
    }[];
  };
  purchases: {
    boardId: string;
    gameId: string;
    tier: number;
    squareIndex: number;
    purchasedAt: string;
    cost: number;
  }[];
  winnings: {
    boardId: string;
    quarter: string;
    squareIndex: number;
    amount: number;
    paidAt: string;
  }[];
}
```

#### `GET /api/weekly/analytics/boards`

Board performance analytics (admin only).

```typescript
interface GetBoardAnalyticsResponse {
  summary: {
    totalBoards: number;
    activeBoardsCount: number;
    averageFillRate: number;
    totalRevenue: number;
    cancellationRate: number;
  };
  tierPerformance: {
    tierId: string;
    averageFillTime: number;
    fillRate: number;
    totalRevenue: number;
    boardCount: number;
  }[];
  weeklyMetrics: {
    week: number;
    boardsCreated: number;
    boardsCompleted: number;
    boardsCancelled: number;
    totalRevenue: number;
  }[];
}
```

---

## 5. Migration Scripts

### 5.1 Initial Schema Creation

```sql
-- migration_001_initial_schema.sql
-- Run this script to create the initial database schema

BEGIN;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types
CREATE TYPE board_status AS ENUM ('open', 'locked', 'filled', 'randomized', 'live', 'completed', 'cancelled');
CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed');
CREATE TYPE reservation_status AS ENUM ('active', 'expired', 'confirmed', 'cancelled');

-- Create all tables (insert table creation scripts from section 2.1 here)
-- ... (table creation scripts from above)

-- Create all indexes
-- ... (index creation scripts from above)

-- Create all functions and triggers
-- ... (function and trigger scripts from section 3)

COMMIT;
```

### 5.2 VRF Integration Migration

```sql
-- migration_002_vrf_integration.sql
-- Add enhanced VRF tracking and verification

BEGIN;

-- Add VRF verification fields to weekly_boards
ALTER TABLE weekly_boards
ADD COLUMN vrf_proof JSONB,
ADD COLUMN vrf_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN vrf_verification_tx VARCHAR(128);

-- Create VRF requests tracking table
CREATE TABLE weekly_vrf_requests (
  id BIGSERIAL PRIMARY KEY,
  board_id VARCHAR(64) NOT NULL REFERENCES weekly_boards(board_id),
  request_id VARCHAR(128) NOT NULL,
  request_tx VARCHAR(128) NOT NULL,
  request_block_height BIGINT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fulfilled_at TIMESTAMP WITH TIME ZONE,
  fulfill_tx VARCHAR(128),
  random_words BIGINT[],
  status VARCHAR(20) DEFAULT 'pending',

  CONSTRAINT valid_vrf_status CHECK (status IN ('pending', 'fulfilled', 'failed', 'expired'))
);

CREATE INDEX idx_vrf_requests_board ON weekly_vrf_requests (board_id);
CREATE INDEX idx_vrf_requests_status ON weekly_vrf_requests (status);
CREATE UNIQUE INDEX idx_vrf_requests_id ON weekly_vrf_requests (request_id);

COMMIT;
```

### 5.3 Performance Optimization Migration

```sql
-- migration_003_performance_optimization.sql
-- Add performance improvements and additional indexes

BEGIN;

-- Add composite indexes for common query patterns
CREATE INDEX CONCURRENTLY idx_weekly_squares_board_owner
  ON weekly_squares (board_id, owner_wallet);

CREATE INDEX CONCURRENTLY idx_weekly_payouts_board_quarter_status
  ON weekly_payouts (board_id, quarter, status);

CREATE INDEX CONCURRENTLY idx_weekly_boards_week_status_tier
  ON weekly_boards (week_number, status, tier_id);

-- Add partial indexes for active data
CREATE INDEX CONCURRENTLY idx_weekly_reservations_active
  ON weekly_reservations (board_id, user_wallet)
  WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_weekly_payouts_pending
  ON weekly_payouts (board_id)
  WHERE status IN ('pending', 'processing');

-- Add materialized view for board summaries
CREATE MATERIALIZED VIEW weekly_board_summary AS
SELECT
  b.board_id,
  b.game_id,
  b.tier_id,
  b.week_number,
  b.status,
  b.squares_sold,
  b.squares_auto_filled,
  b.fill_percentage,
  t.entry_price_cents,
  t.total_pool_cents,
  t.house_rake_percentage,
  g.home_team,
  g.away_team,
  g.kickoff_time,
  COUNT(ws.id) as confirmed_squares,
  SUM(CASE WHEN ws.auto_filled THEN 0 ELSE t.entry_price_cents END) as revenue_cents
FROM weekly_boards b
JOIN weekly_tiers t ON b.tier_id = t.tier_id
JOIN weekly_games g ON b.game_id = g.game_id
LEFT JOIN weekly_squares ws ON b.board_id = ws.board_id
GROUP BY b.board_id, b.game_id, b.tier_id, b.week_number, b.status,
         b.squares_sold, b.squares_auto_filled, b.fill_percentage,
         t.entry_price_cents, t.total_pool_cents, t.house_rake_percentage,
         g.home_team, g.away_team, g.kickoff_time;

CREATE UNIQUE INDEX idx_weekly_board_summary_board_id
  ON weekly_board_summary (board_id);

-- Refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_weekly_board_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY weekly_board_summary;
END;
$$ LANGUAGE plpgsql;

COMMIT;
```

---

## 6. Sample Data and Testing

### 6.1 Sample Game Data

```sql
-- Insert sample games for testing
INSERT INTO weekly_games (game_id, week_number, season_year, home_team, away_team, kickoff_time, game_status) VALUES
('nfl_2025_w1_dal_nyg', 1, 2025, 'DAL', 'NYG', '2025-09-08 13:00:00-05:00', 'scheduled'),
('nfl_2025_w1_kc_buf', 1, 2025, 'KC', 'BUF', '2025-09-08 16:25:00-05:00', 'scheduled'),
('nfl_2025_w1_sf_pit', 1, 2025, 'SF', 'PIT', '2025-09-08 20:20:00-05:00', 'scheduled');

-- Sample square purchases
INSERT INTO weekly_squares (board_id, square_index, owner_wallet, purchase_tx, is_vip_user) VALUES
('nfl_2025_w1_dal_nyg_tier_1_1693843200', 0, 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0', 'tx_sample_1', FALSE),
('nfl_2025_w1_dal_nyg_tier_1_1693843200', 1, 'B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1', 'tx_sample_2', FALSE),
('nfl_2025_w1_dal_nyg_tier_1_1693843200', 50, 'C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0U1V2', 'tx_sample_3', TRUE);
```

### 6.2 Test Scenarios

```sql
-- Test function for 95% threshold logic
CREATE OR REPLACE FUNCTION test_board_threshold_logic(board_id VARCHAR)
RETURNS TABLE(
  test_name TEXT,
  expected_status VARCHAR,
  actual_status VARCHAR,
  passed BOOLEAN
) AS $$
DECLARE
  current_status VARCHAR;
  squares_count INTEGER;
BEGIN
  -- Get current board state
  SELECT status, squares_sold INTO current_status, squares_count
  FROM weekly_boards WHERE weekly_boards.board_id = test_board_threshold_logic.board_id;

  -- Test 1: Board with 95+ squares should be eligible for auto-fill
  IF squares_count >= 95 THEN
    RETURN QUERY SELECT
      'Auto-fill eligibility'::TEXT,
      'filled'::VARCHAR,
      current_status,
      (current_status = 'filled' OR current_status = 'locked');
  END IF;

  -- Test 2: Board with <95 squares past deadline should be cancelled
  IF squares_count < 95 AND NOW() > (
    SELECT auto_fill_deadline FROM weekly_boards
    WHERE weekly_boards.board_id = test_board_threshold_logic.board_id
  ) THEN
    RETURN QUERY SELECT
      'Cancellation logic'::TEXT,
      'cancelled'::VARCHAR,
      current_status,
      (current_status = 'cancelled');
  END IF;

END;
$$ LANGUAGE plpgsql;

-- Performance test queries
-- Test query performance for common operations
EXPLAIN (ANALYZE, BUFFERS)
SELECT b.*, t.entry_price_cents, COUNT(ws.id) as squares_count
FROM weekly_boards b
JOIN weekly_tiers t ON b.tier_id = t.tier_id
LEFT JOIN weekly_squares ws ON b.board_id = ws.board_id
WHERE b.week_number = 1 AND b.status = 'open'
GROUP BY b.board_id, t.entry_price_cents;
```

---

## 7. Performance Considerations

### 7.1 Query Optimization Strategies

#### Connection Pooling Configuration

```typescript
// database/pool.ts
import { Pool } from 'pg';

export const dbPool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

  // Performance settings
  max: 20, // Maximum connections
  min: 2, // Minimum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Wait 5s for connection

  // Weekly boards specific optimizations
  statement_timeout: '30s', // Prevent long-running queries
  query_timeout: 30000,
  idle_in_transaction_session_timeout: '60s',
});
```

#### Read Replica Configuration

```sql
-- Configure read replicas for analytics queries
-- Production setup should separate read/write operations

-- Read-heavy operations: board listings, user history, analytics
-- Write operations: square purchases, score updates, payouts

-- Connection string examples:
-- WRITE_DB_URL="postgresql://user:pass@primary-db:5432/weekly_squares"
-- READ_DB_URL="postgresql://user:pass@replica-db:5432/weekly_squares"
```

### 7.2 Caching Strategies

#### Redis Cache Configuration

```typescript
// cache/weekly-boards.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || '6379'),
  retryDelayOnFailover: 100,
});

// Cache keys for weekly boards
export const CacheKeys = {
  boardsList: (week: number) => `weekly:boards:w${week}`,
  boardDetail: (boardId: string) => `weekly:board:${boardId}`,
  userSquares: (wallet: string, week: number) =>
    `weekly:user:${wallet}:w${week}`,
  gameSchedule: (week: number) => `weekly:games:w${week}`,
  tierConfig: () => 'weekly:tiers:config',

  // TTL values (in seconds)
  TTL: {
    boardsList: 300, // 5 minutes
    boardDetail: 60, // 1 minute for active boards
    userSquares: 300, // 5 minutes
    gameSchedule: 3600, // 1 hour
    tierConfig: 86400, // 24 hours
  },
};

// Board caching functions
export async function getCachedBoard(boardId: string) {
  const cached = await redis.get(CacheKeys.boardDetail(boardId));
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedBoard(boardId: string, boardData: any) {
  await redis.setex(
    CacheKeys.boardDetail(boardId),
    CacheKeys.TTL.boardDetail,
    JSON.stringify(boardData),
  );
}

// Cache invalidation on updates
export async function invalidateBoardCache(boardId: string) {
  const board = await getCachedBoard(boardId);
  if (board) {
    await redis.del(CacheKeys.boardDetail(boardId));
    await redis.del(CacheKeys.boardsList(board.week_number));
  }
}
```

### 7.3 Database Partitioning

```sql
-- Partition weekly_squares by week for better performance
-- This becomes important as data volume grows

-- Create partitioned table
CREATE TABLE weekly_squares_partitioned (
  LIKE weekly_squares INCLUDING ALL
) PARTITION BY RANGE (board_id);

-- Create weekly partitions
CREATE TABLE weekly_squares_w1 PARTITION OF weekly_squares_partitioned
  FOR VALUES FROM ('nfl_2025_w1_') TO ('nfl_2025_w2_');

CREATE TABLE weekly_squares_w2 PARTITION OF weekly_squares_partitioned
  FOR VALUES FROM ('nfl_2025_w2_') TO ('nfl_2025_w3_');

-- Auto-create partitions function
CREATE OR REPLACE FUNCTION create_weekly_partition(week_num INTEGER, season_year INTEGER)
RETURNS void AS $$
DECLARE
  table_name TEXT;
  start_val TEXT;
  end_val TEXT;
BEGIN
  table_name := 'weekly_squares_' || season_year || '_w' || week_num;
  start_val := 'nfl_' || season_year || '_w' || week_num || '_';
  end_val := 'nfl_' || season_year || '_w' || (week_num + 1) || '_';

  EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF weekly_squares_partitioned
                  FOR VALUES FROM (%L) TO (%L)',
                 table_name, start_val, end_val);
END;
$$ LANGUAGE plpgsql;
```

---

## 8. Monitoring and Alerting

### 8.1 Key Performance Indicators

```sql
-- KPI monitoring queries
-- These should be exposed as metrics to Prometheus/Grafana

-- Board fill rate monitoring
CREATE VIEW weekly_board_kpis AS
SELECT
  week_number,
  tier_id,
  COUNT(*) as total_boards,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_boards,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_boards,
  AVG(fill_percentage) as avg_fill_rate,
  AVG(CASE WHEN status = 'completed' THEN fill_percentage END) as avg_completed_fill_rate,
  SUM(squares_sold * (SELECT entry_price_cents FROM weekly_tiers WHERE tier_id = weekly_boards.tier_id)) as total_revenue_cents
FROM weekly_boards
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY week_number, tier_id
ORDER BY week_number DESC, tier_id;

-- Real-time monitoring queries
-- Board status distribution
SELECT status, COUNT(*)
FROM weekly_boards
WHERE week_number = (SELECT MAX(week_number) FROM weekly_boards)
GROUP BY status;

-- VRF success rate
SELECT
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE status = 'fulfilled') as fulfilled,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  ROUND(COUNT(*) FILTER (WHERE status = 'fulfilled') * 100.0 / COUNT(*), 2) as success_rate
FROM weekly_vrf_requests
WHERE requested_at >= NOW() - INTERVAL '7 days';

-- Payout processing performance
SELECT
  quarter,
  COUNT(*) as total_payouts,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'failed') as failed,
  AVG(EXTRACT(EPOCH FROM (processed_at - created_at))) as avg_processing_time_seconds
FROM weekly_payouts
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY quarter;
```

### 8.2 Alert Thresholds

```typescript
// monitoring/alerts.ts
export const AlertThresholds = {
  // Board performance alerts
  boardFillRate: {
    critical: 0.85, // Alert if average fill rate drops below 85%
    warning: 0.9, // Warning if below 90%
  },

  // VRF performance alerts
  vrfSuccessRate: {
    critical: 0.95, // Alert if VRF success rate drops below 95%
    warning: 0.98, // Warning if below 98%
  },

  // Payout processing alerts
  payoutProcessingTime: {
    critical: 300, // Alert if average processing time > 5 minutes
    warning: 120, // Warning if > 2 minutes
  },

  // Database performance alerts
  connectionPool: {
    critical: 0.9, // Alert if pool utilization > 90%
    warning: 0.8, // Warning if > 80%
  },

  // Business metrics alerts
  cancellationRate: {
    critical: 0.2, // Alert if cancellation rate > 20%
    warning: 0.15, // Warning if > 15%
  },
};

// Monitoring functions
export async function checkBoardFillRates(): Promise<AlertStatus[]> {
  const query = `
    SELECT tier_id, AVG(fill_percentage) as avg_fill_rate
    FROM weekly_boards 
    WHERE status IN ('completed', 'cancelled') 
    AND created_at >= NOW() - INTERVAL '7 days'
    GROUP BY tier_id
  `;

  const results = await dbPool.query(query);
  const alerts: AlertStatus[] = [];

  for (const row of results.rows) {
    const fillRate = parseFloat(row.avg_fill_rate) / 100;

    if (fillRate < AlertThresholds.boardFillRate.critical) {
      alerts.push({
        type: 'critical',
        metric: 'board_fill_rate',
        value: fillRate,
        threshold: AlertThresholds.boardFillRate.critical,
        message: `Board fill rate critically low for ${row.tier_id}: ${(fillRate * 100).toFixed(1)}%`,
      });
    } else if (fillRate < AlertThresholds.boardFillRate.warning) {
      alerts.push({
        type: 'warning',
        metric: 'board_fill_rate',
        value: fillRate,
        threshold: AlertThresholds.boardFillRate.warning,
        message: `Board fill rate below warning threshold for ${row.tier_id}: ${(fillRate * 100).toFixed(1)}%`,
      });
    }
  }

  return alerts;
}

interface AlertStatus {
  type: 'critical' | 'warning';
  metric: string;
  value: number;
  threshold: number;
  message: string;
}
```

---

## 9. Security Considerations

### 9.1 Database Security

```sql
-- Role-based access control
-- Create specific roles for different components

-- Read-only role for analytics and reporting
CREATE ROLE weekly_boards_readonly;
GRANT CONNECT ON DATABASE weekly_squares TO weekly_boards_readonly;
GRANT USAGE ON SCHEMA public TO weekly_boards_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO weekly_boards_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO weekly_boards_readonly;

-- API application role with limited write access
CREATE ROLE weekly_boards_api;
GRANT CONNECT ON DATABASE weekly_squares TO weekly_boards_api;
GRANT USAGE ON SCHEMA public TO weekly_boards_api;
GRANT SELECT, INSERT, UPDATE ON weekly_squares, weekly_reservations TO weekly_boards_api;
GRANT SELECT ON weekly_boards, weekly_games, weekly_tiers TO weekly_boards_api;
GRANT UPDATE (squares_sold, status) ON weekly_boards TO weekly_boards_api;

-- Oracle role for score updates
CREATE ROLE weekly_boards_oracle;
GRANT CONNECT ON DATABASE weekly_squares TO weekly_boards_oracle;
GRANT USAGE ON SCHEMA public TO weekly_boards_oracle;
GRANT SELECT ON weekly_boards, weekly_games TO weekly_boards_oracle;
GRANT UPDATE (game_status, home_score, away_score, current_quarter) ON weekly_games TO weekly_boards_oracle;
GRANT INSERT ON weekly_payouts TO weekly_boards_oracle;

-- Admin role for full access
CREATE ROLE weekly_boards_admin;
GRANT ALL PRIVILEGES ON DATABASE weekly_squares TO weekly_boards_admin;
```

### 9.2 Input Validation

```typescript
// validation/schemas.ts
import { z } from 'zod';

export const WalletAddressSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{32,44}$/, 'Invalid Solana wallet address');

export const BoardIdSchema = z
  .string()
  .regex(/^nfl_\d{4}_w\d+_[a-z]+_tier_\d+_\d+$/, 'Invalid board ID format');

export const SquareIndexSchema = z.number().int().min(0).max(99);

export const ReserveSquaresSchema = z.object({
  boardId: BoardIdSchema,
  squareIndices: z
    .array(SquareIndexSchema)
    .min(1, 'Must reserve at least one square')
    .max(10, 'Cannot reserve more than 10 squares')
    .refine(
      (arr) => new Set(arr).size === arr.length,
      'Duplicate square indices',
    ),
  userWallet: WalletAddressSchema,
  sessionId: z.string().optional(),
});

export const TransactionHashSchema = z
  .string()
  .regex(/^[1-9A-HJ-NP-Za-km-z]{64,88}$/, 'Invalid transaction hash');

// Input sanitization for database queries
export function sanitizeWalletAddress(address: string): string {
  return address.replace(/[^1-9A-HJ-NP-Za-km-z]/g, '');
}

export function sanitizeBoardId(boardId: string): string {
  return boardId.replace(/[^a-zA-Z0-9_]/g, '');
}
```

### 9.3 Rate Limiting

```typescript
// middleware/rateLimiting.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// General API rate limiting
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:',
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiting for purchase-related endpoints
export const purchaseLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:purchase:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many purchase attempts',
  keyGenerator: (req) => {
    // Rate limit by wallet address for authenticated requests
    return req.body?.userWallet || req.ip;
  },
});

// Reservation rate limiting (prevent square hoarding)
export const reservationLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:reservation:',
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 reservations per 5 minutes
  keyGenerator: (req) => req.body?.userWallet || req.ip,
});
```

---

## 10. Deployment and Operations

### 10.1 Environment Configuration

```bash
# .env.production
# Database Configuration
DB_HOST=weekly-squares-primary.cluster-xxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=weekly_squares
DB_USER=weekly_api
DB_PASSWORD=${DB_PASSWORD_SECRET}
DB_SSL=true
DB_POOL_SIZE=20

# Read Replica Configuration
DB_READ_HOST=weekly-squares-replica.cluster-xxx.us-east-1.rds.amazonaws.com
DB_READ_USER=weekly_readonly

# Redis Configuration
REDIS_URL=redis://weekly-squares-cache.xxx.cache.amazonaws.com:6379
REDIS_PASSWORD=${REDIS_PASSWORD_SECRET}

# Blockchain Configuration
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
VRF_PROGRAM_ID=your_vrf_program_id
ORACLE_PRIVATE_KEY=${ORACLE_PRIVATE_KEY_SECRET}

# API Configuration
API_PORT=3001
API_HOST=0.0.0.0
CORS_ORIGIN=https://weekly.footballsquares.app
JWT_SECRET=${JWT_SECRET}

# Weekly Boards Specific Configuration
WEEKLY_BOARD_CREATE_CRON="0 9 * * 2"  # Tuesdays at 9 AM
WEEKLY_REGISTRATION_BUFFER_MINUTES=60
WEEKLY_AUTO_FILL_THRESHOLD=0.95
WEEKLY_VRF_TRIGGER_MINUTES=40
WEEKLY_HOUSE_RAKE_PERCENTAGE=5
WEEKLY_HOUSE_RAKE_PERCENTAGE_HIGH=8
WEEKLY_CBL_RAKE_PERCENTAGE_LOW=5
WEEKLY_CBL_RAKE_PERCENTAGE_MID=8
WEEKLY_CBL_RAKE_PERCENTAGE_HIGH=10
WEEKLY_VIP_BONUS_HOUSE=5
WEEKLY_VIP_BONUS_CBL=3

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
PROMETHEUS_METRICS_PORT=9090
LOG_LEVEL=info
```

### 10.2 Docker Configuration

```dockerfile
# Dockerfile.weekly-api
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN pnpm run build

FROM node:18-alpine AS runtime

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S weekly -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=weekly:nodejs /app/dist ./dist
COPY --from=builder --chown=weekly:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=weekly:nodejs /app/package*.json ./

USER weekly

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

EXPOSE 3001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### 10.3 Database Backup Strategy

```bash
#!/bin/bash
# scripts/backup-database.sh

set -e

BACKUP_DIR="/backups/weekly-squares"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DB_NAME="weekly_squares"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Full database backup
pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --format=custom \
  --compress=9 \
  --verbose \
  --file="$BACKUP_DIR/weekly_squares_full_$TIMESTAMP.dump"

# Schema-only backup
pg_dump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --username="$DB_USER" \
  --dbname="$DB_NAME" \
  --schema-only \
  --file="$BACKUP_DIR/weekly_squares_schema_$TIMESTAMP.sql"

# Compress and upload to S3 (if configured)
if [[ -n "$AWS_S3_BACKUP_BUCKET" ]]; then
  gzip "$BACKUP_DIR/weekly_squares_full_$TIMESTAMP.dump"
  aws s3 cp \
    "$BACKUP_DIR/weekly_squares_full_$TIMESTAMP.dump.gz" \
    "s3://$AWS_S3_BACKUP_BUCKET/weekly-squares/$TIMESTAMP/"
fi

# Cleanup old local backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.dump" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete

echo "Backup completed: $TIMESTAMP"
```

---

## 11. Testing Strategy

### 11.1 Database Testing

```sql
-- Test data setup for development/testing
-- tests/data/setup-test-data.sql

BEGIN;

-- Create test games
INSERT INTO weekly_games (game_id, week_number, season_year, home_team, away_team, kickoff_time) VALUES
('test_game_1', 1, 2025, 'TST', 'DEV', NOW() + INTERVAL '2 hours'),
('test_game_2', 1, 2025, 'QA', 'STG', NOW() + INTERVAL '3 hours');

-- Test board states
UPDATE weekly_boards SET status = 'open' WHERE game_id = 'test_game_1' AND tier_id = 'tier_1';
UPDATE weekly_boards SET status = 'locked', squares_sold = 97 WHERE game_id = 'test_game_1' AND tier_id = 'tier_2';
UPDATE weekly_boards SET status = 'cancelled', squares_sold = 80 WHERE game_id = 'test_game_1' AND tier_id = 'tier_3';

-- Test VRF data
UPDATE weekly_boards
SET
  home_digits = ARRAY[7,3,9,1,5,8,2,6,4,0],
  away_digits = ARRAY[2,8,4,6,1,9,3,7,0,5],
  randomized_at = NOW() - INTERVAL '30 minutes',
  status = 'randomized'
WHERE game_id = 'test_game_2' AND tier_id = 'tier_1';

COMMIT;
```

### 11.2 Integration Tests

```typescript
// tests/integration/board-lifecycle.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { testDb, cleanupTestData, seedTestData } from '../helpers/database';
import { BoardService } from '../../src/services/BoardService';
import { SquareService } from '../../src/services/SquareService';

describe('Weekly Board Lifecycle', () => {
  let boardService: BoardService;
  let squareService: SquareService;
  let testBoardId: string;

  beforeEach(async () => {
    await seedTestData();
    boardService = new BoardService(testDb);
    squareService = new SquareService(testDb);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it('should create boards for new games', async () => {
    const game = {
      gameId: 'test_lifecycle_game',
      weekNumber: 1,
      seasonYear: 2025,
      homeTeam: 'TST',
      awayTeam: 'DEV',
      kickoffTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    };

    // Create game (should trigger board creation)
    await testDb.query(
      `INSERT INTO weekly_games (game_id, week_number, season_year, home_team, away_team, kickoff_time)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        game.gameId,
        game.weekNumber,
        game.seasonYear,
        game.homeTeam,
        game.awayTeam,
        game.kickoffTime,
      ],
    );

    // Verify boards were created for all active tiers
    const boards = await testDb.query(
      'SELECT * FROM weekly_boards WHERE game_id = $1',
      [game.gameId],
    );

    expect(boards.rows).toHaveLength(7); // All 7 tiers
    expect(boards.rows.every((board) => board.status === 'open')).toBe(true);
  });

  it('should handle 95% threshold correctly', async () => {
    // Create test board
    testBoardId = await boardService.createTestBoard({
      gameId: 'test_threshold_game',
      tierId: 'tier_1',
      weekNumber: 1,
    });

    // Purchase 95 squares (95% filled)
    for (let i = 0; i < 95; i++) {
      await squareService.purchaseSquare({
        boardId: testBoardId,
        squareIndex: i,
        ownerWallet: `test_wallet_${i.toString().padStart(3, '0')}`,
        transactionHash: `test_tx_${i}`,
      });
    }

    // Move time to auto-fill deadline
    await testDb.query(
      `UPDATE weekly_boards 
       SET auto_fill_deadline = NOW() - INTERVAL '1 minute'
       WHERE board_id = $1`,
      [testBoardId],
    );

    // Trigger auto-fill check
    await boardService.checkAutoFillEligibility(testBoardId);

    // Verify board was auto-filled
    const board = await boardService.getBoard(testBoardId);
    expect(board.status).toBe('filled');
    expect(board.squaresSold).toBe(95);
    expect(board.squaresAutoFilled).toBe(5);
  });

  it('should cancel under-filled boards', async () => {
    // Create test board with only 80% fill
    testBoardId = await boardService.createTestBoard({
      gameId: 'test_cancel_game',
      tierId: 'tier_2',
      weekNumber: 1,
    });

    // Purchase only 80 squares (80% filled)
    for (let i = 0; i < 80; i++) {
      await squareService.purchaseSquare({
        boardId: testBoardId,
        squareIndex: i,
        ownerWallet: `test_wallet_${i.toString().padStart(3, '0')}`,
        transactionHash: `test_tx_${i}`,
      });
    }

    // Move time past auto-fill deadline
    await testDb.query(
      `UPDATE weekly_boards 
       SET auto_fill_deadline = NOW() - INTERVAL '1 minute'
       WHERE board_id = $1`,
      [testBoardId],
    );

    // Trigger cancellation check
    await boardService.checkCancellationEligibility(testBoardId);

    // Verify board was cancelled
    const board = await boardService.getBoard(testBoardId);
    expect(board.status).toBe('cancelled');

    // Verify refunds were created
    const refunds = await testDb.query(
      'SELECT * FROM weekly_refunds WHERE board_id = $1',
      [testBoardId],
    );
    expect(refunds.rows).toHaveLength(80);
  });

  it('should enforce VIP tier restrictions', async () => {
    testBoardId = await boardService.createTestBoard({
      gameId: 'test_vip_game',
      tierId: 'tier_5', // VIP tier
      weekNumber: 1,
    });

    // Non-VIP user should be rejected
    await expect(
      squareService.purchaseSquare({
        boardId: testBoardId,
        squareIndex: 0,
        ownerWallet: 'non_vip_wallet',
        transactionHash: 'test_tx_non_vip',
        isVipUser: false,
      }),
    ).rejects.toThrow('VIP status required');

    // VIP user should succeed
    await expect(
      squareService.purchaseSquare({
        boardId: testBoardId,
        squareIndex: 0,
        ownerWallet: 'vip_wallet',
        transactionHash: 'test_tx_vip',
        isVipUser: true,
      }),
    ).resolves.not.toThrow();
  });
});
```

### 11.3 Load Testing

```typescript
// tests/load/purchase-concurrency.test.ts
import { describe, it, expect } from 'vitest';
import { performance } from 'perf_hooks';

describe('Concurrent Purchase Load Test', () => {
  it('should handle concurrent square purchases', async () => {
    const boardId = await setupLoadTestBoard();
    const concurrentUsers = 50;
    const squaresPerUser = 2;

    const startTime = performance.now();

    // Create concurrent purchase attempts
    const purchasePromises = Array.from(
      { length: concurrentUsers },
      async (_, userIndex) => {
        const squareIndices = [userIndex * 2, userIndex * 2 + 1];

        try {
          return await squareService.purchaseSquares({
            boardId,
            squareIndices,
            ownerWallet: `load_test_wallet_${userIndex}`,
            transactionHashes: squareIndices.map((i) => `load_test_tx_${i}`),
          });
        } catch (error) {
          return { error: error.message, userIndex };
        }
      },
    );

    const results = await Promise.allSettled(purchasePromises);
    const endTime = performance.now();

    // Analyze results
    const successful = results.filter(
      (r) => r.status === 'fulfilled' && !r.value.error,
    ).length;
    const failed = results.length - successful;
    const avgResponseTime = (endTime - startTime) / results.length;

    // Assertions
    expect(successful).toBeGreaterThan(concurrentUsers * 0.8); // 80% success rate minimum
    expect(avgResponseTime).toBeLessThan(1000); // Under 1 second average

    // Verify database consistency
    const board = await boardService.getBoard(boardId);
    expect(board.squaresSold).toBe(successful * squaresPerUser);

    console.log(`Load test results:
      Concurrent users: ${concurrentUsers}
      Successful purchases: ${successful}
      Failed purchases: ${failed}
      Success rate: ${((successful / concurrentUsers) * 100).toFixed(1)}%
      Average response time: ${avgResponseTime.toFixed(2)}ms
    `);
  });
});
```

---

## 12. Appendices

### 12.1 Database Schema ERD

```mermaid
erDiagram
    weekly_games ||--o{ weekly_boards : has
    weekly_tiers ||--o{ weekly_boards : configures
    weekly_boards ||--o{ weekly_squares : contains
    weekly_boards ||--o{ weekly_reservations : reserves
    weekly_boards ||--o{ weekly_payouts : generates
    weekly_boards ||--o{ weekly_refunds : may_refund
    weekly_squares ||--o{ weekly_payouts : wins
    weekly_squares ||--o{ weekly_refunds : refunded_from

    weekly_games {
        varchar game_id PK
        integer week_number
        integer season_year
        varchar home_team
        varchar away_team
        timestamp kickoff_time
        varchar game_status
        integer home_score
        integer away_score
        integer current_quarter
    }

    weekly_tiers {
        varchar tier_id PK
        integer tier_number
        integer entry_price_cents
        integer total_pool_cents
        decimal house_rake_percentage
        boolean vip_required
    }

    weekly_boards {
        varchar board_id PK
        varchar game_id FK
        varchar tier_id FK
        integer week_number
        varchar status
        integer squares_sold
        integer squares_auto_filled
        integer_array home_digits
        integer_array away_digits
        timestamp registration_deadline
        timestamp auto_fill_deadline
        timestamp vrf_trigger_time
    }

    weekly_squares {
        bigint id PK
        varchar board_id FK
        integer square_index
        varchar owner_wallet
        varchar purchase_tx
        boolean auto_filled
        timestamp purchased_at
    }

    weekly_reservations {
        bigint id PK
        varchar board_id FK
        integer_array square_indices
        varchar user_wallet
        timestamp reserved_at
        timestamp expires_at
        varchar status
    }

    weekly_payouts {
        bigint id PK
        varchar board_id FK
        integer square_index
        varchar quarter
        integer total_amount_cents
        varchar winner_wallet
        varchar payout_tx
        varchar status
    }
```

### 12.2 API Response Examples

#### Board Detail Response

```json
{
  "board": {
    "boardId": "nfl_2025_w1_dal_nyg_tier_1_1693843200",
    "gameId": "nfl_2025_w1_dal_nyg",
    "tier": {
      "tierId": "tier_1",
      "tierNumber": 1,
      "entryPrice": 500,
      "totalPool": 50000,
      "playerPool": 47500,
      "houseRake": 5.0,
      "vipRequired": false
    },
    "status": "open",
    "squaresSold": 23,
    "squaresAutoFilled": 0,
    "fillPercentage": 23.0,
    "homeDigits": null,
    "awayDigits": null,
    "timing": {
      "registrationDeadline": "2025-09-08T12:00:00Z",
      "autoFillDeadline": "2025-09-08T12:15:00Z",
      "vrfTriggerTime": "2025-09-08T12:20:00Z",
      "kickoffTime": "2025-09-08T13:00:00Z"
    },
    "payoutVariant": "forward",
    "payoutSplits": {
      "q1": { "forward": 15, "alt": 0 },
      "q2": { "forward": 25, "alt": 0 },
      "q3": { "forward": 15, "alt": 0 },
      "q4": { "forward": 45, "alt": 0 }
    }
  },
  "squares": [
    {
      "index": 0,
      "homeIndex": 0,
      "awayIndex": 0,
      "owner": "A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6Q7R8S9T0",
      "purchasedAt": "2025-09-08T10:30:00Z",
      "autoFilled": false
    },
    {
      "index": 1,
      "homeIndex": 0,
      "awayIndex": 1,
      "owner": null,
      "purchasedAt": null,
      "autoFilled": false
    }
  ],
  "game": {
    "gameId": "nfl_2025_w1_dal_nyg",
    "week": 1,
    "homeTeam": "DAL",
    "awayTeam": "NYG",
    "kickoffTime": "2025-09-08T13:00:00Z",
    "status": "scheduled",
    "homeScore": 0,
    "awayScore": 0,
    "currentQuarter": 0
  }
}
```

### 12.3 Configuration Reference

#### Complete Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=weekly_squares
DB_USER=weekly_api
DB_PASSWORD=secure_password
DB_SSL=false
DB_POOL_SIZE=10
DB_TIMEOUT=30000

# Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
CACHE_TTL_BOARD_DETAIL=60
CACHE_TTL_BOARD_LIST=300
CACHE_TTL_USER_DATA=300

# Blockchain
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_WS_URL=wss://api.devnet.solana.com
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
ANCHOR_WALLET=/path/to/wallet.json

# VRF Configuration
VRF_PROGRAM_ID=vrf_program_public_key
VRF_QUEUE_ID=vrf_queue_public_key
VRF_AUTHORITY_KEYPAIR=/path/to/vrf_authority.json

# Oracle Configuration
ORACLE_PRIVATE_KEY=oracle_private_key_base58
NFL_API_KEY=nfl_api_key
NFL_API_URL=https://api.nfl.com/v1

# Weekly Boards Configuration
WEEKLY_BOARD_CREATE_CRON="0 9 * * 2"
WEEKLY_REGISTRATION_BUFFER_MINUTES=60
WEEKLY_AUTO_FILL_THRESHOLD=0.95
WEEKLY_VRF_TRIGGER_MINUTES=40
WEEKLY_HOUSE_RAKE_PERCENTAGE=5
WEEKLY_HOUSE_RAKE_PERCENTAGE_HIGH=8
WEEKLY_CBL_RAKE_PERCENTAGE_LOW=5
WEEKLY_CBL_RAKE_PERCENTAGE_MID=8
WEEKLY_CBL_RAKE_PERCENTAGE_HIGH=10
WEEKLY_VIP_BONUS_HOUSE=5
WEEKLY_VIP_BONUS_CBL=3
WEEKLY_MAX_SQUARES_STANDARD=5
WEEKLY_MAX_SQUARES_VIP=10

# API Configuration
API_PORT=3001
API_HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN=https://your-sentry-dsn
LOG_LEVEL=info
METRICS_PORT=9090
HEALTH_CHECK_INTERVAL=30000

# Email (Proton Mail Bridge)
SMTP_HOST=127.0.0.1
SMTP_PORT=1025
SMTP_USER=your_proton_email
SMTP_PASS=your_proton_bridge_password
SMTP_FROM=notifications@footballsquares.app

# AWS (if using cloud services)
AWS_REGION=us-east-1
AWS_S3_BACKUP_BUCKET=weekly-squares-backups
AWS_CLOUDWATCH_LOG_GROUP=/aws/weekly-squares
```

---

## Document Version History

| Version | Date       | Author      | Changes                                    |
| ------- | ---------- | ----------- | ------------------------------------------ |
| 1.0     | 2025-07-26 | Claude Code | Initial comprehensive schema specification |

---

**End of Document**

_This specification serves as the definitive technical reference for implementing the Weekly Football Squares database layer. All backend development should align with these schemas, constraints, and patterns to ensure system reliability and maintainability._
