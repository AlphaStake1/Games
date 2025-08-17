-- Football Squares Platform - Security Policies
-- Run this AFTER 001_initial_schema.sql

-- ============================================
-- USER POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "users_view_own" ON fsq_private.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON fsq_private.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_banned = FALSE);

-- Agents can view all users (for support)
CREATE POLICY "agents_view_users" ON fsq_private.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.is_active = TRUE
    )
  );

-- ============================================
-- AGENT POLICIES
-- ============================================

-- Everyone can view active agents
CREATE POLICY "view_active_agents" ON fsq_private.agents
  FOR SELECT USING (is_active = TRUE);

-- Only Jerry can modify agents
CREATE POLICY "jerry_manage_agents" ON fsq_private.agents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Jerry' 
      AND agents.id = auth.uid()
    )
  );

-- ============================================
-- BOARD POLICIES
-- ============================================

-- Anyone can view open/active boards
CREATE POLICY "view_public_boards" ON fsq_private.boards
  FOR SELECT USING (status IN ('open', 'locked', 'in_progress', 'completed'));

-- Coach B can create and manage boards
CREATE POLICY "coach_b_manage_boards" ON fsq_private.boards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Coach B' 
      AND agents.id = auth.uid()
      AND agents.is_active = TRUE
    )
  );

-- Jerry (GM) has override access to all boards
CREATE POLICY "jerry_gm_override_boards" ON fsq_private.boards
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Jerry' 
      AND agents.id = auth.uid()
    )
  );

-- ============================================
-- SQUARE POLICIES
-- ============================================

-- Anyone can view squares on public boards
CREATE POLICY "view_public_squares" ON fsq_private.squares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fsq_private.boards 
      WHERE boards.id = squares.board_id 
      AND boards.status IN ('open', 'locked', 'in_progress', 'completed')
    )
  );

-- Users can purchase available squares
CREATE POLICY "users_purchase_squares" ON fsq_private.squares
  FOR UPDATE USING (
    owner_id IS NULL 
    AND EXISTS (
      SELECT 1 FROM fsq_private.boards 
      WHERE boards.id = squares.board_id 
      AND boards.status = 'open'
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM fsq_private.users 
      WHERE users.id = auth.uid() 
      AND users.is_banned = TRUE
    )
  );

-- Coach B can manage all squares
CREATE POLICY "coach_b_manage_squares" ON fsq_private.squares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Coach B' 
      AND agents.id = auth.uid()
    )
  );

-- ============================================
-- TRANSACTION POLICIES
-- ============================================

-- Users can view their own transactions
CREATE POLICY "users_view_own_transactions" ON fsq_private.transactions
  FOR SELECT USING (user_id = auth.uid());

-- Financial agents can view all transactions
CREATE POLICY "finance_view_transactions" ON fsq_private.transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.name IN ('Jordan Banks', 'Jerry', 'Dean')
      AND agents.is_active = TRUE
    )
  );

-- Only financial agents can create transactions
CREATE POLICY "finance_create_transactions" ON fsq_private.transactions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.name IN ('Coach B', 'Jordan Banks', 'Jerry')
      AND agents.is_active = TRUE
    )
  );

-- ============================================
-- GAME RESULTS POLICIES  
-- ============================================

-- Anyone can view game results
CREATE POLICY "view_game_results" ON fsq_private.game_results
  FOR SELECT USING (TRUE);

-- Only Coach B can record game results
CREATE POLICY "coach_b_record_results" ON fsq_private.game_results
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Coach B' 
      AND agents.id = auth.uid()
    )
  );

-- Jerry (GM) can override/update results
CREATE POLICY "jerry_gm_update_results" ON fsq_private.game_results
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.name = 'Jerry' 
      AND agents.id = auth.uid()
    )
  );

-- ============================================
-- AUDIT LOG POLICIES
-- ============================================

-- Only Dean and Jerry can view audit logs
CREATE POLICY "security_view_audit" ON fsq_private.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.name IN ('Dean', 'Jerry')
      AND agents.is_active = TRUE
    )
  );

-- System can insert audit logs (using service role)
-- No policy needed as service role bypasses RLS

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to check if user is an agent
CREATE OR REPLACE FUNCTION fsq_private.is_agent(agent_name TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  IF agent_name IS NULL THEN
    RETURN EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.is_active = TRUE
    );
  ELSE
    RETURN EXISTS (
      SELECT 1 FROM fsq_private.agents 
      WHERE agents.id = auth.uid() 
      AND agents.name = agent_name
      AND agents.is_active = TRUE
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log actions (for audit trail)
CREATE OR REPLACE FUNCTION fsq_private.log_action(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID,
  p_changes JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO fsq_private.audit_log (
    action, 
    table_name, 
    record_id, 
    user_id,
    agent_id,
    changes
  ) VALUES (
    p_action,
    p_table_name,
    p_record_id,
    auth.uid(),
    CASE 
      WHEN fsq_private.is_agent() THEN auth.uid()
      ELSE NULL
    END,
    p_changes
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE! Next run 003_public_api_views.sql
-- ============================================