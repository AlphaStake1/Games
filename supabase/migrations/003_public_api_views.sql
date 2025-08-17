-- Football Squares Platform - Public API Views
-- Run this AFTER 002_security_policies.sql

-- ============================================
-- PUBLIC VIEWS (Safe for client access)
-- ============================================

-- Create public schema views that hide sensitive data
-- These views are what your frontend will query

-- Public board view
CREATE OR REPLACE VIEW public.boards AS
SELECT 
  id,
  game_id,
  sport,
  home_team,
  away_team,
  game_date,
  board_type,
  square_price,
  total_pot,
  payout_structure,
  status,
  created_at,
  locked_at,
  (SELECT COUNT(*) FROM fsq_private.squares s WHERE s.board_id = b.id AND s.owner_id IS NOT NULL) as squares_sold,
  100 - (SELECT COUNT(*) FROM fsq_private.squares s WHERE s.board_id = b.id AND s.owner_id IS NOT NULL) as squares_available
FROM fsq_private.boards b
WHERE status != 'draft';

-- Public squares view (anonymized)
CREATE OR REPLACE VIEW public.squares AS
SELECT 
  s.id,
  s.board_id,
  s.position,
  s.row_number,
  s.col_number,
  CASE 
    WHEN s.owner_id IS NOT NULL THEN 
      COALESCE(u.display_name, SUBSTR(u.wallet_address, 1, 4) || '...' || SUBSTR(u.wallet_address, -4, 4))
    ELSE NULL
  END as owner_display,
  s.owner_id IS NOT NULL as is_sold,
  s.is_winner,
  s.winning_quarter
FROM fsq_private.squares s
LEFT JOIN fsq_private.users u ON u.id = s.owner_id
WHERE EXISTS (
  SELECT 1 FROM fsq_private.boards b 
  WHERE b.id = s.board_id 
  AND b.status IN ('open', 'locked', 'in_progress', 'completed')
);

-- Public leaderboard view
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
  ROW_NUMBER() OVER (ORDER BY total_earnings DESC) as rank,
  display_name,
  total_wins,
  total_earnings,
  created_at
FROM fsq_private.users
WHERE is_banned = FALSE
  AND total_earnings > 0
ORDER BY total_earnings DESC
LIMIT 100;

-- Public game results view
CREATE OR REPLACE VIEW public.game_results AS
SELECT 
  gr.id,
  gr.board_id,
  gr.quarter,
  gr.home_score,
  gr.away_score,
  gr.home_last_digit,
  gr.away_last_digit,
  gr.recorded_at,
  b.home_team,
  b.away_team
FROM fsq_private.game_results gr
JOIN fsq_private.boards b ON b.id = gr.board_id
WHERE b.status IN ('in_progress', 'completed');

-- Recent winners view
CREATE OR REPLACE VIEW public.recent_winners AS
SELECT 
  b.game_id,
  b.home_team,
  b.away_team,
  s.winning_quarter,
  u.display_name as winner_name,
  (b.total_pot * CAST(b.payout_structure->>s.winning_quarter AS DECIMAL)) as payout_amount,
  gr.recorded_at as won_at
FROM fsq_private.squares s
JOIN fsq_private.boards b ON b.id = s.board_id
JOIN fsq_private.users u ON u.id = s.owner_id
JOIN fsq_private.game_results gr ON gr.board_id = b.id AND gr.quarter = s.winning_quarter
WHERE s.is_winner = TRUE
  AND b.status = 'completed'
ORDER BY gr.recorded_at DESC
LIMIT 10;

-- ============================================
-- API FUNCTIONS (For ElizaOS agents to call)
-- ============================================

-- Function for purchasing a square
CREATE OR REPLACE FUNCTION public.purchase_square(
  p_board_id UUID,
  p_position INTEGER,
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_square_price DECIMAL;
  v_board_status TEXT;
BEGIN
  -- Check board status
  SELECT status, square_price INTO v_board_status, v_square_price
  FROM fsq_private.boards
  WHERE id = p_board_id;
  
  IF v_board_status != 'open' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Board is not open for purchases');
  END IF;
  
  -- Check if square is available
  IF EXISTS (
    SELECT 1 FROM fsq_private.squares 
    WHERE board_id = p_board_id 
    AND position = p_position 
    AND owner_id IS NOT NULL
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Square already taken');
  END IF;
  
  -- Purchase the square
  UPDATE fsq_private.squares
  SET 
    owner_id = p_user_id,
    purchased_at = NOW()
  WHERE board_id = p_board_id 
    AND position = p_position
    AND owner_id IS NULL;
  
  -- Update board total pot
  UPDATE fsq_private.boards
  SET total_pot = total_pot + v_square_price
  WHERE id = p_board_id;
  
  -- Log the action
  PERFORM fsq_private.log_action(
    'purchase_square', 
    'squares', 
    p_board_id,
    jsonb_build_object('position', p_position, 'price', v_square_price)
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'position', p_position,
    'price', v_square_price
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new board (Coach B only)
CREATE OR REPLACE FUNCTION public.create_board(
  p_game_id TEXT,
  p_home_team TEXT,
  p_away_team TEXT,
  p_game_date TIMESTAMPTZ,
  p_square_price DECIMAL,
  p_board_type TEXT DEFAULT 'standard'
)
RETURNS UUID AS $$
DECLARE
  v_board_id UUID;
  v_agent_id UUID;
BEGIN
  -- Verify caller is Coach B
  SELECT id INTO v_agent_id
  FROM fsq_private.agents
  WHERE name = 'Coach B' AND id = auth.uid();
  
  IF v_agent_id IS NULL THEN
    RAISE EXCEPTION 'Only Coach B can create boards';
  END IF;
  
  -- Create the board
  INSERT INTO fsq_private.boards (
    game_id, 
    home_team, 
    away_team, 
    game_date, 
    square_price, 
    board_type,
    status,
    created_by
  ) VALUES (
    p_game_id,
    p_home_team,
    p_away_team,
    p_game_date,
    p_square_price,
    p_board_type,
    'draft',
    v_agent_id
  ) RETURNING id INTO v_board_id;
  
  -- Create 100 squares
  INSERT INTO fsq_private.squares (board_id, position)
  SELECT v_board_id, generate_series(0, 99);
  
  -- Log the action
  PERFORM fsq_private.log_action(
    'create_board', 
    'boards', 
    v_board_id,
    jsonb_build_object('game_id', p_game_id, 'teams', p_home_team || ' vs ' || p_away_team)
  );
  
  RETURN v_board_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to randomize board numbers (Coach B only)
CREATE OR REPLACE FUNCTION public.randomize_board(p_board_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_row_numbers INTEGER[];
  v_col_numbers INTEGER[];
BEGIN
  -- Verify board is locked
  IF NOT EXISTS (
    SELECT 1 FROM fsq_private.boards 
    WHERE id = p_board_id 
    AND status = 'locked'
  ) THEN
    RAISE EXCEPTION 'Board must be locked before randomization';
  END IF;
  
  -- Generate random number arrays
  v_row_numbers := ARRAY(SELECT generate_series(0,9) ORDER BY RANDOM());
  v_col_numbers := ARRAY(SELECT generate_series(0,9) ORDER BY RANDOM());
  
  -- Update squares with random numbers
  UPDATE fsq_private.squares
  SET 
    row_number = v_row_numbers[(position / 10) + 1],
    col_number = v_col_numbers[(position % 10) + 1]
  WHERE board_id = p_board_id;
  
  -- Log the action
  PERFORM fsq_private.log_action(
    'randomize_board', 
    'boards', 
    p_board_id,
    jsonb_build_object('randomized', true)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE! Next run 004_production_security.sql
-- ============================================